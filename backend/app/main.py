"""
Portfolio Backend - FastAPI Application
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import chat, health


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan - initialize resources on startup."""
    # Initialize RAG service on startup (lazy load)
    yield


app = FastAPI(
    title="Portfolio API",
    description="AI-powered portfolio chatbot API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
origins = settings.allowed_origins.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(health.router)
app.include_router(chat.router, prefix="/api")
