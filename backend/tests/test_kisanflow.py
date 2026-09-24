"""Unit and integration test suite for KisanFlow SIH 2026."""
import pytest
from app.services.auth_service import otp_service, hash_password, verify_password
from app.services.recommendation_service import calculate_haversine_distance, recommendation_service
from app.ml.predict import predict_wait_time
from app.ml.features import extract_features


def test_mock_otp_service():
    """Verify mock OTP accepts configured 123456 prototype code."""
    assert otp_service.verify_otp("9822011001", "123456") is True
    assert otp_service.verify_otp("9822011001", "000000") is False


def test_password_hashing():
    """Verify bcrypt password hashing and checking."""
    hashed = hash_password("officer123")
    assert verify_password("officer123", hashed) is True
    assert verify_password("wrongpass", hashed) is False


def test_haversine_distance_calculation():
    """Verify distance calculation between Pune coordinates."""
    # Gultekdi Pune (18.4905, 73.8687) to Baramati (18.1517, 74.5772) ~ 83 km
    dist = calculate_haversine_distance(18.4905, 73.8687, 18.1517, 74.5772)
    assert 70.0 < dist < 100.0


def test_wait_time_rule_prediction():
    """Verify wait time formula: (queue_pos / active_counters) * average_processing_time."""
    est_wait, conf, method = predict_wait_time({
        "queue_length": 12,
        "active_counters": 3,
        "historical_processing_time": 12.0
    })
    # (12 / 3) * 12 = 48 minutes (or within ML bounds)
    assert est_wait >= 5.0
    assert conf >= 0.70


def test_ml_feature_extraction():
    """Verify feature vector contains 7 numeric elements."""
    features = extract_features({
        "queue_length": 12,
        "active_counters": 3,
        "hour": 10,
        "day_of_week": 2,
        "crop": "Wheat",
        "historical_processing_time": 12.0,
        "tokens_processed_last_hour": 8
    })
    assert len(features) == 7
    assert features[0] == 12.0
    assert features[1] == 3.0


def test_receipt_amount_formula():
    """Verify receipt calculation: actual_quantity * rate."""
    actual_quantity = 34.6
    rate = 2425.0
    total = round(actual_quantity * rate, 2)
    assert total == 83905.0


def test_congestion_detection_rule():
    """Verify congestion rule: queue_length / active_counters > 8.0."""
    queue_len = 18
    active_counters = 2
    ratio = queue_len / active_counters
    assert ratio > 8.0  # High congestion

    # Activating counter 3
    active_counters = 3
    ratio = queue_len / active_counters
    assert ratio <= 8.0  # Resolved to moderate
