# --- Base Stage (shared dependencies) ---
FROM python:3.12-slim AS base

WORKDIR /app

# Install system dependencies
# libgomp1 is required for faiss-cpu
# curl is used for healthchecks
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY app/ app/
COPY rag_docs/ rag_docs/

# Ensure directories exist
RUN mkdir -p faiss_index

# Expose port
EXPOSE 8080

# --- Development Stage ---
FROM base AS development

# Copy test files for development
COPY tests/ tests/
COPY pytest.ini pytest.ini

# Run with hot reload for development
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080", "--reload"]

# --- Production Stage ---
FROM base AS production

# Pre-build FAISS index at build time (optional, requires GOOGLE_API_KEY at build time)
# If not pre-built, index will be built on first request
# ARG GOOGLE_API_KEY
# ENV GOOGLE_API_KEY=$GOOGLE_API_KEY
# RUN python -c "from app.services.rag_service import RAGService; RAGService.build_index()" || echo "Skipping index build (API key not provided)"

# Use production-ready uvicorn settings
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "1", "--log-level", "info"]
