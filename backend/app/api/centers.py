"""Centers API router for discovery, queue status, and prices."""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.models import Center, CropPrice, Crop, Token, TokenStatus, Counter
from app.schemas.schemas import (
    CenterResponse, CenterDetailResponse, CropPriceResponse, QueueResponse, QueueEntry
)
from app.services.redis_service import redis_service
from app.services.recommendation_service import calculate_haversine_distance
from app.ml.predict import predict_wait_time

router = APIRouter(prefix="/centers", tags=["Centers"])


@router.get("", response_model=List[CenterResponse])
def get_centers(
    lat: Optional[float] = Query(None, description="Farmer latitude"),
    lon: Optional[float] = Query(None, description="Farmer longitude"),
    district: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Center)
    if district:
        query = query.filter(Center.district.ilike(f"%{district}%"))
    centers = query.all()

    results = []
    for c in centers:
        queue_len = redis_service.get_queue_length(c.id)
        if queue_len == 0:
            queue_len = db.query(Token).filter(
                Token.center_id == c.id,
                Token.status.in_([TokenStatus.CONFIRMED, TokenStatus.IN_QUEUE, TokenStatus.IN_PROGRESS])
            ).count()

        est_wait, _, _ = predict_wait_time({
            "queue_length": queue_len,
            "active_counters": c.active_counters,
            "historical_processing_time": c.average_processing_time
        })

        distance = None
        if lat is not None and lon is not None:
            distance = calculate_haversine_distance(lat, lon, c.latitude, c.longitude)

        results.append(CenterResponse(
            id=c.id,
            center_code=c.center_code,
            name=c.name,
            district=c.district,
            address=c.address,
            latitude=c.latitude,
            longitude=c.longitude,
            total_counters=c.total_counters,
            active_counters=c.active_counters,
            capacity=c.capacity,
            status=c.status.value,
            average_processing_time=c.average_processing_time,
            queue_length=queue_len,
            estimated_wait=est_wait,
            distance_km=distance
        ))

    # If location provided, sort by distance
    if lat is not None and lon is not None:
        results.sort(key=lambda x: x.distance_km if x.distance_km is not None else 999)

    return results


@router.get("/{center_id}", response_model=CenterDetailResponse)
def get_center_detail(center_id: int, db: Session = Depends(get_db)):
    c = db.query(Center).filter(Center.id == center_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Center not found")

    queue_len = redis_service.get_queue_length(c.id)
    if queue_len == 0:
        queue_len = db.query(Token).filter(
            Token.center_id == c.id,
            Token.status.in_([TokenStatus.CONFIRMED, TokenStatus.IN_QUEUE, TokenStatus.IN_PROGRESS])
        ).count()

    est_wait, _, _ = predict_wait_time({
        "queue_length": queue_len,
        "active_counters": c.active_counters,
        "historical_processing_time": c.average_processing_time
    })

    prices = db.query(CropPrice).filter(CropPrice.center_id == c.id).all()
    price_responses = [
        CropPriceResponse(
            id=p.id,
            crop_id=p.crop_id,
            crop_name=p.crop.name if p.crop else "",
            center_id=p.center_id,
            price=p.price,
            msp=p.crop.msp if p.crop else None,
            effective_date=p.effective_date,
            source=p.source
        )
        for p in prices
    ]

    counters = db.query(Counter).filter(Counter.center_id == c.id).all()
    counter_responses = [
        {
            "id": cnt.id,
            "center_id": cnt.center_id,
            "counter_number": cnt.counter_number,
            "status": cnt.status.value,
            "current_token_id": cnt.current_token_id,
            "current_token_str": cnt.current_token.token_id if cnt.current_token else None,
            "activated_at": cnt.activated_at
        }
        for cnt in counters
    ]

    return CenterDetailResponse(
        id=c.id,
        center_code=c.center_code,
        name=c.name,
        district=c.district,
        address=c.address,
        latitude=c.latitude,
        longitude=c.longitude,
        total_counters=c.total_counters,
        active_counters=c.active_counters,
        capacity=c.capacity,
        status=c.status.value,
        average_processing_time=c.average_processing_time,
        queue_length=queue_len,
        estimated_wait=est_wait,
        crop_prices=price_responses,
        counters=counter_responses
    )


@router.get("/{center_id}/queue", response_model=QueueResponse)
def get_center_queue(center_id: int, db: Session = Depends(get_db)):
    c = db.query(Center).filter(Center.id == center_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Center not found")

    tokens = db.query(Token).filter(
        Token.center_id == center_id,
        Token.status.in_([TokenStatus.CONFIRMED, TokenStatus.IN_QUEUE, TokenStatus.IN_PROGRESS])
    ).order_by(Token.queue_position.asc()).all()

    waiting_count = sum(1 for t in tokens if t.status == TokenStatus.IN_QUEUE)
    processing_count = sum(1 for t in tokens if t.status == TokenStatus.IN_PROGRESS)

    completed_count = db.query(Token).filter(
        Token.center_id == center_id,
        Token.status == TokenStatus.COMPLETED
    ).count()

    no_show_count = db.query(Token).filter(
        Token.center_id == center_id,
        Token.status == TokenStatus.NO_SHOW
    ).count()

    queue_entries = []
    for t in tokens:
        counter_num = t.counter.counter_number if t.counter else None
        queue_entries.append(QueueEntry(
            token_id=t.token_id,
            farmer_name=t.farmer.name if t.farmer else "Farmer",
            farmer_id_str=t.farmer.farmer_id if t.farmer else "",
            crop=t.crop.name if t.crop else "",
            quantity=t.quantity,
            position=t.queue_position or 1,
            stage=t.current_stage.value,
            counter=counter_num,
            wait_minutes=t.estimated_wait,
            status=t.status.value,
            created_at=t.created_at
        ))

    return QueueResponse(
        center_id=c.id,
        center_name=c.name,
        total_waiting=waiting_count,
        total_processing=processing_count,
        total_completed=completed_count,
        total_no_show=no_show_count,
        active_counters=c.active_counters,
        average_wait=c.average_processing_time,
        queue=queue_entries
    )


@router.get("/{center_id}/prices", response_model=List[CropPriceResponse])
def get_center_prices(center_id: int, db: Session = Depends(get_db)):
    prices = db.query(CropPrice).filter(CropPrice.center_id == center_id).all()
    return [
        CropPriceResponse(
            id=p.id,
            crop_id=p.crop_id,
            crop_name=p.crop.name if p.crop else "",
            center_id=p.center_id,
            price=p.price,
            msp=p.crop.msp if p.crop else None,
            effective_date=p.effective_date,
            source=p.source
        )
        for p in prices
    ]
