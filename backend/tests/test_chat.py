"""Tests for chat endpoint."""
import pytest
from unittest.mock import patch, MagicMock


def test_chat_endpoint_requires_message(client):
    """Chat endpoint should reject empty messages."""
    response = client.post(
        "/api/chat",
        json={"message": "", "history": []}
    )

    assert response.status_code == 400


def test_chat_endpoint_accepts_valid_request(client):
    """Chat endpoint should accept valid requests with proper structure."""
    request_data = {
        "message": "What's your experience?",
        "history": [
            {"role": "user", "content": "Hello"},
            {"role": "assistant", "content": "Hi! How can I help?"}
        ]
    }

    # Mock the RAGService.get_instance() to avoid real API calls
    mock_response = {
        "response": "I have experience in full-stack development.",
        "sources": [],
        "confidence": 0.85,
        "has_sufficient_context": True
    }

    with patch('app.services.rag_service.RAGService.get_instance') as mock_get_instance:
        mock_instance = MagicMock()
        # Make generate_response an async mock that returns the mock_response
        async def mock_generate(*args, **kwargs):
            return mock_response
        mock_instance.generate_response = mock_generate
        mock_get_instance.return_value = mock_instance

        response = client.post("/api/chat", json=request_data)

        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert "sources" in data
        assert "confidence" in data
        assert "conversation_id" in data
        assert data["response"] == "I have experience in full-stack development."


def test_chat_request_validation(client):
    """Chat endpoint should validate request schema."""
    invalid_requests = [
        {},  # Missing required fields
        {"message": "test"},  # Missing history (history has default value, so this is actually valid)
        {"history": []},  # Missing message
        {"message": 123, "history": []},  # Wrong type
    ]

    for i, invalid_request in enumerate(invalid_requests):
        # Skip index 1 since it has default history and is actually valid
        if i == 1:
            continue

        response = client.post("/api/chat", json=invalid_request)
        # Pydantic validation should return 422 for schema errors
        assert response.status_code == 422, f"Request {invalid_request} should return 422, got {response.status_code}"
