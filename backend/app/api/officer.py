"""Officer Dashboard API router."""
from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.models import Officer, Center, Counter, Token, TokenStatus, User, UserRole, CounterStatus, NotificationType, NotificationChannel
from app.schemas.schemas import OfficerDashboardResponse, CounterResponse, ProcurementTokenResponse
from app.middleware.auth import require_role
from app.services.queue_service import queue_service
from app.services.notification_service import notification_service
from app.websocket.manager import ws_manager

router = APIRouter(prefix="/officer", tags=["Officer Operations"])


class VoiceAlertSimulationRequest(BaseModel):
    token_id: str
    counter_number: int
    farmer_name: str


@router.get("/dashboard", response_model=OfficerDashboardResponse)
def get_officer_dashboard(
    current_user: User = Depends(require_role(UserRole.OFFICER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    officer = db.query(Officer).filter(Officer.user_id == current_user.id).first()
    center_id = officer.center_id if officer and officer.center_id else 1
    center = db.query(Center).filter(Center.id == center_id).first()

    if not center:
        raise HTTPException(status_code=404, detail="Assigned center not found")

    waiting = db.query(Token).filter(
        Token.center_id == center.id,
        Token.status == TokenStatus.IN_QUEUE
    ).count()

    processing = db.query(Token).filter(
        Token.center_id == center.id,
        Token.status == TokenStatus.IN_PROGRESS
    ).count()

    completed = db.query(Token).filter(
        Token.center_id == center.id,
        Token.status == TokenStatus.COMPLETED
    ).count()

    no_show = db.query(Token).filter(
        Token.center_id == center.id,
        Token.status == TokenStatus.NO_SHOW
    ).count()

    return OfficerDashboardResponse(
        center_name=center.name,
        center_id=center.id,
        waiting=waiting,
        processing=processing,
        completed=completed,
        no_show=no_show,
        average_wait=center.average_processing_time,
        active_counters=center.active_counters,
        total_counters=center.total_counters
    )


@router.get("/counters", response_model=List[CounterResponse])
def get_center_counters(
    current_user: User = Depends(require_role(UserRole.OFFICER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    officer = db.query(Officer).filter(Officer.user_id == current_user.id).first()
    center_id = officer.center_id if officer and officer.center_id else 1

    counters = db.query(Counter).filter(Counter.center_id == center_id).order_by(Counter.counter_number.asc()).all()
    results = []
    for c in counters:
        results.append(CounterResponse(
            id=c.id,
            center_id=c.center_id,
            counter_number=c.counter_number,
            status=c.status.value,
            current_token_id=c.current_token_id,
            current_token_str=c.current_token.token_id if c.current_token else None,
            activated_at=c.activated_at
        ))
    return results


@router.post("/counters/{counter_id}/call-next")
async def call_next_farmer(
    counter_id: int,
    current_user: User = Depends(require_role(UserRole.OFFICER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Officer calls next farmer in queue to this counter."""
    next_token = await queue_service.advance_counter(db, counter_id)
    if not next_token:
        return {"message": "No farmers waiting in queue for this center", "token": None}

    return {
        "message": f"Assigned token {next_token.token_id} to counter",
        "token_id": next_token.token_id,
        "farmer_name": next_token.farmer.name if next_token.farmer else "Farmer"
    }


@router.post("/simulate-voice-alert")
async def simulate_voice_alert(
    req: VoiceAlertSimulationRequest,
    current_user: User = Depends(require_role(UserRole.OFFICER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Simulate audio/voice alert announcement for low-literacy farmers."""
    message = (
        f"लक्ष द्या: शेतकरी बांधव {req.farmer_name}, तुमचे टोकन {req.token_id} "
        f"आता काउंटर क्रमांक {req.counter_number} वर बोलावले आहे. कृपया त्वरित उपस्थित राहावे."
    )
    english_script = f"Attention: Farmer {req.farmer_name}, Token {req.token_id} is now called at Counter {req.counter_number}."

    # Broadcast voice simulated alert event
    await ws_manager.broadcast_all("voice.alert", {
        "token_id": req.token_id,
        "farmer_name": req.farmer_name,
        "counter_number": req.counter_number,
        "marathi_script": message,
        "english_script": english_script
    })

    return {
        "status": "success",
        "voice_script_marathi": message,
        "voice_script_english": english_script,
        "hint": "Playing simulated automated voice broadcast via browser Web Speech API / TTS"
    }
