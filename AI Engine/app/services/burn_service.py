"""
Digital burn decision service for ProxyShield-11.

Determines credential/token burn actions based on risk assessment.
Implements the "burn and rotate" security pattern for high-risk events.
"""

from dataclasses import dataclass
from enum import Enum
from typing import Literal


# ---------------------------------------------------------------------------
# Action Definitions
# ---------------------------------------------------------------------------

class BurnAction(str, Enum):
    """Burn decision actions."""
    ALLOW = "allow"
    BURN_AND_ROTATE = "burn_and_rotate"


# ---------------------------------------------------------------------------
# Result Type
# ---------------------------------------------------------------------------

@dataclass(frozen=True, slots=True)
class BurnDecision:
    """Burn decision result with metadata."""
    action: BurnAction
    should_burn: bool
    reason: str


# ---------------------------------------------------------------------------
# Risk Level to Burn Action Mapping
# ---------------------------------------------------------------------------

# Risk levels that trigger burn
BURN_TRIGGER_LEVELS: set[str] = {"high", "critical"}


# ---------------------------------------------------------------------------
# Core Decision Functions
# ---------------------------------------------------------------------------

def decide_action(risk_level: str) -> BurnDecision:
    """
    Decide burn action based on risk level.
    
    Decision Logic:
        - LOW, MEDIUM → ALLOW (no burn)
        - HIGH, CRITICAL → BURN_AND_ROTATE
        
    Args:
        risk_level: Risk classification ("low", "medium", "high", "critical").
        
    Returns:
        BurnDecision with action, should_burn flag, and reason.
        
    Example:
        >>> decision = decide_action("high")
        >>> decision.action
        BurnAction.BURN_AND_ROTATE
        >>> decision.should_burn
        True
    """
    normalized_level = risk_level.lower().strip()
    
    if normalized_level in BURN_TRIGGER_LEVELS:
        return BurnDecision(
            action=BurnAction.BURN_AND_ROTATE,
            should_burn=True,
            reason=f"Risk level '{normalized_level}' exceeds burn threshold",
        )
    else:
        return BurnDecision(
            action=BurnAction.ALLOW,
            should_burn=False,
            reason=f"Risk level '{normalized_level}' within acceptable range",
        )


def decide_action_with_score(
    risk_level: str,
    risk_score: float,
    burn_threshold: float = 0.70,
) -> BurnDecision:
    """
    Decide burn action with configurable score threshold.
    
    Allows fine-grained control beyond categorical risk levels.
    
    Args:
        risk_level: Risk classification string.
        risk_score: Normalized risk score (0.0-1.0).
        burn_threshold: Score threshold for burn (default 0.70).
        
    Returns:
        BurnDecision based on score threshold.
    """
    if risk_score >= burn_threshold:
        return BurnDecision(
            action=BurnAction.BURN_AND_ROTATE,
            should_burn=True,
            reason=f"Risk score {risk_score:.2f} >= threshold {burn_threshold}",
        )
    else:
        return BurnDecision(
            action=BurnAction.ALLOW,
            should_burn=False,
            reason=f"Risk score {risk_score:.2f} < threshold {burn_threshold}",
        )


def get_action_string(decision: BurnDecision) -> Literal["allow", "burn_and_rotate"]:
    """
    Get action as plain string for JSON serialization.
    
    Args:
        decision: BurnDecision object.
        
    Returns:
        Action string value.
    """
    return decision.action.value
