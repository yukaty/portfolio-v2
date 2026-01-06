FROM python:3.12-slim

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
COPY tests/ tests/
COPY pytest.ini pytest.ini

# Ensure directories exist
RUN mkdir -p faiss_index

# Expose port
EXPOSE 8080

# Run the application with hot reload
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080", "--reload"]
