"""Notification service supporting In-App, Mock SMS, and Simulated Voice alerts."""
import logging
from typing import Optional
from sqlalchemy.orm import Session
from app.models.models import Notification, NotificationType, NotificationChannel
from app.websocket.manager import ws_manager

logger = logging.getLogger("kisanflow.notifications")


class MockSMSService:
    def send_sms(self, to_number: str, message: str) -> bool:
        logger.info(f"[SIMULATED SMS] To: {to_number} | Message: {message}")
        return True


class MockVoiceService:
    def trigger_voice_call(self, to_number: str, message_script: str) -> bool:
        logger.info(f"[SIMULATED VOICE ALERT] Calling {to_number} | Audio: '{message_script}'")
        return True


class NotificationManager:
    def __init__(self):
        self.sms_service = MockSMSService()
        self.voice_service = MockVoiceService()

    async def send_notification(
        self,
        db: Session,
        farmer_id: int,
        type: NotificationType,
        title: str,
        message: str,
        channel: NotificationChannel = NotificationChannel.IN_APP,
        token_id: Optional[int] = None,
        farmer_mobile: Optional[str] = None
    ) -> Notification:
        # Create database record
        notification = Notification(
            farmer_id=farmer_id,
            token_id=token_id,
            type=type,
            channel=channel,
            title=title,
            message=message,
            read=False
        )
        db.add(notification)
        db.commit()
        db.refresh(notification)

        # Broadcast via WebSocket to farmer room
        notification_payload = {
            "id": notification.id,
            "type": notification.type.value,
            "title": notification.title,
            "message": notification.message,
            "channel": notification.channel.value,
            "token_id": notification.token_id,
            "created_at": notification.created_at.isoformat() if notification.created_at else None
        }
        await ws_manager.broadcast_to_room(f"farmer:{farmer_id}", "notification.created", notification_payload)

        # Trigger simulated SMS/Voice if requested
        if channel == NotificationChannel.SMS and farmer_mobile:
            self.sms_service.send_sms(farmer_mobile, f"{title}: {message}")
        elif channel == NotificationChannel.VOICE and farmer_mobile:
            self.voice_service.trigger_voice_call(farmer_mobile, message)

        return notification


notification_service = NotificationManager()
