# ProxyShield-11 Rule-Based Security Microservice

Ultra low-latency (<50ms) FastAPI microservice for real-time proxy abuse detection.

## Quick Start

```bash
# Activate virtual environment
# Windows: .\venv\Scripts\Activate.ps1
# Linux:   source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the service
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Architecture

Rule-based detection engine optimized for <50ms response time.

## Integration

REST API designed for Node.js backend consumption.

## Testing

```bash
pytest tests/
```
