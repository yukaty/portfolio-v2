"""
Portfolio Backend - Pydantic Models
"""
from pydantic import BaseModel
from typing import Optional


class ChatMessage(BaseModel):
    """Single message in conversation history."""

    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    """Request body for /api/chat endpoint."""

    message: str
    history: list[ChatMessage] = []
    conversation_id: Optional[str] = None


class Source(BaseModel):
    """Source document reference in RAG response."""

    document: str
    relevance_score: float
    excerpt: str


class ChatResponse(BaseModel):
    """Response body for /api/chat endpoint."""

    response: str
    sources: list[Source]
    confidence: float
    has_sufficient_context: bool
    conversation_id: str


class HealthResponse(BaseModel):
    """Response body for /health endpoint."""

    status: str
    rag_index_loaded: bool
