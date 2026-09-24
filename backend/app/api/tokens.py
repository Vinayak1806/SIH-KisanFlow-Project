"""Tokens API router for token creation, lookup, and QR code generation."""
import io
import qrcode
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.models import Token, Farmer, Center, Crop, TokenStatus, ProcurementStage, User, UserRole, ProcurementStageLog
from app.schemas.schemas import TokenCreateRequest, ProcurementTokenResponse, TokenStatusResponse, StageResponse
from app.middleware.auth import get_current_user, require_role
from app.services.queue_service import queue_service

router = APIRouter(prefix="/tokens", tags=["Tokens"])


@router.post("", response_model=ProcurementTokenResponse)
async def create_token(
    request: TokenCreateRequest,
    current_user: User = Depends(require_role(UserRole.FARMER)),
    db: Session = Depends(get_db)
):
    """Directly generate token with queue placement."""
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer profile not found")

    total_tokens = db.query(Token).count()
    token_str = f"KF-2026-{total_tokens + 101:06d}"

    token = Token(
        token_id=token_str,
        farmer_id=farmer.id,
        center_id=request.center_id,
        crop_id=request.crop_id,
        quantity=request.quantity,
        slot_id=request.slot_id,
        status=TokenStatus.CONFIRMED,
        current_stage=ProcurementStage.REGISTRATION,
        created_at=datetime.utcnow()
    )
    db.add(token)
    db.commit()
    db.refresh(token)

    # Initialize queue position
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


@router.get("/{token_id}", response_model=ProcurementTokenResponse)
def get_token(token_id: str, db: Session = Depends(get_db)):
    """Fetch token by token_id or integer ID."""
    query = db.query(Token)
    if token_id.isdigit():
        token = query.filter(Token.id == int(token_id)).first()
    else:
        token = query.filter(Token.token_id == token_id).first()

    if not token:
        raise HTTPException(status_code=404, detail="Token not found")

    return ProcurementTokenResponse(
        id=token.id,
        token_id=token.token_id,
        farmer_id=token.farmer_id,
        farmer_name=token.farmer.name if token.farmer else "",
        farmer_farmer_id=token.farmer.farmer_id if token.farmer else "",
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


@router.get("/{token_id}/status", response_model=TokenStatusResponse)
def get_token_status(token_id: str, db: Session = Depends(get_db)):
    """Get live stage and queue status for a token."""
    query = db.query(Token)
    if token_id.isdigit():
        token = query.filter(Token.id == int(token_id)).first()
    else:
        token = query.filter(Token.token_id == token_id).first()

    if not token:
        raise HTTPException(status_code=404, detail="Token not found")

    # Defined pipeline stages
    stage_order = [
        ProcurementStage.REGISTRATION.value,
        ProcurementStage.VERIFICATION.value,
        ProcurementStage.WEIGHING.value,
        ProcurementStage.PROCUREMENT.value,
        ProcurementStage.RECEIPT.value,
        ProcurementStage.PAYMENT.value
    ]

    curr_idx = stage_order.index(token.current_stage.value) if token.current_stage.value in stage_order else 0

    stages = []
    for idx, st in enumerate(stage_order):
        if idx < curr_idx:
            status_val = "completed"
        elif idx == curr_idx:
            status_val = "in_progress" if token.status == TokenStatus.IN_PROGRESS else "pending"
        else:
            status_val = "pending"

        stages.append(StageResponse(
            stage=st,
            status=status_val,
            started_at=token.created_at if idx == 0 else None,
            completed_at=token.updated_at if idx < curr_idx else None
        ))

    return TokenStatusResponse(
        token_id=token.token_id,
        status=token.status.value,
        current_stage=token.current_stage.value,
        queue_position=token.queue_position,
        estimated_wait=token.estimated_wait,
        stages=stages
    )


@router.get("/{token_id}/qr")
def get_token_qr(token_id: str, db: Session = Depends(get_db)):
    """Generate dynamic QR Code image encoding the Token ID."""
    token = db.query(Token).filter(
        (Token.token_id == token_id) | (Token.id == int(token_id) if token_id.isdigit() else False)
    ).first()

    if not token:
        raise HTTPException(status_code=404, detail="Token not found")

    qr = qrcode.QRCode(
        version=1,
        box_size=10,
        border=2,
        error_correction=qrcode.constants.ERROR_CORRECT_M
    )
    qr.add_data(f"KISANFLOW:{token.token_id}")
    qr.make(fit=True)
    img = qr.make_image(fill_color="#1E3A2F", back_color="white")

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return Response(content=buf.getvalue(), media_type="image/png")
