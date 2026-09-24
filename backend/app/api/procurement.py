"""Procurement actions and receipt management API router."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.models import Token, Receipt, Officer, User, UserRole
from app.schemas.schemas import (
    VerifyFarmerRequest, WeighRequest, ProcureRequest, PaymentRequest, NoShowRequest,
    ProcurementTokenResponse, ReceiptResponse
)
from app.middleware.auth import get_current_user, require_role
from app.services.procurement_service import procurement_service

router = APIRouter(prefix="", tags=["Procurement Lifecycle"])


@router.post("/tokens/{token_id}/verify", response_model=ProcurementTokenResponse)
async def verify_farmer(
    token_id: str,
    req: VerifyFarmerRequest = VerifyFarmerRequest(),
    current_user: User = Depends(require_role(UserRole.OFFICER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Officer marks farmer documents verified."""
    officer = db.query(Officer).filter(Officer.user_id == current_user.id).first()
    officer_id = officer.id if officer else None

    token = await procurement_service.verify_farmer(
        db=db,
        token_id=token_id,
        officer_id=officer_id,
        notes=req.notes
    )

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


@router.post("/tokens/{token_id}/weigh", response_model=ProcurementTokenResponse)
async def record_weighing(
    token_id: str,
    req: WeighRequest,
    current_user: User = Depends(require_role(UserRole.OFFICER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Officer logs measured weight from weighbridge."""
    officer = db.query(Officer).filter(Officer.user_id == current_user.id).first()
    officer_id = officer.id if officer else None

    token = await procurement_service.record_weighing(
        db=db,
        token_id=token_id,
        actual_quantity=req.actual_quantity,
        officer_id=officer_id,
        notes=req.notes
    )

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


@router.post("/tokens/{token_id}/procure", response_model=ProcurementTokenResponse)
async def complete_procurement(
    token_id: str,
    req: ProcureRequest = ProcureRequest(),
    current_user: User = Depends(require_role(UserRole.OFFICER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Officer completes crop acceptance and triggers receipt creation."""
    officer = db.query(Officer).filter(Officer.user_id == current_user.id).first()
    officer_id = officer.id if officer else None

    token = await procurement_service.complete_procurement(
        db=db,
        token_id=token_id,
        officer_id=officer_id,
        notes=req.notes
    )

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


@router.post("/tokens/{token_id}/payment", response_model=ProcurementTokenResponse)
async def complete_payment(
    token_id: str,
    req: PaymentRequest = PaymentRequest(),
    current_user: User = Depends(require_role(UserRole.OFFICER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Complete DBT payment and notify farmer."""
    officer = db.query(Officer).filter(Officer.user_id == current_user.id).first()
    officer_id = officer.id if officer else None

    token = await procurement_service.complete_payment(
        db=db,
        token_id=token_id,
        officer_id=officer_id,
        notes=req.notes
    )

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


@router.post("/tokens/{token_id}/no-show", response_model=ProcurementTokenResponse)
async def mark_no_show(
    token_id: str,
    req: NoShowRequest = NoShowRequest(),
    current_user: User = Depends(require_role(UserRole.OFFICER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Mark token as no-show when farmer doesn't report."""
    officer = db.query(Officer).filter(Officer.user_id == current_user.id).first()
    officer_id = officer.id if officer else None

    token = await procurement_service.mark_no_show(
        db=db,
        token_id=token_id,
        officer_id=officer_id,
        notes=req.notes
    )

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


@router.get("/receipts/{receipt_id}", response_model=ReceiptResponse)
def get_receipt(receipt_id: str, db: Session = Depends(get_db)):
    """Fetch digital receipt details."""
    receipt = db.query(Receipt).filter(Receipt.receipt_id == receipt_id).first()
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found")

    token = db.query(Token).filter(Token.id == receipt.token_id).first()

    return ReceiptResponse(
        receipt_id=receipt.receipt_id,
        token_id=token.token_id if token else "",
        farmer_name=receipt.farmer_name,
        crop_name=receipt.crop_name,
        quantity=receipt.quantity,
        rate=receipt.rate,
        total_amount=receipt.total_amount,
        center_name=receipt.center_name,
        generated_at=receipt.generated_at
    )
