"""
Portfolio Backend - Structured Logging
"""

import json
import sys
from datetime import datetime, timezone
from typing import Optional


class PortfolioLogger:
    """
    Privacy-preserving structured logging.
    Logs are sent to stderr -> Cloud Run -> Cloud Logging.
    """

    @staticmethod
    def log_chat_request(
        confidence: float,
        sources_count: int,
        has_sufficient_context: bool,
        response_time_ms: int,
        warnings: list[str],
        query_hash: Optional[str] = None,
    ) -> None:
        """Log chat metadata only - NO user input or AI response content."""
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "severity": "INFO",
            "type": "chat_request",
            "metrics": {
                "confidence": confidence,
                "sources_count": sources_count,
                "has_sufficient_context": has_sufficient_context,
                "response_time_ms": response_time_ms,
            },
            "security": {"warnings": warnings},
            "query_hash": query_hash,
        }
        print(json.dumps(log_entry), file=sys.stderr)

    @staticmethod
    def log_retrieval_failure(query_hash: str) -> None:
        """Log when RAG fails to find relevant documents."""
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "severity": "WARNING",
            "type": "retrieval_failure",
            "query_hash": query_hash,
        }
        print(json.dumps(log_entry), file=sys.stderr)

    @staticmethod
    def log_error(error_type: str, message: str) -> None:
        """Log application errors."""
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "severity": "ERROR",
            "type": error_type,
            "message": message,
        }
        print(json.dumps(log_entry), file=sys.stderr)
