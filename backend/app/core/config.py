"""
Portfolio Backend - Configuration
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Google AI
    google_api_key: str = ""

    # CORS
    allowed_origins: str = "*"

    # RAG Configuration
    confidence_threshold: float = 0.7
    max_conversation_history: int = 10

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
