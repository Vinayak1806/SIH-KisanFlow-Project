"""Feature extraction and preprocessing for wait time prediction ML model."""
from typing import Dict, Any, List

CROP_ENCODING = {
    "Wheat": 1,
    "Rice": 2,
    "Cotton": 3,
    "Soybean": 4,
    "Jowar": 5,
    "Bajra": 6,
    "Maize": 7,
}


def extract_features(data: Dict[str, Any]) -> List[float]:
    """
    Extract feature vector for wait time prediction:
    [queue_length, active_counters, hour, day_of_week, crop_code, historical_proc_time, processed_last_hour]
    """
    queue_length = float(data.get("queue_length", 1))
    active_counters = max(1.0, float(data.get("active_counters", 2)))
    hour = float(data.get("hour", 10))
    day_of_week = float(data.get("day_of_week", 2))
    crop_name = data.get("crop", "Wheat")
    crop_code = float(CROP_ENCODING.get(crop_name, 1))
    historical_proc_time = float(data.get("historical_processing_time", 15.0))
    processed_last_hour = float(data.get("tokens_processed_last_hour", 8))

    return [
        queue_length,
        active_counters,
        hour,
        day_of_week,
        crop_code,
        historical_proc_time,
        processed_last_hour
    ]
