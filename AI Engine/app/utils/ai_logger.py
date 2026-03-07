"""
Structured AI logging for ProxyShield-11.

JSON-formatted logs for AI/ML prediction events.
Designed for easy parsing by backend services and threat event ingestion.
Single-line JSON output compatible with log aggregation systems.
"""

import json
import logging
import sys
from datetime import datetime, timezone
from typing import Any


# ---------------------------------------------------------------------------
# AI Logger Configuration
# ---------------------------------------------------------------------------

AI_LOG_FORMAT = "%(message)s"  # Raw JSON output - no prefix for clean parsing
AI_LOGGER_NAME = "proxyshield.ai_events"


def get_ai_logger(name: str = AI_LOGGER_NAME) -> logging.Logger:
    """
    Get configured AI event logger instance (singleton pattern).
    
    Args:
        name: Logger name for identification in log aggregation.
        
    Returns:
        Configured logger instance for structured JSON output.
    """
    logger = logging.getLogger(name)
    
    # Prevent duplicate handlers on repeated calls
    if logger.handlers:
        return logger
    
    logger.setLevel(logging.INFO)
    
    # Console handler for JSON output (stdout for uvicorn compatibility)
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.INFO)
    
    # Minimal formatter - raw message only for clean JSON parsing
    formatter = logging.Formatter(AI_LOG_FORMAT)
    handler.setFormatter(formatter)
    
    logger.addHandler(handler)
    logger.propagate = False  # Prevent duplicate logs from root logger
    
    return logger


# ---------------------------------------------------------------------------
# Singleton Logger Instance (initialized once at module load)
# ---------------------------------------------------------------------------

_ai_logger = get_ai_logger()


# ---------------------------------------------------------------------------
# AI Event Logging Function
# ---------------------------------------------------------------------------

def log_ai_event(result_dict: dict[str, Any]) -> None:
    """
    Log AI risk analysis event as structured JSON for backend threat ingestion.
    
    Accepts the response_data dictionary from /score endpoint and enriches it
    with event type and UTC timestamp for threat event database storage.
    
    Output Fields:
        - event: "ai_risk_analysis" (fixed identifier for log parsing)
        - shield_id: Session identifier from request
        - risk_score: Normalized risk score (0.0-1.0)
        - risk_level: Risk classification ("low", "medium", "high", "critical")
        - action: Recommended action ("allow", "challenge", "block")
        - flags: List of triggered rule identifiers
        - latency_ms: Processing time in milliseconds
        - timestamp: UTC timestamp in ISO8601 format
    
    Args:
        result_dict: Dictionary containing prediction results.
                     Expected keys: shield_id, risk_score, risk_level,
                                   action, flags, latency_ms
    
    Example output (single line):
        {"event":"ai_risk_analysis","shield_id":"sid_9876","risk_score":0.85,"risk_level":"high","action":"challenge","flags":["proxy_detected","unusual_hour"],"latency_ms":6.23,"timestamp":"2026-03-06T12:30:45.123Z"}
    """
    # Generate UTC timestamp with millisecond precision, Z suffix
    utc_now = datetime.now(timezone.utc)
    timestamp_iso = utc_now.strftime("%Y-%m-%dT%H:%M:%S.") + f"{utc_now.microsecond // 1000:03d}Z"
    
    # Build structured log entry with consistent field order
    log_entry = {
        "event": "ai_risk_analysis",
        "shield_id": result_dict.get("shield_id"),
        "risk_score": result_dict.get("risk_score"),
        "risk_level": result_dict.get("risk_level"),
        "action": result_dict.get("action"),
        "flags": result_dict.get("flags", []),
        "latency_ms": result_dict.get("latency_ms"),
        "timestamp": timestamp_iso,
    }
    
    # Output as compact single-line JSON for log parsers
    _ai_logger.info(json.dumps(log_entry, separators=(",", ":"), ensure_ascii=False))

