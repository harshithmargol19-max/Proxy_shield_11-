"""
Structured logging configuration for ProxyShield-11.

JSON-formatted logs for observability and future Kafka integration.
"""

import logging
import sys
from typing import Any


# ---------------------------------------------------------------------------
# Log Format Configuration
# ---------------------------------------------------------------------------

LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


# ---------------------------------------------------------------------------
# Logger Factory
# ---------------------------------------------------------------------------

def get_logger(name: str, level: int = logging.INFO) -> logging.Logger:
    """
    Get configured logger instance.
    
    Args:
        name: Logger name (typically __name__).
        level: Logging level (default INFO).
        
    Returns:
        Configured logger instance.
    """
    logger = logging.getLogger(name)
    
    # Prevent duplicate handlers
    if logger.handlers:
        return logger
    
    logger.setLevel(level)
    
    # Console handler
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(level)
    
    # Formatter
    formatter = logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT)
    handler.setFormatter(formatter)
    
    logger.addHandler(handler)
    logger.propagate = False
    
    return logger


def log_event(
    logger: logging.Logger,
    event_type: str,
    shield_id: str,
    data: dict[str, Any],
) -> None:
    """
    Log structured event for future Kafka/stream processing.
    
    Args:
        logger: Logger instance.
        event_type: Event classification.
        shield_id: Shield session identifier.
        data: Event payload.
    """
    logger.info(f"[{event_type}] shield_id={shield_id} | {data}")
