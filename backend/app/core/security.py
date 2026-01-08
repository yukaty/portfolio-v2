"""
Portfolio Backend - Input Sanitization
"""

import re
from typing import Tuple


class InputSanitizer:
    """Prevents prompt injection attacks and detects PII in user input."""

    INJECTION_PATTERNS = [
        r"ignore (previous|above|all|prior) instructions?",
        r"you are now",
        r"new (instructions?|role|system prompt)",
        r"system prompt:",
        r"disregard (previous|above|all)",
    ]

    PII_PATTERNS = {
        "phone": r"\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b",
        "email": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",
    }

    @classmethod
    def sanitize(cls, user_input: str) -> Tuple[str, list[str]]:
        """
        Sanitize user input and detect potential issues.

        Returns:
            Tuple of (sanitized_input, list_of_warnings)

        - Injection attempts are filtered but logged
        - PII is detected but NOT blocked
        - All warnings are logged for monitoring
        """
        warnings: list[str] = []
        sanitized = user_input

        # Check for prompt injection
        for pattern in cls.INJECTION_PATTERNS:
            if re.search(pattern, user_input, re.IGNORECASE):
                warnings.append("potential_injection_attempt")
                sanitized = re.sub(
                    pattern, "[FILTERED]", sanitized, flags=re.IGNORECASE
                )

        # Check for PII (warn only, don't block)
        for pii_type, pattern in cls.PII_PATTERNS.items():
            if re.search(pattern, user_input):
                warnings.append(f"contains_{pii_type}")

        return sanitized, warnings
