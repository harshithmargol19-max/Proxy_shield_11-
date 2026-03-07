# ProxyShield-11 API Reference

Complete API documentation for frontend integration.

## Base URLs

| Service | URL | Description |
|---------|-----|-------------|
| Backend API | `http://localhost:3000/api` | Main REST API |
| Proxy Engine | `http://localhost:3000/proxy-engine` | Email/Fraud processing |
| AI Engine | `http://localhost:8000` | Risk scoring service |

## Response Format

All API responses follow this structure:

```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": { /* Response payload */ }
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Error description",
  "data": null
}
```

---

## Table of Contents

1. [Users](#users)
2. [Shield Identity](#shield-identity)
3. [Threat Events](#threat-events)
4. [Identity Rotation](#identity-rotation)
5. [Audit Logs](#audit-logs)
6. [AI Engine Logs](#ai-engine-logs)
7. [Shield Access](#shield-access)
8. [Communication Proxy](#communication-proxy)
9. [Proxy Engine - Emails](#proxy-engine---emails)
10. [Proxy Engine - Fraud Reports](#proxy-engine---fraud-reports)
11. [AI Engine - Risk Scoring](#ai-engine---risk-scoring)

---

## Users

Base path: `/api/users`

### Create User

**POST** `/api/users`

**Request Body:**
```json
{
  "firebase_uid": "abc123xyz",
  "real_email": "user@example.com",
  "real_phone": "+1234567890",
  "devices": [
    {
      "device_id": "dev_001",
      "device_name": "iPhone 15",
      "device_type": "mobile",
      "push_token": "fcm_token_here"
    }
  ],
  "status": "active"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "message": "User created successfully",
  "data": {
    "_id": "6789abcdef123456",
    "firebase_uid": "abc123xyz",
    "real_email": "user@example.com",
    "real_phone": "+1234567890",
    "devices": [...],
    "status": "active",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

### Get All Users

**GET** `/api/users`

**Response (200):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "6789abcdef123456",
      "firebase_uid": "abc123xyz",
      "real_email": "user@example.com",
      "real_phone": "+1234567890",
      "devices": [...],
      "status": "active",
      "created_at": "2025-01-01T00:00:00.000Z",
      "last_login": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

### Get User by ID

**GET** `/api/users/:id`

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "6789abcdef123456",
    "firebase_uid": "abc123xyz",
    "real_email": "user@example.com",
    "real_phone": "+1234567890",
    "devices": [...],
    "status": "active"
  }
}
```

### Update User

**PUT** `/api/users/:id`

**Request Body:**
```json
{
  "real_phone": "+9876543210",
  "status": "suspended"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "message": "User updated successfully",
  "data": { /* Updated user object */ }
}
```

### Delete User

**DELETE** `/api/users/:id`

**Response (200):**
```json
{
  "statusCode": 200,
  "message": "User deleted successfully",
  "data": null
}
```

---

## Shield Identity

Base path: `/api/shield-identity`

### Create Shield Identity

**POST** `/api/shield-identity`

> **Blockchain Event:** Logs `identity_created` to Hyperledger Fabric

**Request Body:**
```json
{
  "user_id": "6789abcdef123456",
  "proxy_email": "shield_abc123@proxyshield.io",
  "proxy_phone": "+1000000001",
  "browser_fingerprint": "fp_hash_here",
  "linked_services": ["netflix", "spotify", "amazon"],
  "status": "active"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "message": "Shield identity created successfully",
  "data": {
    "_id": "shield_id_12345",
    "user_id": "6789abcdef123456",
    "proxy_email": "shield_abc123@proxyshield.io",
    "proxy_phone": "+1000000001",
    "browser_fingerprint": "fp_hash_here",
    "creation_time": "2025-01-01T00:00:00.000Z",
    "status": "active",
    "linked_services": ["netflix", "spotify", "amazon"]
  }
}
```

### Get All Shield Identities

**GET** `/api/shield-identity`

**Response (200):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "shield_id_12345",
      "user_id": {
        "_id": "6789abcdef123456",
        "real_email": "user@example.com"
      },
      "proxy_email": "shield_abc123@proxyshield.io",
      "status": "active",
      "creation_time": "2025-01-01T00:00:00.000Z",
      "last_used": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

### Get Shield Identity by ID

**GET** `/api/shield-identity/:id`

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "shield_id_12345",
    "user_id": { /* Populated user object */ },
    "proxy_email": "shield_abc123@proxyshield.io",
    "proxy_phone": "+1000000001",
    "browser_fingerprint": "fp_hash_here",
    "status": "active",
    "linked_services": ["netflix", "spotify"]
  }
}
```

### Update Shield Identity

**PUT** `/api/shield-identity/:id`

> **Blockchain Event:** Logs `identity_burned` if status changes to "burned"

**Request Body:**
```json
{
  "status": "burned",
  "burn_reason": "manual_burn"
}
```

**status enum:** `"active"` | `"burned"` | `"compromised"`

**Response (200):**
```json
{
  "statusCode": 200,
  "message": "Shield identity updated successfully",
  "data": { /* Updated shield identity */ }
}
```

### Delete Shield Identity

**DELETE** `/api/shield-identity/:id`

**Response (200):**
```json
{
  "statusCode": 200,
  "message": "Shield identity deleted successfully",
  "data": null
}
```

---

## Threat Events

Base path: `/api/threat-event`

### Create Threat Event

**POST** `/api/threat-event`

> **Blockchain Event:** Logs `threat_event` to Hyperledger Fabric

**Request Body:**
```json
{
  "shield_id": "shield_id_12345",
  "event_type": "phishing_attempt",
  "severity": "high",
  "metadata": {
    "source_ip": "192.168.1.100",
    "detected_url": "http://malicious-site.com",
    "detection_method": "ai_analysis"
  }
}
```

**event_type enum:** `"credential_leak"` | `"unauthorized_ip"` | `"phishing_attempt"`

**severity enum:** `"low"` | `"medium"` | `"high"`

**Response (201):**
```json
{
  "statusCode": 201,
  "message": "Threat event created successfully",
  "data": {
    "_id": "threat_event_id_001",
    "shield_id": "shield_id_12345",
    "event_type": "phishing_attempt",
    "detected_at": "2025-01-15T14:30:00.000Z",
    "severity": "high",
    "metadata": { ... }
  }
}
```

### Get All Threat Events

**GET** `/api/threat-event`

**Response (200):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "threat_event_id_001",
      "shield_id": {
        "_id": "shield_id_12345",
        "proxy_email": "shield@proxyshield.io"
      },
      "event_type": "phishing_attempt",
      "detected_at": "2025-01-15T14:30:00.000Z",
      "severity": "high"
    }
  ]
}
```

### Get Threat Event by ID

**GET** `/api/threat-event/:id`

### Update Threat Event

**PUT** `/api/threat-event/:id`

**Request Body:**
```json
{
  "severity": "medium",
  "metadata": { "resolution": "blocked" }
}
```

### Delete Threat Event

**DELETE** `/api/threat-event/:id`

---

## Identity Rotation

Base path: `/api/identity-rotation`

### Create Identity Rotation

**POST** `/api/identity-rotation`

> **Blockchain Event:** Logs `identity_rotated` to Hyperledger Fabric

**Request Body:**
```json
{
  "shield_id": "shield_id_12345",
  "rotation_type": "manual",
  "reason": "User requested rotation after compromise",
  "new_shield_id": "shield_id_67890"
}
```

**rotation_type enum:** `"auto"` | `"manual"`

**Response (201):**
```json
{
  "statusCode": 201,
  "message": "Identity rotation created successfully",
  "data": {
    "_id": "rotation_id_001",
    "shield_id": "shield_id_12345",
    "rotation_type": "manual",
    "timestamp": "2025-01-15T15:00:00.000Z",
    "reason": "User requested rotation after compromise",
    "new_shield_id": "shield_id_67890"
  }
}
```

### Get All Identity Rotations

**GET** `/api/identity-rotation`

**Response (200):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "rotation_id_001",
      "shield_id": { /* Populated old shield */ },
      "new_shield_id": { /* Populated new shield */ },
      "rotation_type": "auto",
      "timestamp": "2025-01-15T15:00:00.000Z",
      "reason": "ai_detected_compromise"
    }
  ]
}
```

### Get Identity Rotation by ID

**GET** `/api/identity-rotation/:id`

### Update Identity Rotation

**PUT** `/api/identity-rotation/:id`

### Delete Identity Rotation

**DELETE** `/api/identity-rotation/:id`

---

## Audit Logs

Base path: `/api/audit-log`

### Create Audit Log

**POST** `/api/audit-log`

> **Blockchain:** Auto-generates `blockchain_hash` (Fabric txId or local fallback)

**Request Body:**
```json
{
  "shield_id": "shield_id_12345",
  "action": "login_attempt",
  "metadata": {
    "ip_address": "192.168.1.50",
    "user_agent": "Mozilla/5.0..."
  }
}
```

**action enum:** `"rotation"` | `"burn"` | `"login_attempt"` | `"communication_filtered"`

**Response (201):**
```json
{
  "statusCode": 201,
  "message": "Audit log created successfully",
  "data": {
    "_id": "audit_log_id_001",
    "shield_id": "shield_id_12345",
    "action": "login_attempt",
    "timestamp": "2025-01-15T16:00:00.000Z",
    "blockchain_hash": "tx_abc123def456...",
    "metadata": { ... }
  }
}
```

### Get All Audit Logs

**GET** `/api/audit-log`

**Response (200):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "audit_log_id_001",
      "shield_id": { /* Populated shield identity */ },
      "action": "login_attempt",
      "timestamp": "2025-01-15T16:00:00.000Z",
      "blockchain_hash": "tx_abc123def456..."
    }
  ]
}
```

### Get Audit Log by ID

**GET** `/api/audit-log/:id`

### Update Audit Log

**PUT** `/api/audit-log/:id`

### Delete Audit Log

**DELETE** `/api/audit-log/:id`

---

## AI Engine Logs

Base path: `/api/ai-log`

### Create AI Log

**POST** `/api/ai-log`

> **Blockchain Events:** May trigger `anomaly_detected`, `mfa_triggered`, or full `burn_and_rotate` lifecycle

**Request Body:**
```json
{
  "shield_id": "shield_id_12345",
  "action": "challenge",
  "confidence": 0.85,
  "metadata": {
    "risk_level": "high",
    "risk_score": 0.85,
    "flags": ["proxy_detected", "unusual_hour"],
    "mfa_method": "email",
    "latency_ms": 12.5
  }
}
```

**Special Actions:**
- `"challenge"` → Logs `anomaly_detected` + `mfa_triggered` to blockchain
- `"burn_and_rotate"` → Executes full lifecycle:
  1. Burns current shield
  2. Creates new shield identity
  3. Creates rotation record
  4. Logs `identity_burned` and `identity_rotated` to blockchain

**Response (201):**
```json
{
  "statusCode": 201,
  "message": "Log created successfully",
  "data": {
    "_id": "ai_log_id_001",
    "shield_id": "shield_id_12345",
    "action": "challenge",
    "confidence": 0.85,
    "timestamp": "2025-01-15T17:00:00.000Z",
    "metadata": { ... }
  }
}
```

### Get All AI Logs

**GET** `/api/ai-log`

### Get AI Log by ID

**GET** `/api/ai-log/:id`

### Update AI Log

**PUT** `/api/ai-log/:id`

### Delete AI Log

**DELETE** `/api/ai-log/:id`

---

## Shield Access

Base path: `/api/shield-access`

### Create Shield Access

**POST** `/api/shield-access`

**Request Body:**
```json
{
  "shield_id": "sid_9876",
  "timestamp": "2025-01-15T18:00:00.000Z",
  "ip_address": "49.205.123.45",
  "ip_country": "India",
  "device_type": "mobile",
  "browser": "Chrome",
  "os": "Android",
  "login_hour": 18,
  "request_frequency": 5,
  "is_proxy": false
}
```

**device_type enum:** `"mobile"` | `"desktop"` | `"tablet"` | `"other"`

**Response (201):**
```json
{
  "statusCode": 201,
  "message": "Shield access created successfully",
  "data": {
    "_id": "access_id_001",
    "shield_id": "sid_9876",
    "timestamp": "2025-01-15T18:00:00.000Z",
    "ip_address": "49.205.123.45",
    "ip_country": "India",
    "device_type": "mobile",
    "browser": "Chrome",
    "os": "Android",
    "login_hour": 18,
    "request_frequency": 5,
    "is_proxy": false,
    "createdAt": "2025-01-15T18:00:00.000Z",
    "updatedAt": "2025-01-15T18:00:00.000Z"
  }
}
```

### Get All Shield Accesses

**GET** `/api/shield-access`

### Get Shield Access by ID

**GET** `/api/shield-access/:id`

### Update Shield Access

**PUT** `/api/shield-access/:id`

### Delete Shield Access

**DELETE** `/api/shield-access/:id`

---

## Communication Proxy

Base path: `/api/communication-proxy`

### Create Communication Proxy

**POST** `/api/communication-proxy`

**Request Body:**
```json
{
  "shield_id": "shield_id_12345",
  "type": "email",
  "sender": "newsletter@example.com",
  "recipient": "shield@proxyshield.io",
  "status": "pending",
  "sanitized_content": "Clean email content here..."
}
```

**type enum:** `"email"` | `"sms"`

**status enum:** `"pending"` | `"delivered"` | `"filtered"` | `"blocked"`

**Response (201):**
```json
{
  "statusCode": 201,
  "message": "Communication proxy created successfully",
  "data": {
    "_id": "comm_proxy_id_001",
    "shield_id": "shield_id_12345",
    "type": "email",
    "sender": "newsletter@example.com",
    "recipient": "shield@proxyshield.io",
    "received_at": "2025-01-15T19:00:00.000Z",
    "status": "pending",
    "sanitized_content": "..."
  }
}
```

### Get All Communication Proxies

**GET** `/api/communication-proxy`

### Get Communication Proxy by ID

**GET** `/api/communication-proxy/:id`

### Update Communication Proxy

**PUT** `/api/communication-proxy/:id`

### Delete Communication Proxy

**DELETE** `/api/communication-proxy/:id`

---

## Proxy Engine - Emails

Base path: `/proxy-engine/emails`

### Receive Email

**POST** `/proxy-engine/emails/receive`

**Request Body:**
```json
{
  "from": "sender@external.com",
  "to": "shield_proxy@proxyshield.io",
  "subject": "Important Message",
  "text": "Plain text body",
  "html": "<p>HTML body</p>",
  "messageId": "unique_msg_id_123",
  "headers": {
    "X-Custom-Header": "value"
  },
  "attachments": [
    {
      "filename": "document.pdf",
      "contentType": "application/pdf"
    }
  ],
  "skipRouting": false
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Email received and saved",
  "data": {
    "_id": "email_id_001",
    "from": "sender@external.com",
    "to": "shield_proxy@proxyshield.io",
    "subject": "Important Message",
    "receivedAt": "2025-01-15T20:00:00.000Z",
    "delivered": true,
    "proxyEmail": "shield_proxy@proxyshield.io",
    "realEmail": "user@real.com",
    "isFraudulent": false
  }
}
```

### Get All Emails

**GET** `/proxy-engine/emails`

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |
| `fraudulent` | boolean | Filter by fraud status |

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "email_id_001",
      "from": "sender@external.com",
      "to": "shield_proxy@proxyshield.io",
      "subject": "Important Message",
      "receivedAt": "2025-01-15T20:00:00.000Z",
      "isFraudulent": false
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "pages": 8
  }
}
```

---

## Proxy Engine - Fraud Reports

Base path: `/proxy-engine/fraud`

### Create Fraud Report

**POST** `/proxy-engine/fraud/report`

**Request Body:**
```json
{
  "emailId": "email_id_001",
  "reportType": "phishing",
  "description": "Suspicious link detected",
  "reportedBy": "ai_engine",
  "severity": "high",
  "indicators": ["suspicious_link", "unknown_sender", "urgency_language"]
}
```

**reportType enum:** `"phishing"` | `"spam"` | `"malware"` | `"spoofing"` | `"other"`

**severity enum:** `"low"` | `"medium"` | `"high"` | `"critical"`

**Response (201):**
```json
{
  "success": true,
  "message": "Fraud report created successfully",
  "data": {
    "_id": "fraud_report_id_001",
    "emailId": "email_id_001",
    "reportType": "phishing",
    "description": "Suspicious link detected",
    "reportedBy": "ai_engine",
    "status": "pending",
    "severity": "high",
    "indicators": ["suspicious_link", "unknown_sender"],
    "createdAt": "2025-01-15T21:00:00.000Z"
  }
}
```

### Get All Fraud Reports

**GET** `/proxy-engine/fraud`

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |
| `status` | string | Filter by status |
| `reportType` | string | Filter by report type |

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "fraud_report_id_001",
      "emailId": { /* Populated email */ },
      "reportType": "phishing",
      "status": "investigating",
      "severity": "high",
      "createdAt": "2025-01-15T21:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "pages": 2
  }
}
```

---

## AI Engine - Risk Scoring

Base URL: `http://localhost:8000`

### Health Check

**GET** `/health`

**Response (200):**
```json
{
  "status": "healthy",
  "service": "proxyshield-11",
  "version": "1.0.0"
}
```

### Score Request

**POST** `/score`

**Request Body:**
```json
{
  "shield_id": "sid_9876",
  "timestamp": "2025-01-15T23:20:00Z",
  "ip_address": "49.205.123.45",
  "ip_country": "India",
  "device_type": "mobile",
  "browser": "Chrome",
  "os": "Android",
  "login_hour": 23,
  "request_frequency": 12,
  "is_proxy": false
}
```

**Field Constraints:**
| Field | Type | Constraints |
|-------|------|-------------|
| `shield_id` | string | 1-64 chars, alphanumeric with `_` or `-` |
| `timestamp` | string | ISO 8601 format |
| `ip_address` | string | Valid IPv4 or IPv6 |
| `ip_country` | string | 2-64 chars |
| `device_type` | string | `"mobile"` \| `"desktop"` \| `"tablet"` \| `"unknown"` |
| `browser` | string | 1-64 chars |
| `os` | string | 1-64 chars |
| `login_hour` | integer | 0-23 |
| `request_frequency` | integer | >= 0 |
| `is_proxy` | boolean | - |

**Response (200):**
```json
{
  "shield_id": "sid_9876",
  "risk_score": 0.72,
  "risk_level": "high",
  "action": "challenge",
  "flags": ["proxy_detected", "high_frequency", "unusual_hour"],
  "latency_ms": 12.5
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `risk_score` | float | 0.0 (safe) to 1.0 (high risk) |
| `risk_level` | string | `"low"` \| `"medium"` \| `"high"` \| `"critical"` |
| `action` | string | `"allow"` \| `"challenge"` \| `"block"` |
| `flags` | array | Triggered rule identifiers |
| `latency_ms` | float | Processing time in milliseconds |

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 404 | Resource Not Found |
| 500 | Internal Server Error |

---

## Error Handling

All errors return:

```json
{
  "statusCode": 400,
  "message": "Detailed error message",
  "data": null
}
```

Common error scenarios:
- Missing required fields
- Invalid ObjectId format
- Resource not found
- Validation constraint violations

---

## Blockchain Integration Notes

The following events are automatically logged to Hyperledger Fabric:

| Event Type | Trigger |
|------------|---------|
| `identity_created` | POST `/api/shield-identity` |
| `identity_burned` | PUT `/api/shield-identity/:id` with `status: "burned"` |
| `identity_rotated` | POST `/api/identity-rotation` |
| `threat_event` | POST `/api/threat-event` |
| `anomaly_detected` | POST `/api/ai-log` with `risk_level >= medium` |
| `mfa_triggered` | POST `/api/ai-log` with `action: "challenge"` |

All audit logs contain a `blockchain_hash` field (Fabric transaction ID or local fallback).
