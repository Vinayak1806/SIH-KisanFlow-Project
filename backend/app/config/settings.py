"""Application configuration using pydantic-settings."""
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "KisanFlow"
    APP_ENV: str = "development"
    DEBUG: bool = True

    # Database (Defaults to SQLite for frictionless local running, easily configured to PostgreSQL in production)
    DATABASE_URL: str = "sqlite:///./kisanflow.db"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT
    JWT_SECRET: str = "kisanflow-sih2026-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_HOURS: int = 24

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    # Mock OTP for prototype
    MOCK_OTP: str = "123456"

    # External Services
    GOOGLE_MAPS_API_KEY: str = "mock-api-key"
    TWILIO_ACCOUNT_SID: str = "mock-sid"
    TWILIO_AUTH_TOKEN: str = "mock-token"
    TWILIO_PHONE_NUMBER: str = "+1234567890"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
