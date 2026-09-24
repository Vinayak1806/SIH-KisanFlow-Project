"""Pydantic schemas for request/response validation."""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ─── Auth ────────────────────────────────────────────────────────────────────

class FarmerOTPRequest(BaseModel):
    farmer_id: str = Field(..., description="Farmer ID, e.g., FARM1001")

class FarmerOTPVerify(BaseModel):
    farmer_id: str
    otp: str

class OfficerLogin(BaseModel):
    officer_id: str
    password: str

class AdminLogin(BaseModel):
    admin_id: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int
    name: str


# ─── Farmer ──────────────────────────────────────────────────────────────────

class FarmerProfile(BaseModel):
    id: int
    farmer_id: str
    name: str
    mobile_number: str
    village: Optional[str] = None
    district: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    preferred_language: str = "en"

    class Config:
        from_attributes = True

class FarmerUpdate(BaseModel):
    name: Optional[str] = None
    village: Optional[str] = None
    district: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    preferred_language: Optional[str] = None


# ─── Center ──────────────────────────────────────────────────────────────────

class CenterResponse(BaseModel):
    id: int
    center_code: str
    name: str
    district: str
    address: Optional[str] = None
    latitude: float
    longitude: float
    total_counters: int
    active_counters: int
    capacity: int
    status: str
    average_processing_time: float
    queue_length: int = 0
    estimated_wait: float = 0
    distance_km: Optional[float] = None

    class Config:
        from_attributes = True

class CenterDetailResponse(CenterResponse):
    crop_prices: List["CropPriceResponse"] = []
    counters: List["CounterResponse"] = []


# ─── Crop & Price ────────────────────────────────────────────────────────────

class CropResponse(BaseModel):
    id: int
    name: str
    name_mr: Optional[str] = None
    name_hi: Optional[str] = None
    unit: str
    reference_price: Optional[float] = None
    msp: Optional[float] = None

    class Config:
        from_attributes = True

class CropPriceResponse(BaseModel):
    id: int
    crop_id: int
    crop_name: str = ""
    center_id: int
    price: float
    msp: Optional[float] = None
    effective_date: Optional[datetime] = None
    source: str = "prototype_data"

    class Config:
        from_attributes = True


# ─── Slot ────────────────────────────────────────────────────────────────────

class SlotResponse(BaseModel):
    id: int
    center_id: int
    date: str
    start_time: str
    end_time: str
    total_capacity: int
    booked: int
    status: str
    available: int = 0

    class Config:
        from_attributes = True

class SlotBookRequest(BaseModel):
    center_id: int
    crop_id: int
    quantity: float
    slot_id: int


# ─── Token ───────────────────────────────────────────────────────────────────

class TokenCreateRequest(BaseModel):
    center_id: int
    crop_id: int
    quantity: float
    slot_id: Optional[int] = None

class ProcurementTokenResponse(BaseModel):
    id: int
    token_id: str
    farmer_id: int
    farmer_name: str = ""
    farmer_farmer_id: str = ""
    center_id: int
    center_name: str = ""
    crop_id: int
    crop_name: str = ""
    quantity: float
    actual_quantity: Optional[float] = None
    slot_id: Optional[int] = None
    status: str
    current_stage: str
    queue_position: Optional[int] = None
    estimated_wait: Optional[float] = None
    counter_id: Optional[int] = None
    procurement_rate: Optional[float] = None
    total_amount: Optional[float] = None
    payment_status: str = "pending"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenStatusResponse(BaseModel):
    token_id: str
    status: str
    current_stage: str
    queue_position: Optional[int] = None
    estimated_wait: Optional[float] = None
    stages: List["StageResponse"] = []


# ─── Procurement ─────────────────────────────────────────────────────────────

class StageResponse(BaseModel):
    stage: str
    status: str
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True

class VerifyFarmerRequest(BaseModel):
    notes: Optional[str] = None

