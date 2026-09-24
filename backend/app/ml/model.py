"""ML model definitions and singleton loader with safe fallback."""
import os
import logging

logger = logging.getLogger("kisanflow.ml")

MODEL_PATH = os.path.join(os.path.dirname(__file__), "trained_model.joblib")


def get_trained_model():
    """Load trained RandomForest model if available, else return None."""
    if os.path.exists(MODEL_PATH):
        try:
            import joblib
            return joblib.load(MODEL_PATH)
        except Exception as e:
            logger.info(f"ML model note: {e}")
    return None


def save_model(model):
    """Save trained model to disk."""
    try:
        import joblib
        joblib.dump(model, MODEL_PATH)
        logger.info(f"Model saved to {MODEL_PATH}")
    except Exception as e:
        logger.info(f"Could not persist model: {e}")
