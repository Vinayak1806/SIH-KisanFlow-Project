"""Wait time prediction using trained ML model with transparent fallback to rule-based logic."""
from typing import Dict, Any, Tuple
from app.ml.features import extract_features
from app.ml.model import get_trained_model


def predict_wait_time(data: Dict[str, Any]) -> Tuple[float, float, str]:
    """
    Predict waiting time in minutes.
    Returns: (estimated_wait_minutes, confidence, method)
    """
    queue_len = float(data.get("queue_length", 1))
    counters = max(1.0, float(data.get("active_counters", 2)))
    avg_proc = float(data.get("historical_processing_time", 15.0))

    model = get_trained_model()
    if model is not None:
        try:
            feats = [extract_features(data)]
            prediction = float(model.predict(feats)[0])
            # Higher confidence if model is active
            return max(5.0, round(prediction, 1)), 0.88, "random-forest"
        except Exception:
            pass

    # Transparent rule-based calculation
    # estimated_wait = (queue_position / active_counters) * average_processing_time
    wait = (queue_len / counters) * avg_proc
    return max(5.0, round(wait, 1)), 0.82, "rule-based"
