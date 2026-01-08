"""
Portfolio Backend - Gemini Service
"""

from google import genai
from google.genai import types

from app.core.config import settings


class GeminiService:
    """Wrapper for Gemini API interactions."""

    def __init__(self) -> None:
        """Initialize Gemini client."""
        self.client = genai.Client(api_key=settings.google_api_key)
        self.model = "gemini-2.5-flash"

    async def generate(
        self,
        system_prompt: str,
        context: str,
        query: str,
        history: list[dict],
    ) -> str:
        """Generate response using Gemini with RAG context."""
        # Build the full prompt with context
        user_message = f"""
Context from knowledge base:
{context}

---

User question: {query}
""".strip()

        # Build conversation contents
        contents: list[types.Content] = []

        # Add history
        for msg in history:
            role = "user" if msg["role"] == "user" else "model"
            contents.append(
                types.Content(
                    role=role,
                    parts=[types.Part(text=msg["content"])],
                )
            )

        # Add current query with context
        contents.append(
            types.Content(
                role="user",
                parts=[types.Part(text=user_message)],
            )
        )

        # Generate response
        response = self.client.models.generate_content(
            model=self.model,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.7,
                max_output_tokens=1024,
            ),
        )

        return response.text or "I couldn't generate a response. Please try again."
