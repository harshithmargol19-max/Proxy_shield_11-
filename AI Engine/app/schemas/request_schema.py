from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field, field_validator
import re


class IdentityEventRequest(BaseModel):
    """Incoming identity event from Node.js backend."""

    shield_id: str = Field(
        ...,
        min_length=1,
        max_length=64,
        description="Unique shield session identifier",
        examples=["sid_9876"],
    )
    timestamp: datetime = Field(
        ...,
        description="Event timestamp in ISO 8601 format",
        examples=["2026-03-02T18:20:00Z"],
    )
    ip_address: str = Field(
        ...,
        min_length=7,
        max_length=45,
        description="Client IP address (IPv4 or IPv6)",
        examples=["49.205.xxx.xxx"],
    )
    ip_country: str = Field(
        ...,
        min_length=2,
        max_length=64,
        description="Geo-resolved country name",
        examples=["India"],
    )
    device_type: Literal["mobile", "desktop", "tablet", "unknown"] = Field(
        ...,
        description="Device category",
        examples=["mobile"],
    )
    browser: str = Field(
        ...,
        min_length=1,
        max_length=64,
        description="Browser name",
        examples=["Chrome"],
    )
    os: str = Field(
        ...,
        min_length=1,
        max_length=64,
        description="Operating system",
        examples=["Android"],
    )
    login_hour: int = Field(
        ...,
        ge=0,
        le=23,
        description="Hour of login (0-23 UTC)",
        examples=[23],
    )
    request_frequency: int = Field(
        ...,
        ge=0,
        description="Requests in current session",
        examples=[12],
    )
    is_proxy: bool = Field(
        ...,
        description="Proxy/VPN detection flag from upstream",
        examples=[False],
    )

    @field_validator("shield_id")
    @classmethod
    def validate_shield_id(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z0-9_-]+$", v):
            raise ValueError("shield_id must be alphanumeric with _ or -")
        return v

    model_config = {
        "json_schema_extra": {
            "example": {
                "shield_id": "sid_9876",
                "timestamp": "2026-03-02T18:20:00Z",
                "ip_address": "49.205.xxx.xxx",
                "ip_country": "India",
                "device_type": "mobile",
                "browser": "Chrome",
                "os": "Android",
                "login_hour": 23,
                "request_frequency": 12,
                "is_proxy": False,
            }
        }
    }


class RiskResponse(BaseModel):
    """Risk assessment response for Node.js backend."""

    shield_id: str = Field(
        ...,
        description="Echo of input shield_id for correlation",
        examples=["sid_9876"],
    )
    risk_score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Normalized risk score (0=safe, 1=high risk)",
        examples=[0.72],
    )
    risk_level: Literal["low", "medium", "high", "critical"] = Field(
        ...,
        description="Categorical risk classification",
        examples=["high"],
    )
    action: Literal["allow", "challenge", "block"] = Field(
        ...,
        description="Recommended action for Node.js backend",
        examples=["challenge"],
    )
    flags: list[str] = Field(
        default_factory=list,
        description="Triggered rule/signal identifiers",
        examples=[["proxy_detected", "high_frequency", "unusual_hour"]],
    )
    latency_ms: float = Field(
        ...,
        ge=0.0,
        description="Processing time in milliseconds",
        examples=[12.5],
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "shield_id": "sid_9876",
                "risk_score": 0.72,
                "risk_level": "high",
                "action": "challenge",
                "flags": ["proxy_detected", "high_frequency", "unusual_hour"],
                "latency_ms": 12.5,
            }
        }
    }
