"""
Portfolio Backend - RAG Service
Direct implementation using FAISS and google.genai
"""
import pickle
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

import faiss
import numpy as np
from google import genai

from app.core.config import settings
from app.core.prompts import SYSTEM_PROMPT
from app.models.schemas import ChatMessage
from app.services.gemini_service import GeminiService

# Paths
RAG_DOCS_PATH = Path(__file__).parent.parent.parent / "rag_docs"
INDEX_PATH = Path(__file__).parent.parent.parent / "faiss_index"


@dataclass
class Document:
    """Simple document container."""

    content: str
    source: str


class TextSplitter:
    """Simple recursive text splitter."""

    def __init__(
        self,
        chunk_size: int = 500,
        chunk_overlap: int = 50,
    ) -> None:
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators = ["\n\n", "\n", ". ", " "]

    def split(self, text: str, source: str) -> list[Document]:
        """Split text into chunks with overlap."""
        chunks = self._split_recursive(text, self.separators)
        return [Document(content=chunk, source=source) for chunk in chunks if chunk.strip()]

    def _split_recursive(self, text: str, separators: list[str]) -> list[str]:
        """Recursively split text using separators."""
        if len(text) <= self.chunk_size:
            return [text] if text.strip() else []

        if not separators:
            # No more separators, force split by chunk_size
            return self._split_by_size(text)

        sep = separators[0]
        remaining_seps = separators[1:]

        if sep not in text:
            return self._split_recursive(text, remaining_seps)

        parts = text.split(sep)
        chunks: list[str] = []
        current_chunk = ""

        for part in parts:
            test_chunk = current_chunk + sep + part if current_chunk else part

            if len(test_chunk) <= self.chunk_size:
                current_chunk = test_chunk
            else:
                if current_chunk:
                    chunks.append(current_chunk)
                if len(part) > self.chunk_size:
                    chunks.extend(self._split_recursive(part, remaining_seps))
                    current_chunk = ""
                else:
                    current_chunk = part

        if current_chunk:
            chunks.append(current_chunk)

        # Add overlap
        return self._add_overlap(chunks)

    def _split_by_size(self, text: str) -> list[str]:
        """Split text by fixed size."""
        chunks = []
        for i in range(0, len(text), self.chunk_size - self.chunk_overlap):
            chunks.append(text[i : i + self.chunk_size])
        return chunks

    def _add_overlap(self, chunks: list[str]) -> list[str]:
        """Add overlap between chunks."""
        if len(chunks) <= 1 or self.chunk_overlap == 0:
            return chunks

        result = [chunks[0]]
        for i in range(1, len(chunks)):
            prev_overlap = chunks[i - 1][-self.chunk_overlap :] if len(chunks[i - 1]) > self.chunk_overlap else ""
            result.append(prev_overlap + chunks[i])
        return result


