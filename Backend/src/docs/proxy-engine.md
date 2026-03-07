# Proxy Engine API


**Base URL:** `http://localhost:3001`

---

## Health & Status

### Health Check

**Endpoint:** `GET /health`

### Response (200 OK)
```json
{
  "success": true,
  "message": "Proxy Engine is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### Server Status

**Endpoint:** `GET /status`

### Response (200 OK)
```json
{
  "success": true,
  "status": "operational",
  "version": "1.0.0",
  "features": {
    "fraudDetection": true,
    "emailParsing": true,
    "smtpServer": true,
    "authentication": true
  }
}
```

---

## Email Routes

### Receive Email

**Endpoint:** `POST /api/emails/receive`

Receives an email, runs fraud analysis, and forwards to user's real email if valid.

**Headers:**
```
Content-Type: application/json
```

### Request
```json
{
  "from": "sender@example.com",
  "to": "proxy123@shield.proxy",
  "subject": "Important Message",
  "text": "Email body text",
  "html": "<p>Email body HTML</p>",
  "headers": {
    "message-id": "<abc123@example.com>"
  },
  "attachments": [
    {
      "filename": "document.pdf",
      "contentType": "application/pdf",
      "size": 1024
    }
  ],
  "skipRouting": false
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| from | string | Yes | Sender email address |
| to | string | Yes | Proxy email address (recipient) |
| subject | string | No | Email subject |
| text | string | No | Plain text body |
| html | string | No | HTML body |
| headers | object | No | Email headers |
| attachments | array | No | List of attachments |
| skipRouting | boolean | No | If true, skips routing to real email (for testing) |

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c8b1f8c8e1b2",
    "from": "sender@example.com",
    "to": "proxy123@shield.proxy",
    "proxyEmail": "proxy123@shield.proxy",
    "realEmail": "user@real.com",
    "userId": "60d5ec49f1b2c8b1f8c8e1a1",
    "subject": "Important Message",
    "text": "Email body text",
    "html": "<p>Email body HTML</p>",
    "fraudScore": 0,
    "fraudFlags": [],
    "isFraudulent": false,
    "delivered": true,
    "receivedAt": "2024-01-01T12:00:00.000Z",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Email received and saved"
}
```

### Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Recipient (to) is required"
}
```

---

### Get All Emails

**Endpoint:** `GET /api/emails`

Retrieves all emails with pagination and optional filtering.

### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page |
| fraudulent | boolean | - | Filter by fraud status |

