"""Recommendation and Prediction API router."""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.schemas.schemas import (
    RecommendationResponse, CenterRecommendation,
    WaitPredictionRequest, WaitPredictionResponse
)
from app.services.recommendation_service import recommendation_service
from app.ml.predict import predict_wait_time
from app.models.models import Center, Token, TokenStatus
from app.services.redis_service import redis_service

router = APIRouter(tags=["Recommendations & AI Prediction"])


@router.get("/recommendations/centers", response_model=RecommendationResponse)
def get_recommended_centers(
    lat: Optional[float] = Query(None, description="Farmer latitude"),
    lon: Optional[float] = Query(None, description="Farmer longitude"),
    crop_id: Optional[int] = Query(None),
    quantity: Optional[float] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Returns AI/Algorithmic center recommendations based on transparent multi-factor scoring:
    Distance (40%), Queue (25%), Waiting time (20%), Price (10%), Capacity (5%).
    """
    result = recommendation_service.get_recommendations(
        db=db,
        farmer_lat=lat,
        farmer_lon=lon,
        crop_id=crop_id,
        quantity=quantity
    )
    return result


@router.post("/prediction/wait-time", response_model=WaitPredictionResponse)
def get_wait_time_prediction(request: WaitPredictionRequest, db: Session = Depends(get_db)):
    """
    AI wait-time prediction using RandomForestRegressor or transparent rule-based model.
    """
    center = db.query(Center).filter(Center.id == request.center_id).first()
    if not center:
        return WaitPredictionResponse(
            estimated_wait_minutes=25.0,
            confidence=0.75,
            method="rule-based"
        )

    queue_pos = request.queue_position
    if queue_pos is None:
        queue_pos = redis_service.get_queue_length(center.id)
        if queue_pos == 0:
            queue_pos = db.query(Token).filter(
                Token.center_id == center.id,
                Token.status.in_([TokenStatus.CONFIRMED, TokenStatus.IN_QUEUE, TokenStatus.IN_PROGRESS])
            ).count()

    est_wait, conf, method = predict_wait_time({
        "queue_length": max(1, queue_pos),
        "active_counters": max(1, center.active_counters),
        "historical_processing_time": center.average_processing_time
    })

    return WaitPredictionResponse(
        estimated_wait_minutes=est_wait,
        confidence=conf,
        method=method
    )