class RAGService:
    """RAG service with FAISS vector store and Gemini integration."""

    _instance: Optional["RAGService"] = None

    @classmethod
    def get_instance(cls) -> "RAGService":
        """Get or create singleton instance."""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    @classmethod
    def build_index(cls) -> None:
        """Build and save FAISS index."""
        print("Building FAISS index...")
        documents = cls._load_documents()
        if not documents:
            print("No documents found, skipping index build")
            return

        # Get embeddings
        client = genai.Client(api_key=settings.google_api_key)
        embeddings: list[list[float]] = []
        
        for doc in documents:
            result = client.models.embed_content(
                model="gemini-embedding-001",
                contents=doc.content,
            )
            embeddings.append(result.embeddings[0].values)

        # Build FAISS index
        embeddings_array = np.array(embeddings, dtype=np.float32)
        dimension = embeddings_array.shape[1]
        index = faiss.IndexFlatL2(dimension)
        index.add(embeddings_array)

        # Save index and documents
        INDEX_PATH.mkdir(parents=True, exist_ok=True)
        faiss.write_index(index, str(INDEX_PATH / "index.faiss"))
        with open(INDEX_PATH / "documents.pkl", "wb") as f:
            pickle.dump(documents, f)

        print(f"Index saved to {INDEX_PATH} ({len(documents)} chunks)")

    @classmethod
    def _load_documents(cls) -> list[Document]:
        """Load and split all markdown documents."""
        documents: list[Document] = []
        splitter = TextSplitter(chunk_size=500, chunk_overlap=50)

        if not RAG_DOCS_PATH.exists():
            return documents

        for md_file in RAG_DOCS_PATH.glob("*.md"):
            content = md_file.read_text(encoding="utf-8")
            chunks = splitter.split(content, source=md_file.name)
            documents.extend(chunks)

        return documents

    def __init__(self) -> None:
        """Initialize RAG service."""
        self.index: Optional[faiss.IndexFlatL2] = None
        self.documents: list[Document] = []
        self.client = genai.Client(api_key=settings.google_api_key)
        self.gemini = GeminiService()
        self._load_index()

    def _load_index(self) -> None:
        """Load FAISS index from disk."""
        index_file = INDEX_PATH / "index.faiss"
        docs_file = INDEX_PATH / "documents.pkl"

        if not index_file.exists():
            self.build_index()

        if index_file.exists() and docs_file.exists():
            self.index = faiss.read_index(str(index_file))
            with open(docs_file, "rb") as f:
                self.documents = pickle.load(f)

    def is_loaded(self) -> bool:
        """Check if index is loaded."""
        return self.index is not None and len(self.documents) > 0

    def _embed_query(self, query: str) -> np.ndarray:
        """Embed a query using Gemini."""
        result = self.client.models.embed_content(
            model="gemini-embedding-001",
            contents=query,
        )
        return np.array([result.embeddings[0].values], dtype=np.float32)

    async def generate_response(
        self,
        query: str,
        history: list[ChatMessage],
    ) -> dict:
        """Generate response using RAG."""
        sources: list[dict] = []
        context_parts: list[str] = []

        # Retrieve relevant documents
        if self.index and self.documents:
            query_embedding = self._embed_query(query)
            distances, indices = self.index.search(query_embedding, k=3)

            for i, (dist, idx) in enumerate(zip(distances[0], indices[0])):
                if idx < len(self.documents):
                    doc = self.documents[idx]
                    # Convert L2 distance to similarity score
                    similarity = 1 / (1 + dist)
                    context_parts.append(doc.content)
                    sources.append({
                        "document": doc.source,
                        "relevance_score": round(float(similarity), 2),
                        "excerpt": doc.content[:200] + "..." if len(doc.content) > 200 else doc.content,
                    })

        context = "\n\n".join(context_parts)

        # Build conversation history
        gemini_history = [
            {"role": msg.role, "content": msg.content}
            for msg in history[-settings.max_conversation_history:]
        ]

        # Generate response
        response = await self.gemini.generate(
            system_prompt=SYSTEM_PROMPT,
            context=context,
            query=query,
            history=gemini_history,
        )

        # Evaluate response quality
        evaluation = self._evaluate_response(sources, response)

        return {
            "response": response,
            "sources": sources,
            **evaluation,
        }

    def _evaluate_response(
        self,
        sources: list[dict],
        response: str,
    ) -> dict:
        """Evaluate RAG response quality."""
        has_docs = len(sources) > 0
        avg_relevance = (
            sum(s["relevance_score"] for s in sources) / len(sources)
            if has_docs
            else 0.0
        )

        low_confidence_phrases = [
            "i don't have",
            "i cannot find",
            "not in my knowledge",
            "please contact yuka directly",
        ]
        response_lower = response.lower()
        indicates_missing = any(phrase in response_lower for phrase in low_confidence_phrases)

        confidence = avg_relevance if has_docs else 0.0
        if indicates_missing:
            confidence *= 0.5

        return {
            "confidence": round(confidence, 2),
            "has_sufficient_context": has_docs and avg_relevance > settings.confidence_threshold,
        }
