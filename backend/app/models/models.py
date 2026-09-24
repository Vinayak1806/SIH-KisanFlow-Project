"""SQLAlchemy database models for KisanFlow."""
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Text, 
    ForeignKey, Enum as SQLEnum, UniqueConstraint, Index
)
from sqlalchemy.orm import relationship
from app.config.database import Base
import enum


# ─── Enums ───────────────────────────────────────────────────────────────────

class UserRole(str, enum.Enum):
    FARMER = "farmer"
    OFFICER = "officer"
    ADMIN = "admin"


class TokenStatus(str, enum.Enum):
    CONFIRMED = "confirmed"
    IN_QUEUE = "in_queue"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    NO_SHOW = "no_show"
    CANCELLED = "cancelled"


class ProcurementStage(str, enum.Enum):
    REGISTRATION = "registration"
    VERIFICATION = "verification"
    WEIGHING = "weighing"
    PROCUREMENT = "procurement"
    RECEIPT = "receipt"
    PAYMENT = "payment"


class StageStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    SKIPPED = "skipped"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"


class CenterStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    MAINTENANCE = "maintenance"


class CounterStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    BREAK = "break"


class NotificationType(str, enum.Enum):
    TOKEN_CREATED = "token_created"
    QUEUE_UPDATE = "queue_update"
    TURN_APPROACHING = "turn_approaching"
    COUNTER_ASSIGNED = "counter_assigned"
    VERIFICATION_COMPLETE = "verification_complete"
    WEIGHING_COMPLETE = "weighing_complete"
    PROCUREMENT_COMPLETE = "procurement_complete"
    RECEIPT_GENERATED = "receipt_generated"
    PAYMENT_COMPLETE = "payment_complete"
    CENTER_ALERT = "center_alert"


class NotificationChannel(str, enum.Enum):
    IN_APP = "in_app"
    SMS = "sms"
    VOICE = "voice"
    PUSH = "push"


class SlotStatus(str, enum.Enum):
    AVAILABLE = "available"
    LIMITED = "limited"
    FULL = "full"


class CongestionLevel(str, enum.Enum):
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"


# ─── Models ──────────────────────────────────────────────────────────────────

