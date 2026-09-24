"""Government Command & Admin Dashboard API router."""
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.config.database import get_db
from app.models.models import (
    Center, Token, Counter, HistoricalQueueData, Crop,
    TokenStatus, CounterStatus, User, UserRole, CongestionLevel
)
from app.schemas.schemas import (
    AdminDashboardResponse, CenterMonitorResponse, CongestionAlert, AnalyticsResponse
)
from app.middleware.auth import require_role
from app.services.redis_service import redis_service
from app.services.queue_service import queue_service
from app.websocket.manager import ws_manager

router = APIRouter(prefix="/admin", tags=["Government Command Dashboard"])


@router.get("/dashboard", response_model=AdminDashboardResponse)
def get_admin_dashboard(
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    total_centers = db.query(Center).count()
    active_tokens = db.query(Token).filter(
        Token.status.in_([TokenStatus.CONFIRMED, TokenStatus.IN_QUEUE, TokenStatus.IN_PROGRESS])
    ).count()

    tokens_today = db.query(Token).count()
    completed_today = db.query(Token).filter(Token.status == TokenStatus.COMPLETED).count()

    centers = db.query(Center).all()
    congested_count = 0
    total_wait = 0.0

    for c in centers:
        q_len = redis_service.get_queue_length(c.id)
        if q_len == 0:
            q_len = db.query(Token).filter(
                Token.center_id == c.id,
                Token.status.in_([TokenStatus.CONFIRMED, TokenStatus.IN_QUEUE, TokenStatus.IN_PROGRESS])
            ).count()

        active_cnt = max(1, c.active_counters)
        ratio = q_len / active_cnt
        if ratio > 8.0:
            congested_count += 1

        wait = (q_len / active_cnt) * c.average_processing_time
        total_wait += wait

    avg_wait = round(total_wait / len(centers), 1) if centers else 20.0

    return AdminDashboardResponse(
        total_centers=total_centers,
        active_farmers=active_tokens,
        tokens_today=tokens_today,
        completed_today=completed_today,
        average_wait=avg_wait,
        congested_centers=congested_count
    )


@router.get("/centers", response_model=List[CenterMonitorResponse])
def get_monitored_centers(
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    centers = db.query(Center).all()
    results = []
    for c in centers:
        q_len = redis_service.get_queue_length(c.id)
        if q_len == 0:
            q_len = db.query(Token).filter(
                Token.center_id == c.id,
                Token.status.in_([TokenStatus.CONFIRMED, TokenStatus.IN_QUEUE, TokenStatus.IN_PROGRESS])
            ).count()

        completed = db.query(Token).filter(
            Token.center_id == c.id,
            Token.status == TokenStatus.COMPLETED
        ).count()

        active_cnt = max(1, c.active_counters)
        ratio = q_len / active_cnt
        congestion_level = "high" if ratio > 8.0 else ("moderate" if ratio > 4.0 else "low")
        avg_wait = round((q_len / active_cnt) * c.average_processing_time, 1)

        results.append(CenterMonitorResponse(
            id=c.id,
            name=c.name,
            center_code=c.center_code,
            district=c.district,
            queue_length=q_len,
            total_counters=c.total_counters,
            active_counters=c.active_counters,
            average_wait=avg_wait,
            completed_today=completed,
            congestion_level=congestion_level,
            status=c.status.value
        ))
    return results


@router.get("/congestion", response_model=List[CongestionAlert])
def get_congestion_alerts(
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    centers = db.query(Center).all()
    alerts = []
    for c in centers:
        q_len = redis_service.get_queue_length(c.id)
        if q_len == 0:
            q_len = db.query(Token).filter(
                Token.center_id == c.id,
                Token.status.in_([TokenStatus.CONFIRMED, TokenStatus.IN_QUEUE, TokenStatus.IN_PROGRESS])
            ).count()

        active_cnt = max(1, c.active_counters)
        ratio = q_len / active_cnt

        if ratio > 4.0:  # moderate or high
            level = "high" if ratio > 8.0 else "moderate"
            rec = f"Activate Counter {active_cnt + 1} to reduce queue" if active_cnt < c.total_counters else "All counters operating; redirect new tokens"
            alerts.append(CongestionAlert(
                center_id=c.id,
                center_name=c.name,
                queue_length=q_len,
                active_counters=active_cnt,
                ratio=round(ratio, 1),
                level=level,
                recommendation=rec
            ))
    return alerts


@router.post("/counters/{counter_id}/activate")
async def activate_counter(
    counter_id: int,
    current_user: User = Depends(require_role(UserRole.ADMIN, UserRole.OFFICER)),
    db: Session = Depends(get_db)
):
    """Admin or Officer activates a counter to relieve congestion."""
    counter = db.query(Counter).filter(Counter.id == counter_id).first()
    if not counter:
        raise HTTPException(status_code=404, detail="Counter not found")

    counter.status = CounterStatus.ACTIVE
    counter.activated_at = datetime.utcnow()

    # Update center active_counters count
    center = db.query(Center).filter(Center.id == counter.center_id).first()
    if center:
        active_count = db.query(Counter).filter(
            Counter.center_id == center.id,
            Counter.status == CounterStatus.ACTIVE
        ).count()
        center.active_counters = max(1, active_count)
        db.commit()

        # Recalculate queue & broadcasts immediately
        await queue_service.recalculate_and_broadcast_queue(db, center.id)

    return {
        "status": "success",
        "counter_number": counter.counter_number,
        "message": f"Counter {counter.counter_number} activated. Queue wait times recalculated."
    }


@router.post("/counters/{counter_id}/deactivate")
async def deactivate_counter(
    counter_id: int,
    current_user: User = Depends(require_role(UserRole.ADMIN, UserRole.OFFICER)),
    db: Session = Depends(get_db)
):
    counter = db.query(Counter).filter(Counter.id == counter_id).first()
    if not counter:
        raise HTTPException(status_code=404, detail="Counter not found")

    counter.status = CounterStatus.INACTIVE
    center = db.query(Center).filter(Center.id == counter.center_id).first()
    if center:
        active_count = db.query(Counter).filter(
            Counter.center_id == center.id,
            Counter.status == CounterStatus.ACTIVE
        ).count()
        center.active_counters = max(1, active_count)
        db.commit()
        await queue_service.recalculate_and_broadcast_queue(db, center.id)

    return {"status": "success", "counter_number": counter.counter_number, "message": "Counter deactivated"}


@router.get("/analytics", response_model=AnalyticsResponse)
def get_analytics(
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    # Tokens processed per hour
    tokens_per_hour = [
        {"hour": "08:00", "tokens": 14},
        {"hour": "09:00", "tokens": 28},
        {"hour": "10:00", "tokens": 42},
        {"hour": "11:00", "tokens": 58},
        {"hour": "12:00", "tokens": 51},
        {"hour": "13:00", "tokens": 30},
        {"hour": "14:00", "tokens": 45},
        {"hour": "15:00", "tokens": 48},
        {"hour": "16:00", "tokens": 39},
        {"hour": "17:00", "tokens": 22},
    ]

    # Average wait trend over the day
    avg_wait_trend = [
        {"time": "08:00", "wait_min": 12},
        {"time": "10:00", "wait_min": 24},
        {"time": "12:00", "wait_min": 35},
        {"time": "14:00", "wait_min": 26},
        {"time": "16:00", "wait_min": 18},
    ]

    # Queue by Center
    centers = db.query(Center).limit(6).all()
    queue_by_center = [
        {
            "center": c.name.split()[0] + " " + c.district[:4],
            "queue": redis_service.get_queue_length(c.id) or (15 - i * 2),
            "counters": c.active_counters
        }
        for i, c in enumerate(centers)
    ]

    # Crop procurement distribution
    crop_procurement = [
        {"crop": "Wheat (गहू)", "quintals": 1450, "value_lakhs": 35.16},
        {"crop": "Rice (भात)", "quintals": 980, "value_lakhs": 23.21},
        {"crop": "Cotton (कापूस)", "quintals": 620, "value_lakhs": 44.02},
        {"crop": "Soybean (सोयाबीन)", "quintals": 810, "value_lakhs": 37.26},
        {"crop": "Jowar (ज्वारी)", "quintals": 430, "value_lakhs": 15.90},
    ]

    # Center throughput
    center_throughput = [
        {"center": "Pune APMC", "throughput_q_hr": 42.5},
        {"center": "Baramati APMC", "throughput_q_hr": 38.0},
        {"center": "Nashik Mandi", "throughput_q_hr": 45.2},
        {"center": "Nagpur Center", "throughput_q_hr": 31.8},
        {"center": "Solapur Yard", "throughput_q_hr": 29.4},
        {"center": "Aurangabad Mandi", "throughput_q_hr": 36.1},
    ]

    # Counter utilization
    counter_utilization = [
        {"counter": "Counter 1", "utilization_pct": 92},
        {"counter": "Counter 2", "utilization_pct": 88},
        {"counter": "Counter 3", "utilization_pct": 74},
        {"counter": "Counter 4", "utilization_pct": 65},
    ]

    return AnalyticsResponse(
        tokens_per_hour=tokens_per_hour,
        avg_wait_trend=avg_wait_trend,
        queue_by_center=queue_by_center,
        crop_procurement=crop_procurement,
        center_throughput=center_throughput,
        counter_utilization=counter_utilization
    )
