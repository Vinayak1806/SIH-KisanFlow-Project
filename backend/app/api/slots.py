"""Slots API router for date/time booking."""
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.models import Slot, Center, SlotStatus, Token, Farmer, User, UserRole, ProcurementStage, TokenStatus
from app.schemas.schemas import SlotResponse, SlotBookRequest, ProcurementTokenResponse
from app.middleware.auth import get_current_user, require_role
from app.services.queue_service import queue_service

router = APIRouter(prefix="/slots", tags=["Slots"])


@router.get("", response_model=List[SlotResponse])
def get_slots(
    center_id: int = Query(...),
    date: Optional[str] = Query(None, description="Date in YYYY-MM-DD"),
    db: Session = Depends(get_db)
):
    """Retrieve available booking slots for a center."""
    query = db.query(Slot).filter(Slot.center_id == center_id)
    if date:
        query = query.filter(Slot.date == date)
    slots = query.order_by(Slot.date.asc(), Slot.start_time.asc()).all()

    results = []
    for s in slots:
        avail = max(0, s.total_capacity - s.booked)
        status_val = SlotStatus.AVAILABLE.value if avail > 5 else (SlotStatus.LIMITED.value if avail > 0 else SlotStatus.FULL.value)
        results.append(SlotResponse(
            id=s.id,
            center_id=s.center_id,
            date=s.date,
            start_time=s.start_time,
            end_time=s.end_time,
            total_capacity=s.total_capacity,
            booked=s.booked,
            status=status_val,
            available=avail
        ))
    return results


@router.post("/book", response_model=ProcurementTokenResponse)
async def book_slot(
    request: SlotBookRequest,
    current_user: User = Depends(require_role(UserRole.FARMER)),
    db: Session = Depends(get_db)
):
    """Book a procurement slot and create a digital token."""
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer profile not found")

    slot = db.query(Slot).filter(Slot.id == request.slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")

    if slot.booked >= slot.total_capacity:
        raise HTTPException(status_code=400, detail="This slot is fully booked. Please choose another time slot.")

    # Increment slot booked count
    slot.booked += 1
    if slot.booked >= slot.total_capacity:
        slot.status = SlotStatus.FULL
    elif slot.booked >= slot.total_capacity - 5:
        slot.status = SlotStatus.LIMITED

    # Generate Token ID e.g. KF-2026-000123
    total_tokens = db.query(Token).count()
    token_str = f"KF-2026-{total_tokens + 101:06d}"

    token = Token(
        token_id=token_str,
        farmer_id=farmer.id,
        center_id=request.center_id,
        crop_id=request.crop_id,
        quantity=request.quantity,
        slot_id=slot.id,
        status=TokenStatus.CONFIRMED,
        current_stage=ProcurementStage.REGISTRATION,
        created_at=datetime.utcnow()
    )
    db.add(token)
    db.commit()
    db.refresh(token)

    # Enqueue token in center queue
    await queue_service.add_token_to_queue(db, token)

    return ProcurementTokenResponse(
        id=token.id,
        token_id=token.token_id,
        farmer_id=token.farmer_id,
        farmer_name=farmer.name,
        farmer_farmer_id=farmer.farmer_id,
        center_id=token.center_id,
        center_name=token.center.name if token.center else "",
        crop_id=token.crop_id,
        crop_name=token.crop.name if token.crop else "",
        quantity=token.quantity,
        actual_quantity=token.actual_quantity,
        slot_id=token.slot_id,
        status=token.status.value,
        current_stage=token.current_stage.value,
        queue_position=token.queue_position,
        estimated_wait=token.estimated_wait,
        counter_id=token.counter_id,
        procurement_rate=token.procurement_rate,
        total_amount=token.total_amount,
        payment_status=token.payment_status.value,
        created_at=token.created_at,
        updated_at=token.updated_at
    )