class User(Base):
    """Base user table for authentication."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True)  # Nullable for OTP-only farmers
    role = Column(SQLEnum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    farmer = relationship("Farmer", back_populates="user", uselist=False)
    officer = relationship("Officer", back_populates="user", uselist=False)
    admin = relationship("Admin", back_populates="user", uselist=False)


class Farmer(Base):
    """Farmer profile and details."""
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    farmer_id = Column(String(20), unique=True, index=True, nullable=False)  # e.g., FARM1001
    name = Column(String(200), nullable=False)
    mobile_number = Column(String(15), nullable=False)
    village = Column(String(200), nullable=True)
    district = Column(String(200), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    preferred_language = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="farmer")
    tokens = relationship("Token", back_populates="farmer")
    notifications = relationship("Notification", back_populates="farmer")


class Officer(Base):
    """Procurement officer profile."""
    __tablename__ = "officers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    officer_id = Column(String(20), unique=True, index=True, nullable=False)  # e.g., OFF1001
    name = Column(String(200), nullable=False)
    mobile_number = Column(String(15), nullable=True)
    center_id = Column(Integer, ForeignKey("centers.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="officer")
    center = relationship("Center", back_populates="officers")
    stage_logs = relationship("StageLog", back_populates="officer")


class Admin(Base):
    """Government admin profile."""
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    admin_id = Column(String(20), unique=True, index=True, nullable=False)  # e.g., ADMIN001
    name = Column(String(200), nullable=False)
    department = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="admin")


class Center(Base):
    """Procurement center details."""
    __tablename__ = "centers"

    id = Column(Integer, primary_key=True, index=True)
    center_code = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(300), nullable=False)
    district = Column(String(200), nullable=False)
    address = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    total_counters = Column(Integer, default=4)
    active_counters = Column(Integer, default=2)
    capacity = Column(Integer, default=100)  # Daily capacity
    status = Column(SQLEnum(CenterStatus), default=CenterStatus.ACTIVE)
    average_processing_time = Column(Float, default=15.0)  # Minutes per farmer
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    officers = relationship("Officer", back_populates="center")
    counters = relationship("Counter", back_populates="center")
    tokens = relationship("Token", back_populates="center")
    crop_prices = relationship("CropPrice", back_populates="center")
    slots = relationship("Slot", back_populates="center")
    historical_data = relationship("HistoricalQueueData", back_populates="center")


class Crop(Base):
    """Crop master data."""
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    name_mr = Column(String(100), nullable=True)  # Marathi name
    name_hi = Column(String(100), nullable=True)  # Hindi name
    unit = Column(String(20), default="quintal")
    reference_price = Column(Float, nullable=True)  # Reference/MSP price per unit
    msp = Column(Float, nullable=True)
    active = Column(Boolean, default=True)

    # Relationships
    prices = relationship("CropPrice", back_populates="crop")
    tokens = relationship("Token", back_populates="crop")


class CropPrice(Base):
    """Crop prices at specific centers."""
    __tablename__ = "crop_prices"

    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"), nullable=False)
    center_id = Column(Integer, ForeignKey("centers.id"), nullable=False)
    price = Column(Float, nullable=False)
    effective_date = Column(DateTime, default=datetime.utcnow)
    source = Column(String(100), default="prototype_data")

    # Relationships
    crop = relationship("Crop", back_populates="prices")
    center = relationship("Center", back_populates="crop_prices")

    __table_args__ = (
        UniqueConstraint("crop_id", "center_id", "effective_date", name="uq_crop_center_date"),
    )


class Slot(Base):
    """Time slots for token booking."""
    __tablename__ = "slots"

    id = Column(Integer, primary_key=True, index=True)
    center_id = Column(Integer, ForeignKey("centers.id"), nullable=False)
    date = Column(String(10), nullable=False)  # YYYY-MM-DD
    start_time = Column(String(5), nullable=False)  # HH:MM
    end_time = Column(String(5), nullable=False)
    total_capacity = Column(Integer, default=25)
    booked = Column(Integer, default=0)
    status = Column(SQLEnum(SlotStatus), default=SlotStatus.AVAILABLE)

    # Relationships
    center = relationship("Center", back_populates="slots")
    tokens = relationship("Token", back_populates="slot")


class Token(Base):
    """Digital procurement token."""
    __tablename__ = "tokens"

    id = Column(Integer, primary_key=True, index=True)
    token_id = Column(String(20), unique=True, index=True, nullable=False)  # e.g., KF-2026-000123
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    center_id = Column(Integer, ForeignKey("centers.id"), nullable=False)
    crop_id = Column(Integer, ForeignKey("crops.id"), nullable=False)
    quantity = Column(Float, nullable=False)  # Expected quantity
    actual_quantity = Column(Float, nullable=True)  # After weighing
    slot_id = Column(Integer, ForeignKey("slots.id"), nullable=True)
    status = Column(SQLEnum(TokenStatus), default=TokenStatus.CONFIRMED)
    current_stage = Column(SQLEnum(ProcurementStage), default=ProcurementStage.REGISTRATION)
    queue_position = Column(Integer, nullable=True)
    estimated_wait = Column(Float, nullable=True)  # Minutes
    counter_id = Column(Integer, ForeignKey("counters.id"), nullable=True)
    procurement_rate = Column(Float, nullable=True)  # Rate at time of procurement
    total_amount = Column(Float, nullable=True)
    payment_status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    farmer = relationship("Farmer", back_populates="tokens")
    center = relationship("Center", back_populates="tokens")
    crop = relationship("Crop", back_populates="tokens")
    slot = relationship("Slot", back_populates="tokens")
    counter = relationship("Counter", foreign_keys=[counter_id])
    stages = relationship("ProcurementStageLog", back_populates="token")
    stage_changes = relationship("StageLog", back_populates="token")
    receipt = relationship("Receipt", back_populates="token", uselist=False)
    notifications = relationship("Notification", back_populates="token")

    __table_args__ = (
        Index("ix_tokens_center_status", "center_id", "status"),
    )


class ProcurementStageLog(Base):
    """Tracks each stage of procurement for a token."""
    __tablename__ = "procurement_stages"

    id = Column(Integer, primary_key=True, index=True)
    token_id = Column(Integer, ForeignKey("tokens.id"), nullable=False)
    stage = Column(SQLEnum(ProcurementStage), nullable=False)
    status = Column(SQLEnum(StageStatus), default=StageStatus.PENDING)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    officer_id = Column(Integer, ForeignKey("officers.id"), nullable=True)
    notes = Column(Text, nullable=True)

    # Relationships
    token = relationship("Token", back_populates="stages")


class StageLog(Base):
    """Audit trail for stage transitions."""
    __tablename__ = "stage_logs"

    id = Column(Integer, primary_key=True, index=True)
    token_id = Column(Integer, ForeignKey("tokens.id"), nullable=False)
    from_stage = Column(String(50), nullable=True)
    to_stage = Column(String(50), nullable=False)
    changed_by = Column(Integer, ForeignKey("officers.id"), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)

    # Relationships
    token = relationship("Token", back_populates="stage_changes")
    officer = relationship("Officer", back_populates="stage_logs")


class Receipt(Base):
    """Procurement receipt."""
    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True, index=True)
    receipt_id = Column(String(20), unique=True, index=True, nullable=False)  # e.g., RCPT-2026-00123
    token_id = Column(Integer, ForeignKey("tokens.id"), unique=True, nullable=False)
    farmer_name = Column(String(200), nullable=False)
    crop_name = Column(String(100), nullable=False)
    quantity = Column(Float, nullable=False)
    rate = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    center_name = Column(String(300), nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    token = relationship("Token", back_populates="receipt")


class Counter(Base):
    """Procurement counter at a center."""
    __tablename__ = "counters"

    id = Column(Integer, primary_key=True, index=True)
    center_id = Column(Integer, ForeignKey("centers.id"), nullable=False)
    counter_number = Column(Integer, nullable=False)
    status = Column(SQLEnum(CounterStatus), default=CounterStatus.INACTIVE)
    current_token_id = Column(Integer, ForeignKey("tokens.id"), nullable=True)
    activated_at = Column(DateTime, nullable=True)

    # Relationships
    center = relationship("Center", back_populates="counters")
    current_token = relationship("Token", foreign_keys=[current_token_id])

    __table_args__ = (
        UniqueConstraint("center_id", "counter_number", name="uq_center_counter"),
    )


class Notification(Base):
    """In-app and external notifications."""
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    token_id = Column(Integer, ForeignKey("tokens.id"), nullable=True)
    type = Column(SQLEnum(NotificationType), nullable=False)
    channel = Column(SQLEnum(NotificationChannel), default=NotificationChannel.IN_APP)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    farmer = relationship("Farmer", back_populates="notifications")
    token = relationship("Token", back_populates="notifications")


class HistoricalQueueData(Base):
    """Historical queue data for ML training and analytics."""
    __tablename__ = "historical_queue_data"

    id = Column(Integer, primary_key=True, index=True)
    center_id = Column(Integer, ForeignKey("centers.id"), nullable=False)
    date = Column(String(10), nullable=False)
    hour = Column(Integer, nullable=False)
    queue_length = Column(Integer, nullable=False)
    active_counters = Column(Integer, nullable=False)
    tokens_processed = Column(Integer, nullable=False)
    average_processing_time = Column(Float, nullable=False)
    crop = Column(String(100), nullable=True)
    actual_wait_minutes = Column(Float, nullable=True)

    # Relationships
    center = relationship("Center", back_populates="historical_data")

    __table_args__ = (
        Index("ix_historical_center_date", "center_id", "date", "hour"),
    )
