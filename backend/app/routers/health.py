"""
Portfolio Backend - Health Check Router
"""
from fastapi import APIRouter

from app.models.schemas import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Health check endpoint for Docker/Cloud Run."""
    # Basic liveness check
    try:
        # Import here to avoid circular imports
        from app.services.rag_service import RAGService
        rag_service = RAGService.get_instance()
        is_loaded = rag_service.is_loaded()
    except Exception:
        # If RAG service fails to initialize, the API is still "alive" 
        # but maybe not "ready". For development, we'll return healthy 
        # but with rag_index_loaded=False.
        is_loaded = False

    return HealthResponse(
        status="healthy",
        rag_index_loaded=is_loaded,
    )
