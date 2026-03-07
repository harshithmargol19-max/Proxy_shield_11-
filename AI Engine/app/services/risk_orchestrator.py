"""
Risk orchestration coordinator for ProxyShield-11.

Combines rule signals into final risk assessment.
Designed for easy extension when ML components are added.
"""

from dataclasses import dataclass
from enum import Enum
from typing import Literal


# ---------------------------------------------------------------------------
# Risk Level Definitions
# ---------------------------------------------------------------------------

class RiskLevel(str, Enum):
    """Risk classification levels with defined thresholds."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


# Threshold configuration (easily adjustable)
RISK_THRESHOLDS = {
    "low_max": 29,       # 0-29 = LOW
    "medium_max": 70,    # 30-70 = MEDIUM
    "high_max": 90,      # 71-90 = HIGH
    # 91-100 = CRITICAL
}
 

# ---------------------------------------------------------------------------
# Action Mapping
# ---------------------------------------------------------------------------

ACTION_MAP: dict[RiskLevel, Literal["allow", "challenge", "block"]] = {
    RiskLevel.LOW: "allow",
    RiskLevel.MEDIUM: "challenge",
    RiskLevel.HIGH: "challenge",
    RiskLevel.CRITICAL: "block",
}


# ---------------------------------------------------------------------------
# Result Type
# ---------------------------------------------------------------------------

@dataclass(frozen=True, slots=True)
class RiskAssessment:
    """Final risk assessment result."""
    final_risk: float
    risk_level: RiskLevel
    action: Literal["allow", "challenge", "block"]


# ---------------------------------------------------------------------------
# Core Orchestration Functions
# ---------------------------------------------------------------------------

def classify_risk_level(score: float) -> RiskLevel:
    """
    Classify numeric score into risk level.
    
    Thresholds:
        - LOW: 0-29
        - MEDIUM: 30-70
        - HIGH: 71-90
        - CRITICAL: 91-100
    """
    if score <= RISK_THRESHOLDS["low_max"]:
        return RiskLevel.LOW
    elif score <= RISK_THRESHOLDS["medium_max"]:
        return RiskLevel.MEDIUM
    elif score <= RISK_THRESHOLDS["high_max"]:
        return RiskLevel.HIGH
    else:
        return RiskLevel.CRITICAL


def compute_final_risk(rule_score: int) -> RiskAssessment:
    """
    Compute final risk assessment from rule score.
    
    Current implementation: rule-only system.
    Future extension point for ML score blending.
    
    Args:
        rule_score: Score from rule engine (0-100).
        
    Returns:
        RiskAssessment with final_risk, risk_level, and action.
        
    Example:
        >>> result = compute_final_risk(45)
        >>> result.risk_level
        RiskLevel.MEDIUM
        >>> result.action
        'challenge'
    """
    # Normalize to 0.0-1.0 for consistent API
    final_risk = rule_score / 100.0
    
    # Classify risk level
    risk_level = classify_risk_level(rule_score)
    
    # Determine action
    action = ACTION_MAP[risk_level]
    
    return RiskAssessment(
        final_risk=final_risk,
        risk_level=risk_level,
        action=action,
    )


def compute_final_risk_with_weights(
    rule_score: int,
    ml_score: float | None = None,
    rule_weight: float = 1.0,
    ml_weight: float = 0.0,
) -> RiskAssessment:
    """
    Future-ready weighted risk computation.
    
    When ML is added, adjust weights:
        - rule_weight: 0.4
        - ml_weight: 0.6
        
    Args:
        rule_score: Score from rule engine (0-100).
        ml_score: Optional ML model score (0.0-1.0).
        rule_weight: Weight for rule score (default 1.0).
        ml_weight: Weight for ML score (default 0.0).
        
    Returns:
        RiskAssessment with blended final_risk.
    """
    # Normalize rule score
    normalized_rule = rule_score / 100.0
    
    # Blend scores
    if ml_score is not None and ml_weight > 0:
        total_weight = rule_weight + ml_weight
        final_risk = (
            (normalized_rule * rule_weight) + (ml_score * ml_weight)
        ) / total_weight
    else:
        final_risk = normalized_rule
    
    # Convert back to 0-100 for classification
    score_100 = final_risk * 100
    risk_level = classify_risk_level(score_100)
    action = ACTION_MAP[risk_level]
    
    return RiskAssessment(
        final_risk=final_risk,
        risk_level=risk_level,
        action=action,
    )
