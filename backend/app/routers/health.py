"""
Portfolio Backend - Health Check Router
"""
from fastapi import APIRouter

from app.models.schemas import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Health check endpoint for Cloud Run."""
    # Import here to avoid circular imports
    from app.services.rag_service import RAGService

    rag_service = RAGService.get_instance()
    return HealthResponse(
        status="healthy",
        rag_index_loaded=rag_service.is_loaded(),
    )
