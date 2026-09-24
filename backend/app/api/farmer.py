"""Farmer API router."""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.models import Farmer, Token, Notification, User, UserRole, TokenStatus
from app.schemas.schemas import (
    FarmerProfile, FarmerUpdate, ProcurementTokenResponse, NotificationResponse
)
from app.middleware.auth import get_current_user, require_role

router = APIRouter(prefix="/farmer", tags=["Farmer"])


@router.get("/profile", response_model=FarmerProfile)
def get_profile(
    current_user: User = Depends(require_role(UserRole.FARMER)),
    db: Session = Depends(get_db)
):
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer profile not found")
    return farmer


@router.put("/profile", response_model=FarmerProfile)
def update_profile(
    update_data: FarmerUpdate,
    current_user: User = Depends(require_role(UserRole.FARMER)),
    db: Session = Depends(get_db)
):
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer profile not found")

    for field, val in update_data.model_dump(exclude_unset=True).items():
        setattr(farmer, field, val)
    db.commit()
    db.refresh(farmer)
    return farmer


@router.get("/tokens", response_model=List[ProcurementTokenResponse])
def get_farmer_tokens(
    current_user: User = Depends(require_role(UserRole.FARMER)),
    db: Session = Depends(get_db)
):
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if not farmer:
        return []

    tokens = db.query(Token).filter(Token.farmer_id == farmer.id).order_by(Token.created_at.desc()).all()
    results = []
    for t in tokens:
        results.append(ProcurementTokenResponse(
            id=t.id,
            token_id=t.token_id,
            farmer_id=t.farmer_id,
            farmer_name=farmer.name,
            farmer_farmer_id=farmer.farmer_id,
            center_id=t.center_id,
            center_name=t.center.name if t.center else "",
            crop_id=t.crop_id,
            crop_name=t.crop.name if t.crop else "",
            quantity=t.quantity,
            actual_quantity=t.actual_quantity,
            slot_id=t.slot_id,
            status=t.status.value,
            current_stage=t.current_stage.value,
            queue_position=t.queue_position,
            estimated_wait=t.estimated_wait,
            counter_id=t.counter_id,
            procurement_rate=t.procurement_rate,
            total_amount=t.total_amount,
            payment_status=t.payment_status.value,
            created_at=t.created_at,
            updated_at=t.updated_at
        ))
    return results


@router.get("/active-token", response_model=Optional[ProcurementTokenResponse])
def get_active_token(
    current_user: User = Depends(require_role(UserRole.FARMER)),
    db: Session = Depends(get_db)
):
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if not farmer:
        return None

    t = db.query(Token).filter(
        Token.farmer_id == farmer.id,
        Token.status.in_([TokenStatus.CONFIRMED, TokenStatus.IN_QUEUE, TokenStatus.IN_PROGRESS])
    ).order_by(Token.created_at.desc()).first()

    if not t:
        return None

    return ProcurementTokenResponse(
        id=t.id,
        token_id=t.token_id,
        farmer_id=t.farmer_id,
        farmer_name=farmer.name,
        farmer_farmer_id=farmer.farmer_id,
        center_id=t.center_id,
        center_name=t.center.name if t.center else "",
        crop_id=t.crop_id,
        crop_name=t.crop.name if t.crop else "",
        quantity=t.quantity,
        actual_quantity=t.actual_quantity,
        slot_id=t.slot_id,
        status=t.status.value,
        current_stage=t.current_stage.value,
        queue_position=t.queue_position,
        estimated_wait=t.estimated_wait,
        counter_id=t.counter_id,
        procurement_rate=t.procurement_rate,
        total_amount=t.total_amount,
        payment_status=t.payment_status.value,
        created_at=t.created_at,
        updated_at=t.updated_at
    )


@router.get("/notifications", response_model=List[NotificationResponse])
def get_farmer_notifications(
    current_user: User = Depends(require_role(UserRole.FARMER)),
    db: Session = Depends(get_db)
):
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if not farmer:
        return []
    notifications = db.query(Notification).filter(
        Notification.farmer_id == farmer.id
    ).order_by(Notification.created_at.desc()).limit(30).all()

    return [
        NotificationResponse(
            id=n.id,
            type=n.type.value,
            channel=n.channel.value,
            title=n.title,
            message=n.message,
            read=n.read,
            created_at=n.created_at,
            token_id=n.token_id
        )
        for n in notifications
    ]


@router.post("/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(require_role(UserRole.FARMER)),
    db: Session = Depends(get_db)
):
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.farmer_id == farmer.id
    ).first()
    if notification:
        notification.read = True
        db.commit()
    return {"status": "ok"}


@router.get("/history", response_model=List[ProcurementTokenResponse])
def get_farmer_history(
    current_user: User = Depends(require_role(UserRole.FARMER)),
    db: Session = Depends(get_db)
):
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if not farmer:
        return []

    tokens = db.query(Token).filter(
        Token.farmer_id == farmer.id,
        Token.status.in_([TokenStatus.COMPLETED, TokenStatus.NO_SHOW])
    ).order_by(Token.created_at.desc()).all()

    return [
        ProcurementTokenResponse(
            id=t.id,
            token_id=t.token_id,
            farmer_id=t.farmer_id,
            farmer_name=farmer.name,
            farmer_farmer_id=farmer.farmer_id,
            center_id=t.center_id,
            center_name=t.center.name if t.center else "",
            crop_id=t.crop_id,
            crop_name=t.crop.name if t.crop else "",
            quantity=t.quantity,
            actual_quantity=t.actual_quantity,
            slot_id=t.slot_id,
            status=t.status.value,
            current_stage=t.current_stage.value,
            queue_position=t.queue_position,
            estimated_wait=t.estimated_wait,
            counter_id=t.counter_id,
            procurement_rate=t.procurement_rate,
            total_amount=t.total_amount,
            payment_status=t.payment_status.value,
            created_at=t.created_at,
            updated_at=t.updated_at
        )
        for t in tokens
    ]
