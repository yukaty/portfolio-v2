FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY app/ app/
COPY rag_docs/ rag_docs/

# Pre-build FAISS index (requires API key placeholder for imports)
# The actual embeddings are generated at runtime, not build time
# This just ensures the directory structure is ready
RUN mkdir -p faiss_index

# Expose port
EXPOSE 8080

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
