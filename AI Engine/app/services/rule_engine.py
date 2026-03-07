"""
Rule-based risk scoring engine for ProxyShield-11.

High-performance, deterministic rule evaluation with modular design.
Target latency: <5ms for full rule evaluation.
"""

from dataclasses import dataclass
from typing import Callable, Protocol


# ---------------------------------------------------------------------------
# Type Definitions
# ---------------------------------------------------------------------------

class EventLike(Protocol):
    """Protocol for event objects (duck typing for flexibility)."""
    shield_id: str
    is_proxy: bool
    request_frequency: int
    login_hour: int
    ip_country: str


@dataclass(frozen=True, slots=True)
class RuleResult:
    """Immutable result from a single rule evaluation."""
    rule_id: str
    triggered: bool
    score: int
    reason: str


# ---------------------------------------------------------------------------
# Individual Rule Functions
# ---------------------------------------------------------------------------

def rule_proxy_detected(event: EventLike) -> RuleResult:
    """
    Rule: Proxy/VPN usage detection.
    Score: +40 if proxy detected.
    """
    triggered = event.is_proxy is True
    return RuleResult(
        rule_id="proxy_detected",
        triggered=triggered,
        score=40 if triggered else 0,
        reason="Proxy/VPN connection detected" if triggered else "",
    )


def rule_high_frequency(event: EventLike) -> RuleResult:
    """
    Rule: Abnormally high request frequency.
    Score: +30 if request_frequency > 50.
    """
    triggered = event.request_frequency > 50
    return RuleResult(
        rule_id="high_frequency",
        triggered=triggered,
        score=30 if triggered else 0,
        reason=f"High request frequency: {event.request_frequency}" if triggered else "",
    )


def rule_unusual_hour(event: EventLike) -> RuleResult:
    """
    Rule: Login during unusual hours (2 AM - 4 AM UTC).
    Score: +20 if login_hour in [2, 3, 4].
    """
    triggered = event.login_hour in (2, 3, 4)
    return RuleResult(
        rule_id="unusual_hour",
        triggered=triggered,
        score=20 if triggered else 0,
        reason=f"Login at unusual hour: {event.login_hour}:00 UTC" if triggered else "",
    )


def rule_country_change(event: EventLike) -> RuleResult:
    """
    Rule: Country changed from last login (placeholder logic).
    Score: +25 if country differs from previous session.
    
    NOTE: Production implementation should query session store.
    Currently uses placeholder heuristic based on shield_id hash.
    """
    # Placeholder: simulate country change for demo
    # In production, compare against last known country from Redis/DB
    _previous_countries = {
        "sid_9876": "USA",  # Example: last login was from USA
    }
    
    last_country = _previous_countries.get(event.shield_id)
    triggered = last_country is not None and last_country != event.ip_country
    
    return RuleResult(
        rule_id="country_change",
        triggered=triggered,
        score=25 if triggered else 0,
        reason=f"Country changed: {last_country} → {event.ip_country}" if triggered else "",
    )


# ---------------------------------------------------------------------------
# Rule Registry
# ---------------------------------------------------------------------------

# All active rules. Add new rules here.
ACTIVE_RULES: list[Callable[[EventLike], RuleResult]] = [
    rule_proxy_detected,
    rule_high_frequency,
    rule_unusual_hour,
    rule_country_change,
]


# ---------------------------------------------------------------------------
# Main Scoring Function
# ---------------------------------------------------------------------------

def compute_rule_score(event: EventLike) -> tuple[int, list[str]]:
    """
    Evaluate all rules and compute aggregate risk score.
    
    Args:
        event: Identity event with required fields.
        
    Returns:
        Tuple of (score: int 0-100, flags: list of triggered rule IDs).
        
    Performance:
        O(n) where n = number of rules. No I/O, no allocations in hot path.
        Target: <5ms total execution.
    """
    total_score = 0
    flags: list[str] = []
    
    for rule_fn in ACTIVE_RULES:
        result = rule_fn(event)
        if result.triggered:
            total_score += result.score
            flags.append(result.rule_id)
    
    # Cap score at 100
    capped_score = min(total_score, 100)
    
    return capped_score, flags


def compute_rule_score_detailed(event: EventLike) -> tuple[int, list[RuleResult]]:
    """
    Evaluate all rules with detailed results (for debugging/logging).
    
    Returns:
        Tuple of (score: int 0-100, results: list of all RuleResult objects).
    """
    total_score = 0
    results: list[RuleResult] = []
    
    for rule_fn in ACTIVE_RULES:
        result = rule_fn(event)
        results.append(result)
        if result.triggered:
            total_score += result.score
    
    capped_score = min(total_score, 100)
    
    return capped_score, results
