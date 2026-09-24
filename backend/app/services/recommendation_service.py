"""Smart Center Recommendation service with transparent multi-factor scoring."""
import math
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.models import Center, CropPrice, Crop, Token, TokenStatus
from app.services.redis_service import redis_service
from app.ml.predict import predict_wait_time


def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in kilometers between two geo-coordinates."""
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)


class RecommendationService:
    """Computes transparent recommendations for farmers based on multiple weighted parameters."""

    def __init__(self):
        # SIH Specification weights: Distance 40%, Queue 25%, Wait 20%, Price 10%, Capacity 5%
        self.weights = {
            "distance": 0.40,
            "queue": 0.25,
            "waiting_time": 0.20,
            "price": 0.10,
            "capacity": 0.05
        }

    def get_recommendations(
        self,
        db: Session,
        farmer_lat: Optional[float],
        farmer_lon: Optional[float],
        crop_id: Optional[int] = None,
        quantity: Optional[float] = None
    ) -> Dict[str, Any]:
        centers = db.query(Center).all()
        if not centers:
            return {"recommended": None, "alternatives": []}

        # Reference location if farmer location not provided (Pune district coordinates)
        ref_lat = farmer_lat if farmer_lat is not None else 18.5204
        ref_lon = farmer_lon if farmer_lon is not None else 73.8567

        scored_centers = []

        # Find min/max for normalization
        center_metrics = []
        for c in centers:
            dist = calculate_haversine_distance(ref_lat, ref_lon, c.latitude, c.longitude)
            queue_len = redis_service.get_queue_length(c.id)
            if queue_len == 0:
                # Count from DB if redis has not cached
                queue_len = db.query(Token).filter(
                    Token.center_id == c.id,
                    Token.status.in_([TokenStatus.CONFIRMED, TokenStatus.IN_QUEUE, TokenStatus.IN_PROGRESS])
                ).count()

            # Wait time prediction
            est_wait, _, _ = predict_wait_time({
                "queue_length": queue_len,
                "active_counters": c.active_counters,
                "historical_processing_time": c.average_processing_time
            })

            # Crop price lookup
            price = 2425.0  # default
            msp = 2425.0
            if crop_id:
                cp = db.query(CropPrice).filter(
                    CropPrice.center_id == c.id,
                    CropPrice.crop_id == crop_id
                ).first()
                if cp:
                    price = cp.price
                crop_obj = db.query(Crop).filter(Crop.id == crop_id).first()
                if crop_obj and crop_obj.msp:
                    msp = crop_obj.msp

            # Capacity check
            capacity_avail = (c.capacity - queue_len) > 0

            center_metrics.append({
                "center": c,
                "distance": dist,
                "queue": queue_len,
                "wait": est_wait,
                "price": price,
                "msp": msp,
                "capacity_avail": capacity_avail
            })

        max_dist = max([m["distance"] for m in center_metrics] + [10.0])
        max_queue = max([m["queue"] for m in center_metrics] + [10])
        max_wait = max([m["wait"] for m in center_metrics] + [30.0])
        max_price = max([m["price"] for m in center_metrics] + [1.0])

        for m in center_metrics:
            c = m["center"]
            # Inverse scores (lower distance/queue/wait is better)
            dist_score = max(0.0, 1.0 - (m["distance"] / (max_dist * 1.2)))
            queue_score = max(0.0, 1.0 - (m["queue"] / (max_queue * 1.2)))
            wait_score = max(0.0, 1.0 - (m["wait"] / (max_wait * 1.2)))
            price_score = min(1.0, m["price"] / max_price)
            cap_score = 1.0 if m["capacity_avail"] else 0.2

            total_score = (
                (dist_score * self.weights["distance"]) +
                (queue_score * self.weights["queue"]) +
                (wait_score * self.weights["waiting_time"]) +
                (price_score * self.weights["price"]) +
                (cap_score * self.weights["capacity"])
            ) * 100

            reasons = []
            if dist_score > 0.7:
                reasons.append(f"Short distance ({m['distance']} km away)")
            if queue_score > 0.7:
                reasons.append(f"Low waiting queue ({m['queue']} farmers)")
            if wait_score > 0.7:
                reasons.append(f"Fast estimated time (~{int(m['wait'])} min)")
            if m["price"] >= m["msp"]:
                reasons.append(f"Guaranteed MSP price (₹{m['price']:,.0f}/Q)")
            if m["capacity_avail"]:
                reasons.append("Active counters & high intake capacity")

            if not reasons:
                reasons = ["Operational procurement center", "Full MSP rate support"]

            scored_centers.append({
                "center_id": c.id,
                "center_name": c.name,
                "distance_km": m["distance"],
                "queue_length": m["queue"],
                "estimated_wait": m["wait"],
                "price": m["price"],
                "msp": m["msp"],
                "capacity_available": m["capacity_avail"],
                "score": round(total_score, 1),
                "reasons": reasons,
                "score_breakdown": {
                    "distance_pct": round(dist_score * 100),
                    "queue_pct": round(queue_score * 100),
                    "wait_pct": round(wait_score * 100),
                    "price_pct": round(price_score * 100),
                    "capacity_pct": round(cap_score * 100)
                }
            })

        # Sort descending by score
        scored_centers.sort(key=lambda x: x["score"], reverse=True)

        return {
            "recommended": scored_centers[0] if scored_centers else None,
            "alternatives": scored_centers[1:] if len(scored_centers) > 1 else []
        }


recommendation_service = RecommendationService()
