# ProxyShield-11 AI Engine API

## Overview
Production-grade rule-based security microservice for proxy abuse detection.
Target latency: <50ms per request.

---

## Health Check

**Endpoint:** `GET /health`

### Request
No body required

### Response (200 OK)
```json
{
  "status": "healthy",
  "service": "proxyshield-11",
  "version": "1.0.0"
}
```

---

## Score Identity Event

**Endpoint:** `POST /score`

Evaluates identity event and returns risk assessment.

### Request
```json
{
  "shield_id": "60d5ec49f1b2c8b1f8c8e1b2",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "browser_fingerprint": "abc123def456",
  "proxy_detected": false,
  "vpn_detected": false,
  "isp": "Example ISP",
  "country": "US",
  "city": "New York",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Response (200 OK)
```json
{
  "shield_id": "60d5ec49f1b2c8b1f8c8e1b2",
  "risk_score": 25.5,
  "risk_level": "low",
  "action": "allow",
  "flags": ["proxy_check", "vpn_check"],
  "latency_ms": 12.5
}
```

### Response (500 Internal Server Error)
```json
{
  "error": "Internal server error",
  "latency_ms": 5.2
}
```

### Response (500 Scoring Error)
```json
{
  "detail": "Scoring failed: <error_message>"
}
```

### Response Headers
- `X-Response-Time-Ms`: Latency in milliseconds

---

## Risk Levels

| Level    | Score Range |
|----------|-------------|
| low      | 0-30        |
| medium   | 31-60       |
| high     | 61-80       |
| critical | 81-100      |

---

## Actions

| Action   | Description                  |
|----------|------------------------------|
| allow    | Request allowed              |
| monitor  | Log for further monitoring   |
| challenge| Request challenge (CAPTCHA)  |
| block    | Request blocked              |
| burn     | Shield identity burned       |