class WeighRequest(BaseModel):
    actual_quantity: float
    notes: Optional[str] = None

class ProcureRequest(BaseModel):
    notes: Optional[str] = None

class PaymentRequest(BaseModel):
    notes: Optional[str] = None

class NoShowRequest(BaseModel):
    notes: Optional[str] = None


# ─── Receipt ─────────────────────────────────────────────────────────────────

class ReceiptResponse(BaseModel):
    receipt_id: str
    token_id: str = ""
    farmer_name: str
    crop_name: str
    quantity: float
    rate: float
    total_amount: float
    center_name: str
    generated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Counter ─────────────────────────────────────────────────────────────────

class CounterResponse(BaseModel):
    id: int
    center_id: int
    counter_number: int
    status: str
    current_token_id: Optional[int] = None
    current_token_str: Optional[str] = None
    activated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Notification ────────────────────────────────────────────────────────────

class NotificationResponse(BaseModel):
    id: int
    type: str
    channel: str
    title: str
    message: str
    read: bool
    created_at: Optional[datetime] = None
    token_id: Optional[int] = None

    class Config:
        from_attributes = True


# ─── Recommendation ─────────────────────────────────────────────────────────

class RecommendationRequest(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    crop_id: Optional[int] = None
    quantity: Optional[float] = None

class CenterRecommendation(BaseModel):
    center_id: int
    center_name: str
    distance_km: float
    queue_length: int
    estimated_wait: float
    price: float
    msp: Optional[float] = None
    capacity_available: bool
    score: float
    reasons: List[str] = []
    score_breakdown: dict = {}

class RecommendationResponse(BaseModel):
    recommended: CenterRecommendation
    alternatives: List[CenterRecommendation] = []


# ─── Prediction ──────────────────────────────────────────────────────────────

class WaitPredictionRequest(BaseModel):
    center_id: int
    queue_position: Optional[int] = None

class WaitPredictionResponse(BaseModel):
    estimated_wait_minutes: float
    confidence: float
    method: str  # "rule-based" or "random-forest"


# ─── Admin Dashboard ────────────────────────────────────────────────────────

class AdminDashboardResponse(BaseModel):
    total_centers: int
    active_farmers: int
    tokens_today: int
    completed_today: int
    average_wait: float
    congested_centers: int

class CenterMonitorResponse(BaseModel):
    id: int
    name: str
    center_code: str
    district: str
    queue_length: int
    total_counters: int
    active_counters: int
    average_wait: float
    completed_today: int
    congestion_level: str  # low, moderate, high
    status: str

class CongestionAlert(BaseModel):
    center_id: int
    center_name: str
    queue_length: int
    active_counters: int
    ratio: float
    level: str
    recommendation: str

class AnalyticsResponse(BaseModel):
    tokens_per_hour: List[dict] = []
    avg_wait_trend: List[dict] = []
    queue_by_center: List[dict] = []
    crop_procurement: List[dict] = []
    center_throughput: List[dict] = []
    counter_utilization: List[dict] = []


# ─── Queue ───────────────────────────────────────────────────────────────────

class QueueEntry(BaseModel):
    token_id: str
    farmer_name: str
    farmer_id_str: str
    crop: str
    quantity: float
    position: int
    stage: str
    counter: Optional[int] = None
    wait_minutes: Optional[float] = None
    status: str
    created_at: Optional[datetime] = None

class QueueResponse(BaseModel):
    center_id: int
    center_name: str
    total_waiting: int
    total_processing: int
    total_completed: int
    total_no_show: int
    active_counters: int
    average_wait: float
    queue: List[QueueEntry] = []


# ─── Officer Dashboard ──────────────────────────────────────────────────────

class OfficerDashboardResponse(BaseModel):
    center_name: str
    center_id: int
    waiting: int
    processing: int
    completed: int
    no_show: int
    average_wait: float
    active_counters: int
    total_counters: int
