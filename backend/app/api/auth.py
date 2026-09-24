"""Authentication API router."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.models import Farmer, User
from app.schemas.schemas import (
    FarmerOTPRequest, FarmerOTPVerify, OfficerLogin, AdminLogin, TokenResponse
)
from app.services.auth_service import (
    authenticate_farmer, authenticate_officer, authenticate_admin, otp_service
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/farmer/request-otp")
def request_farmer_otp(request: FarmerOTPRequest, db: Session = Depends(get_db)):
    """Request OTP for farmer login. Prototype uses default 123456."""
    farmer = db.query(Farmer).filter(Farmer.farmer_id == request.farmer_id).first()
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Farmer with ID {request.farmer_id} not registered"
        )
    otp_service.send_otp(farmer.mobile_number)
    return {
        "message": "OTP sent to registered mobile number",
        "mobile_mask": f"******{farmer.mobile_number[-4:]}",
        "demo_hint": "Use prototype demo OTP: 123456"
    }


@router.post("/farmer/verify-otp", response_model=TokenResponse)
def verify_farmer_otp(request: FarmerOTPVerify, db: Session = Depends(get_db)):
    """Verify OTP and issue JWT access token."""
    auth_result = authenticate_farmer(db, request.farmer_id, request.otp)
    if not auth_result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Farmer ID or OTP. Use prototype OTP: 123456"
        )
    return auth_result


@router.post("/officer/login", response_model=TokenResponse)
def login_officer(request: OfficerLogin, db: Session = Depends(get_db)):
    """Officer authentication with officer_id and password."""
    auth_result = authenticate_officer(db, request.officer_id, request.password)
    if not auth_result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Officer ID or Password"
        )
    return auth_result


@router.post("/admin/login", response_model=TokenResponse)
def login_admin(request: AdminLogin, db: Session = Depends(get_db)):
    """Admin authentication with admin_id and password."""
    auth_result = authenticate_admin(db, request.admin_id, request.password)
    if not auth_result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Admin ID or Password"
        )
    return auth_result
