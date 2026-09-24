"""Authentication service with JWT, mock OTP, and direct bcrypt hashing."""
from datetime import datetime, timedelta
from typing import Optional
import bcrypt
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.config.settings import settings
from app.models.models import User, Farmer, Officer, Admin, UserRole


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Direct bcrypt password verification."""
    if not hashed_password:
        return False
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False


def hash_password(password: str) -> str:
    """Direct bcrypt password hash."""
    # Ensure UTF-8 truncated to 72 bytes per bcrypt standard
    pwd_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=settings.JWT_EXPIRY_HOURS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None


class MockOTPService:
    """Mock OTP service for prototype. Always accepts MOCK_OTP."""

    def send_otp(self, mobile_number: str) -> bool:
        """Simulate sending OTP."""
        print(f"[MOCK OTP] Sent OTP to {mobile_number}: {settings.MOCK_OTP}")
        return True

    def verify_otp(self, mobile_number: str, otp: str) -> bool:
        """Verify OTP. Accepts the configured mock OTP."""
        return otp == settings.MOCK_OTP


class TwilioOTPService:
    """Twilio OTP service for production."""

    def send_otp(self, mobile_number: str) -> bool:
        raise NotImplementedError("Twilio integration pending for production")

    def verify_otp(self, mobile_number: str, otp: str) -> bool:
        raise NotImplementedError("Twilio integration pending for production")


otp_service = MockOTPService()


def authenticate_farmer(db: Session, farmer_id: str, otp: str):
    """Authenticate farmer with farmer_id and OTP."""
    farmer = db.query(Farmer).filter(Farmer.farmer_id == farmer_id).first()
    if not farmer:
        return None

    if not otp_service.verify_otp(farmer.mobile_number, otp):
        return None

    user = db.query(User).filter(User.id == farmer.user_id).first()
    if not user or not user.is_active:
        return None

    token_data = {
        "sub": str(user.id),
        "role": UserRole.FARMER.value,
        "farmer_id": farmer.id,
        "farmer_id_str": farmer.farmer_id,
    }
    access_token = create_access_token(token_data)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": UserRole.FARMER.value,
        "user_id": user.id,
        "name": farmer.name,
    }


def authenticate_officer(db: Session, officer_id: str, password: str):
    """Authenticate officer with officer_id and password."""
    officer = db.query(Officer).filter(Officer.officer_id == officer_id).first()
    if not officer:
        return None

    user = db.query(User).filter(User.id == officer.user_id).first()
    if not user or not user.is_active:
        return None

    if not verify_password(password, user.password_hash):
        return None

    token_data = {
        "sub": str(user.id),
        "role": UserRole.OFFICER.value,
        "officer_id": officer.id,
        "center_id": officer.center_id,
    }
    access_token = create_access_token(token_data)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": UserRole.OFFICER.value,
        "user_id": user.id,
        "name": officer.name,
    }


def authenticate_admin(db: Session, admin_id: str, password: str):
    """Authenticate admin with admin_id and password."""
    admin = db.query(Admin).filter(Admin.admin_id == admin_id).first()
    if not admin:
        return None

    user = db.query(User).filter(User.id == admin.user_id).first()
    if not user or not user.is_active:
        return None

    if not verify_password(password, user.password_hash):
        return None

    token_data = {
        "sub": str(user.id),
        "role": UserRole.ADMIN.value,
        "admin_id": admin.id,
    }
    access_token = create_access_token(token_data)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": UserRole.ADMIN.value,
        "user_id": user.id,
        "name": admin.name,
    }
