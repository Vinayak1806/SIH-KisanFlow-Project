"""Queue calculation, live tracking, and real-time event distribution service."""
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.models import Token, Center, Counter, CounterStatus, TokenStatus, ProcurementStage, NotificationType
from app.services.redis_service import redis_service
from app.services.notification_service import notification_service
from app.websocket.manager import ws_manager
from app.ml.predict import predict_wait_time
import logging

logger = logging.getLogger("kisanflow.queue")


class QueueService:
    """Handles queue updates, real-time broadcasts, and wait time re-evaluations."""

    async def add_token_to_queue(self, db: Session, token: Token) -> int:
        """Enqueue token and recalculate center queue positions."""
        # Score based on creation timestamp (FIFO)
        score = token.created_at.timestamp() if token.created_at else 0.0
        pos = redis_service.push_token(token.center_id, token.token_id, score)

        token.queue_position = pos
        token.status = TokenStatus.IN_QUEUE
        db.commit()

        # Recalculate queue for all farmers in this center
        await self.recalculate_and_broadcast_queue(db, token.center_id)
        return pos

    async def recalculate_and_broadcast_queue(self, db: Session, center_id: int):
        """
        Recalculates positions and AI wait times for all queued tokens at this center,
        notifies affected farmers if position improved, and sends updates over WebSockets.
        """
        center = db.query(Center).filter(Center.id == center_id).first()
        if not center:
            return

        active_counters = max(1, center.active_counters)
        queued_tokens = db.query(Token).filter(
            Token.center_id == center_id,
            Token.status.in_([TokenStatus.CONFIRMED, TokenStatus.IN_QUEUE, TokenStatus.IN_PROGRESS])
        ).order_by(Token.created_at.asc()).all()

        total_in_queue = len(queued_tokens)

        for idx, token in enumerate(queued_tokens):
            new_position = idx + 1
            old_position = token.queue_position

            # Predict wait time
            est_wait, conf, method = predict_wait_time({
                "queue_length": new_position,
                "active_counters": active_counters,
                "historical_processing_time": center.average_processing_time,
                "crop": token.crop.name if token.crop else "Wheat"
            })

            token.queue_position = new_position
            token.estimated_wait = est_wait

            # Proactive notification if position changed or turn approaching
            if old_position is not None and new_position < old_position:
                if new_position <= 3 and old_position > 3:
                    await notification_service.send_notification(
                        db=db,
                        farmer_id=token.farmer_id,
                        type=NotificationType.TURN_APPROACHING,
                        title="Your turn is approaching! / तुमची पाळी जवळ आली आहे",
                        message=f"You are now position #{new_position}. Please proceed to {center.name}.",
                        token_id=token.id
                    )
                elif (old_position - new_position) >= 2 or new_position <= 5:
                    await notification_service.send_notification(
                        db=db,
                        farmer_id=token.farmer_id,
                        type=NotificationType.QUEUE_UPDATE,
                        title=f"Queue position updated: #{new_position}",
                        message=f"Position changed: {old_position} → {new_position}. Estimated wait: {int(est_wait)} min.",
                        token_id=token.id
                    )

        db.commit()

        # Check congestion: queue_length / active_counters > 8
        congestion_ratio = total_in_queue / active_counters if active_counters > 0 else total_in_queue
        is_congested = congestion_ratio > 8.0

        # Broadcast queue update to center room
        queue_data = {
            "center_id": center_id,
            "center_name": center.name,
            "total_waiting": total_in_queue,
            "active_counters": active_counters,
            "is_congested": is_congested,
            "congestion_ratio": round(congestion_ratio, 1)
        }
        await ws_manager.broadcast_to_room(f"center:{center_id}", "queue.updated", queue_data)

        # Broadcast to admin room
        await ws_manager.broadcast_to_room("admin", "center.congestion_changed", {
            "center_id": center_id,
            "name": center.name,
            "queue_length": total_in_queue,
            "active_counters": active_counters,
            "ratio": round(congestion_ratio, 1),
            "level": "high" if is_congested else ("moderate" if congestion_ratio > 4 else "low"),
            "recommendation": f"Activate counter to reduce wait time" if is_congested else "Normal operating load"
        })

    async def advance_counter(self, db: Session, counter_id: int, completed_token_id: Optional[int] = None):
        """Assign next queued token to the counter."""
        counter = db.query(Counter).filter(Counter.id == counter_id).first()
        if not counter:
            return None

        # Next waiting token
        next_token = db.query(Token).filter(
            Token.center_id == counter.center_id,
            Token.status == TokenStatus.IN_QUEUE,
            Token.counter_id == None
        ).order_by(Token.queue_position.asc()).first()

        if next_token:
            counter.current_token_id = next_token.id
            next_token.counter_id = counter.id
            next_token.status = TokenStatus.IN_PROGRESS
            db.commit()

            # Notify farmer
            await notification_service.send_notification(
                db=db,
                farmer_id=next_token.farmer_id,
                type=NotificationType.COUNTER_ASSIGNED,
                title=f"Proceed to Counter {counter.counter_number}",
                message=f"Your token {next_token.token_id} has been called at Counter {counter.counter_number}.",
                token_id=next_token.id
            )

            await ws_manager.broadcast_to_room(
                f"center:{counter.center_id}",
                "token.counter_assigned",
                {"token_id": next_token.token_id, "counter_number": counter.counter_number}
            )

        await self.recalculate_and_broadcast_queue(db, counter.center_id)
        return next_token


queue_service = QueueService()
