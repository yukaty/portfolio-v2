"""Pytest configuration and shared fixtures."""
import os
import pytest
from fastapi.testclient import TestClient

# Set test environment variables before importing app
os.environ["GOOGLE_API_KEY"] = "test-api-key-for-unit-tests"
os.environ["ALLOWED_ORIGINS"] = "http://localhost:5173"
os.environ["CONFIDENCE_THRESHOLD"] = "0.7"

from app.main import app


@pytest.fixture
def client():
    """FastAPI test client."""
    return TestClient(app)
