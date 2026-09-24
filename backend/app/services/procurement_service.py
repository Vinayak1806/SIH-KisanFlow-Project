"""Procurement lifecycle service: Verification -> Weighing -> Procurement -> Receipt -> Payment."""
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.models import (
    Token, ProcurementStageLog, StageLog, Receipt, Center, CropPrice,
    TokenStatus, ProcurementStage, StageStatus, PaymentStatus, NotificationType, NotificationChannel
)
from app.services.notification_service import notification_service
from app.services.redis_service import redis_service
from app.services.queue_service import queue_service
from app.websocket.manager import ws_manager


class ProcurementService:
    """Manages the full lifecycle of agricultural procurement stages with audit logs."""

    def _log_stage_change(
        self,
        db: Session,
        token: Token,
        from_stage: Optional[str],
        to_stage: str,
        officer_id: Optional[int],
        notes: Optional[str]
    ):
        """Append audit record to stage_logs table."""
        audit = StageLog(
            token_id=token.id,
            from_stage=from_stage,
            to_stage=to_stage,
            changed_by=officer_id,
            timestamp=datetime.utcnow(),
            notes=notes
        )
        db.add(audit)
        db.commit()

    async def verify_farmer(
        self,
        db: Session,
        token_id: str,
        officer_id: Optional[int] = None,
        notes: Optional[str] = None
    ) -> Token:
        token = db.query(Token).filter(Token.token_id == token_id).first()
        if not token:
            raise ValueError(f"Token {token_id} not found")

        old_stage = token.current_stage.value
        token.current_stage = ProcurementStage.WEIGHING
        token.status = TokenStatus.IN_PROGRESS
        db.commit()

        self._log_stage_change(db, token, old_stage, ProcurementStage.WEIGHING.value, officer_id, notes)

        # Notify Farmer
        await notification_service.send_notification(
            db=db,
            farmer_id=token.farmer_id,
            type=NotificationType.VERIFICATION_COMPLETE,
            title="Documents Verified / कागदपत्र पडताळणी पूर्ण",
            message=f"Token {token.token_id}: Documents successfully verified. Proceed to Weighbridge.",
            token_id=token.id
        )

        await ws_manager.broadcast_to_room(
            f"center:{token.center_id}",
            "token.stage_changed",
            {"token_id": token.token_id, "stage": "weighing"}
        )
        return token

    async def record_weighing(
        self,
        db: Session,
        token_id: str,
        actual_quantity: float,
        officer_id: Optional[int] = None,
        notes: Optional[str] = None
    ) -> Token:
        if actual_quantity <= 0:
            raise ValueError("Actual quantity must be greater than 0")

        token = db.query(Token).filter(Token.token_id == token_id).first()
        if not token:
            raise ValueError(f"Token {token_id} not found")

        old_stage = token.current_stage.value
        token.actual_quantity = actual_quantity
        token.current_stage = ProcurementStage.PROCUREMENT
        db.commit()

        self._log_stage_change(
            db, token, old_stage, ProcurementStage.PROCUREMENT.value, officer_id,
            notes or f"Weighed: {actual_quantity} Quintals"
        )

        await notification_service.send_notification(
            db=db,
            farmer_id=token.farmer_id,
            type=NotificationType.WEIGHING_COMPLETE,
            title="Weighing Completed / वजन पूर्ण झाले",
            message=f"Actual Weight recorded: {actual_quantity} Quintals. Procurement acceptance in progress.",
            token_id=token.id
        )

        await ws_manager.broadcast_to_room(
            f"center:{token.center_id}",
            "token.stage_changed",
            {"token_id": token.token_id, "stage": "procurement", "actual_quantity": actual_quantity}
        )
        return token

    async def complete_procurement(
        self,
        db: Session,
        token_id: str,
        officer_id: Optional[int] = None,
        notes: Optional[str] = None
    ) -> Token:
        token = db.query(Token).filter(Token.token_id == token_id).first()
        if not token:
            raise ValueError(f"Token {token_id} not found")

        old_stage = token.current_stage.value
        token.current_stage = ProcurementStage.RECEIPT

        # Determine procurement rate (look up active center price or fallback)
        price_record = db.query(CropPrice).filter(
            CropPrice.center_id == token.center_id,
            CropPrice.crop_id == token.crop_id
        ).first()

        rate = price_record.price if price_record else (token.crop.reference_price or 2425.0)
        token.procurement_rate = rate
        quantity_to_bill = token.actual_quantity if token.actual_quantity else token.quantity
        token.total_amount = round(quantity_to_bill * rate, 2)
        db.commit()

        self._log_stage_change(db, token, old_stage, ProcurementStage.RECEIPT.value, officer_id, notes)

        # Automatically generate receipt
        receipt_num = f"RCPT-2026-{token.id:05d}"
        receipt = db.query(Receipt).filter(Receipt.token_id == token.id).first()
        if not receipt:
            receipt = Receipt(
                receipt_id=receipt_num,
                token_id=token.id,
                farmer_name=token.farmer.name,
                crop_name=token.crop.name,
                quantity=quantity_to_bill,
                rate=rate,
                total_amount=token.total_amount,
                center_name=token.center.name,
                generated_at=datetime.utcnow()
            )
            db.add(receipt)
            db.commit()

        await notification_service.send_notification(
            db=db,
            farmer_id=token.farmer_id,
            type=NotificationType.PROCUREMENT_COMPLETE,
            title="Procurement Accepted / धान्य खरेदी यशस्वी",
            message=f"{quantity_to_bill} Q of {token.crop.name} accepted at ₹{rate:,.0f}/Q. Total: ₹{token.total_amount:,.0f}.",
            token_id=token.id
        )

        await ws_manager.broadcast_to_room(
            f"center:{token.center_id}",
            "token.stage_changed",
            {"token_id": token.token_id, "stage": "receipt", "receipt_id": receipt.receipt_id}
        )
        return token

    async def complete_payment(
        self,
        db: Session,
        token_id: str,
        officer_id: Optional[int] = None,
        notes: Optional[str] = None
    ) -> Token:
        token = db.query(Token).filter(Token.token_id == token_id).first()
        if not token:
            raise ValueError(f"Token {token_id} not found")

        old_stage = token.current_stage.value
        token.current_stage = ProcurementStage.PAYMENT
        token.payment_status = PaymentStatus.COMPLETED
        token.status = TokenStatus.COMPLETED
        token.queue_position = None
        token.estimated_wait = 0.0
        db.commit()

        self._log_stage_change(
            db, token, old_stage, ProcurementStage.PAYMENT.value, officer_id,
            notes or f"Direct Benefit Transfer Payment of ₹{token.total_amount:,.0f} processed."
        )

        # Remove from active queue
        redis_service.remove_token(token.center_id, token.token_id)

        # Send both in-app notification and simulated SMS
        await notification_service.send_notification(
            db=db,
            farmer_id=token.farmer_id,
            type=NotificationType.PAYMENT_COMPLETE,
            channel=NotificationChannel.IN_APP,
            title="Payment Completed / बँक खात्यात रक्कम जमा",
            message=f"₹{token.total_amount:,.0f} has been transferred to your bank account via Direct Benefit Transfer.",
            token_id=token.id,
            farmer_mobile=token.farmer.mobile_number
        )

        # Broadcast payment completion
        await ws_manager.broadcast_to_room(
            f"center:{token.center_id}",
            "payment.completed",
            {
                "token_id": token.token_id,
                "amount": token.total_amount,
                "farmer_name": token.farmer.name
            }
        )

        # Recalculate remaining queue
        await queue_service.recalculate_and_broadcast_queue(db, token.center_id)
        return token

    async def mark_no_show(
        self,
        db: Session,
        token_id: str,
        officer_id: Optional[int] = None,
        notes: Optional[str] = None
    ) -> Token:
        token = db.query(Token).filter(Token.token_id == token_id).first()
        if not token:
            raise ValueError(f"Token {token_id} not found")

        token.status = TokenStatus.NO_SHOW
        token.queue_position = None
        db.commit()

        self._log_stage_change(db, token, token.current_stage.value, "no_show", officer_id, notes)
        redis_service.remove_token(token.center_id, token.token_id)
        await queue_service.recalculate_and_broadcast_queue(db, token.center_id)
        return token


procurement_service = ProcurementService()
