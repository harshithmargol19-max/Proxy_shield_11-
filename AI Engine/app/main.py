"""
ProxyShield-11 FastAPI Application.

Production-grade rule-based security microservice.
Target latency: <50ms per request.
"""

import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.schemas.request_schema import IdentityEventRequest, RiskResponse
from app.services.rule_engine import compute_rule_score
from app.services.risk_orchestrator import compute_final_risk
from app.services.burn_service import decide_action
from app.utils.logger import get_logger
from app.utils.ai_logger import log_ai_event


# ---------------------------------------------------------------------------
# Logger
# ---------------------------------------------------------------------------

logger = get_logger(__name__)


# ---------------------------------------------------------------------------
# Lifespan Events
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    logger.info("ProxyShield-11 starting up...")
    logger.info("Rule engine initialized")
    yield
    logger.info("ProxyShield-11 shutting down...")


# ---------------------------------------------------------------------------
# FastAPI App
# ---------------------------------------------------------------------------

app = FastAPI(
    title="ProxyShield-11",
    description="Rule-based security microservice for proxy abuse detection",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)


# ---------------------------------------------------------------------------
# CORS Middleware (Node.js friendly)
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Error Handling Middleware
# ---------------------------------------------------------------------------

@app.middleware("http")
async def error_handling_middleware(request: Request, call_next):
    """Global error handler with latency tracking."""
    start_time = time.perf_counter()
    
    try:
        response = await call_next(request)
        latency_ms = (time.perf_counter() - start_time) * 1000
        response.headers["X-Response-Time-Ms"] = f"{latency_ms:.2f}"
        return response
    except Exception as e:
        latency_ms = (time.perf_counter() - start_time) * 1000
        logger.error(f"Unhandled error: {e}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal server error",
                "latency_ms": round(latency_ms, 2),
            },
            headers={"X-Response-Time-Ms": f"{latency_ms:.2f}"},
        )


# ---------------------------------------------------------------------------
# Health Check Endpoint
# ---------------------------------------------------------------------------

@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint for load balancers and k8s probes.
    
    Returns:
        JSON with service status.
    """
    return {
        "status": "healthy",
        "service": "proxyshield-11",
        "version": "1.0.0",
    }


# ---------------------------------------------------------------------------
# Main Scoring Endpoint
# ---------------------------------------------------------------------------

@app.post("/score", response_model=RiskResponse, tags=["Scoring"])
async def score_request(event: IdentityEventRequest) -> RiskResponse:
    """
    Evaluate identity event and return risk assessment.
    
    Flow:
        1. Validate request (automatic via Pydantic)
        2. Compute rule score
        3. Compute final risk
        4. Decide burn action
        5. Return structured JSON
        
    Target latency: <50ms
    
    Args:
        event: Identity event from Node.js backend.
        
    Returns:
        RiskResponse with score, level, action, and flags.
    """
    start_time = time.perf_counter()
    
    try:
        # Step 2: Compute rule score
        rule_score, flags = compute_rule_score(event)
        
        # Step 3: Compute final risk
        risk_assessment = compute_final_risk(rule_score)
        
        # Step 4: Decide burn action
        burn_decision = decide_action(risk_assessment.risk_level.value)
        
        # Calculate latency
        latency_ms = (time.perf_counter() - start_time) * 1000
        
        # Log the assessment
        logger.info(
            f"Shield ID: {event.shield_id} | "
            f"Score: {risk_assessment.final_risk:.2f} | "
            f"Level: {risk_assessment.risk_level.value} | "
            f"Latency: {latency_ms:.2f}ms"
        )
        
        # Build response data
        response_data = {
            "shield_id": event.shield_id,
            "risk_score": risk_assessment.final_risk,
            "risk_level": risk_assessment.risk_level.value,
            "action": risk_assessment.action,
            "flags": flags,
            "latency_ms": round(latency_ms, 2),
        }
        
        # Log structured AI event
        log_ai_event(response_data)
        
        # Step 5: Return structured response
        return RiskResponse(**response_data)
        
    except Exception as e:
        logger.error(f"Scoring error for {event.shield_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Scoring failed: {str(e)}",
        )


# ---------------------------------------------------------------------------
# Uvicorn Entry Point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
