"""Tests for health check endpoint."""

import pytest


def test_health_endpoint(client):
    """Test health endpoint returns healthy status."""
    response = client.get("/health")

    assert response.status_code == 200
    data = response.json()

    assert "status" in data
    assert data["status"] == "healthy"
    assert "rag_index_loaded" in data
    assert isinstance(data["rag_index_loaded"], bool)
