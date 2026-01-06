"""
Portfolio Backend - Chat Router
"""
import hashlib
import time
import uuid

from fastapi import APIRouter, HTTPException

from app.core.logging import PortfolioLogger
from app.core.security import InputSanitizer
from app.models.schemas import ChatRequest, ChatResponse, Source
from app.services.rag_service import RAGService

router = APIRouter(tags=["Chat"])


def _hash_query(query: str) -> str:
    """Create SHA256 hash of query for logging (privacy-preserving)."""
    return hashlib.sha256(query.encode()).hexdigest()[:16]


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Chat endpoint with RAG-powered responses.

    - Sanitizes input for prompt injection
    - Retrieves relevant documents
    - Generates response with confidence scoring
    - Logs metadata only (no user content)
    """
    start_time = time.time()

    # Validate input
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Sanitize input
    sanitized_message, warnings = InputSanitizer.sanitize(request.message)

    # Generate conversation ID if not provided
    conversation_id = request.conversation_id or str(uuid.uuid4())

    try:
        # Get RAG service instance
        rag_service = RAGService.get_instance()

        # Generate response
        result = await rag_service.generate_response(
            query=sanitized_message,
            history=request.history,
        )

        # Calculate response time
        response_time_ms = int((time.time() - start_time) * 1000)

        # Log metadata only
        PortfolioLogger.log_chat_request(
            confidence=result["confidence"],
            sources_count=len(result["sources"]),
            has_sufficient_context=result["has_sufficient_context"],
            response_time_ms=response_time_ms,
            warnings=warnings,
            query_hash=_hash_query(request.message),
        )

        return ChatResponse(
            response=result["response"],
            sources=[
                Source(
                    document=s["document"],
                    relevance_score=s["relevance_score"],
                    excerpt=s["excerpt"],
                )
                for s in result["sources"]
            ],
            confidence=result["confidence"],
            has_sufficient_context=result["has_sufficient_context"],
            conversation_id=conversation_id,
        )

    except Exception as e:
        PortfolioLogger.log_error("chat_error", str(e))
        raise HTTPException(status_code=500, detail="Failed to generate response")