### Request
No body required

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c8b1f8c8e1b2",
      "from": "sender@example.com",
      "to": "proxy123@shield.proxy",
      "proxyEmail": "proxy123@shield.proxy",
      "realEmail": "user@real.com",
      "userId": "60d5ec49f1b2c8b1f8c8e1a1",
      "subject": "Important Message",
      "fraudScore": 0,
      "fraudFlags": [],
      "isFraudulent": false,
      "delivered": true,
      "receivedAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 5
  }
}
```

---

### Get Email By ID

**Endpoint:** `GET /api/emails/:id`

### Request
No body required

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c8b1f8c8e1b2",
    "from": "sender@example.com",
    "to": "proxy123@shield.proxy",
    "proxyEmail": "proxy123@shield.proxy",
    "realEmail": "user@real.com",
    "userId": "60d5ec49f1b2c8b1f8c8e1a1",
    "subject": "Important Message",
    "text": "Email body text",
    "html": "<p>Email body HTML</p>",
    "headers": {},
    "attachments": [],
    "fraudScore": 0,
    "fraudFlags": [],
    "isFraudulent": false,
    "delivered": true,
    "deliveryError": null,
    "receivedAt": "2024-01-01T12:00:00.000Z",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Response (404 Not Found)
```json
{
  "success": false,
  "message": "Email not found"
}
```

---

### Delete Email

**Endpoint:** `DELETE /api/emails/:id`

### Request
No body required

### Response (200 OK)
```json
{
  "success": true,
  "message": "Email deleted successfully"
}
```

### Response (404 Not Found)
```json
{
  "success": false,
  "message": "Email not found"
}
```

---

## Fraud Routes

All fraud routes require authentication via `authMiddleware`.

### Create Fraud Report

**Endpoint:** `POST /api/fraud/report`

Reports an email as fraudulent.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

### Request
```json
{
  "emailId": "60d5ec49f1b2c8b1f8c8e1b2",
  "reportType": "phishing",
  "description": "Suspicious login attempt",
  "reportedBy": "admin@company.com",
  "severity": "high",
  "indicators": [
    "Urgency language detected",
    "Suspicious URL in body"
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| emailId | string | Yes | ID of the email to report |
| reportType | string | Yes | Type: phishing, spam, malware, spoofing, other |
| description | string | No | Detailed description |
| reportedBy | string | Yes | Email of reporter |
| severity | string |, medium, high No | low, critical |
| indicators | array | No | List of fraud indicators |

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c8b1f8c8e1c3",
    "emailId": "60d5ec49f1b2c8b1f8c8e1b2",
    "reportType": "phishing",
    "description": "Suspicious login attempt",
    "reportedBy": "admin@company.com",
    "status": "pending",
    "severity": "high",
    "indicators": [
      "Urgency language detected",
      "Suspicious URL in body"
    ],
    "resolution": "",
    "resolvedAt": null,
    "resolvedBy": null,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Fraud report created successfully"
}
```

### Response (404 Not Found)
```json
{
  "success": false,
  "message": "Email not found"
}
```

---

### Get All Fraud Reports

**Endpoint:** `GET /api/fraud`

Retrieves all fraud reports with pagination and filtering.

**Headers:**
```
Authorization: Bearer <token>
```

### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page |
| status | string | - | Filter by status: pending, investigating, resolved, false_positive |
| reportType | string | - | Filter by type: phishing, spam, malware, spoofing, other |

### Request
No body required

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c8b1f8c8e1c3",
      "emailId": {
        "_id": "60d5ec49f1b2c8b1f8c8e1b2",
        "from": "sender@example.com",
        "to": "proxy123@shield.proxy",
        "subject": "Important Message"
      },
      "reportType": "phishing",
      "description": "Suspicious login attempt",
      "reportedBy": "admin@company.com",
      "status": "pending",
      "severity": "high",
      "indicators": [
        "Urgency language detected"
      ],
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 3
  }
}
```

---

### Get Fraud Report By ID

**Endpoint:** `GET /api/fraud/:id`

**Headers:**
```
Authorization: Bearer <token>
```

### Request
No body required

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c8b1f8c8e1c3",
    "emailId": {
      "_id": "60d5ec49f1b2c8b1f8c8e1b2",
      "from": "sender@example.com",
      "to": "proxy123@shield.proxy",
      "subject": "Important Message",
      "fraudScore": 65,
      "fraudFlags": ["Urgency language detected"]
    },
    "reportType": "phishing",
    "description": "Suspicious login attempt",
    "reportedBy": "admin@company.com",
    "status": "investigating",
    "severity": "high",
    "indicators": ["Urgency language detected"],
    "resolution": "",
    "resolvedAt": null,
    "resolvedBy": null,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Response (404 Not Found)
```json
{
  "success": false,
  "message": "Fraud report not found"
}
```

---

### Resolve Fraud Report

**Endpoint:** `PATCH /api/fraud/:id/resolve`

Resolves a fraud report.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

### Request
```json
{
  "resolution": "Confirmed as phishing attempt. Domain blocked.",
  "resolvedBy": "security@company.com",
  "status": "resolved"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| resolution | string | No | Resolution notes |
| resolvedBy | string | No | Email of resolver |
| status | string | No | resolved or false_positive (default: resolved) |

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c8b1f8c8e1c3",
    "emailId": "60d5ec49f1b2c8b1f8c8e1b2",
    "reportType": "phishing",
    "description": "Suspicious login attempt",
    "reportedBy": "admin@company.com",
    "status": "resolved",
    "severity": "high",
    "indicators": ["Urgency language detected"],
    "resolution": "Confirmed as phishing attempt. Domain blocked.",
    "resolvedAt": "2024-01-02T12:00:00.000Z",
    "resolvedBy": "security@company.com",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-02T12:00:00.000Z"
  },
  "message": "Report resolved successfully"
}
```

### Response (404 Not Found)
```json
{
  "success": false,
  "message": "Fraud report not found"
}
```

---

## Email Routing Flow

```
External Email → Proxy Email → Proxy Engine → Fraud Analysis
                                              ↓
                                    (if not fraudulent)
                                              ↓
                                    Lookup ShieldIdentity
                                              ↓
                                    Get User's Real Email
                                              ↓
                                    Forward to Real Email
```

### Routing Process

1. Email received at proxy address (e.g., `proxy123@shield.proxy`)
2. Fraud analysis performed on email content
3. If fraudulent (score >= 50), email is blocked
4. If safe, lookup ShieldIdentity by proxy_email
5. Get user_id from ShieldIdentity
6. Lookup User by user_id to get real_email
7. Forward email to real_email with `[Proxy]` prefix in subject
8. Add tracking headers:
   - `X-Original-To`: The proxy email
   - `X-Forwarded-To`: The user's real email
   - `X-Proxy-Identity`: ShieldIdentity ID

### Routing Failure Reasons

| Reason | Description |
|--------|-------------|
| no_active_shield_identity | No active shield identity found for proxy email |
| user_not_found | User not found for this shield identity |
| user_inactive | User account is not active |
| forward_failed | Failed to send email to real email |

---

## SMTP Server (Optional)

When `ENABLE_SMTP=true`, the Proxy Engine runs an SMTP server on port 2525 (default).

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PROXY_ENGINE_PORT | 3001 | HTTP server port |
| ENABLE_SMTP | false | Enable SMTP server |
| SMTP_PORT | 2525 | SMTP server port |
| SMTP_USER | - | SMTP authentication username |
| SMTP_PASS | - | SMTP authentication password |
| MONGODB_URI | - | MongoDB connection string |
| REQUIRE_AUTH | false | Require authentication for fraud routes |
| EMAIL_USER | - | Email sender address |
| EMAIL_PASS | - | Email sender password |
