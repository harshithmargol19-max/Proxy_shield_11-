# AI Log API

## Create AI Log

**Endpoint:** `POST /api/ai-log`

### Request
```json
{
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "action": "proxy_detection",
  "confidence": 0.95,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "metadata": {
    "model": "shield-ai-v1",
    "features_analyzed": ["ip_reputation", "behavior_pattern"]
  }
}
```

### Response (201 Created)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1g7",
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "action": "proxy_detection",
  "confidence": 0.95,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "metadata": {
    "model": "shield-ai-v1",
    "features_analyzed": ["ip_reputation", "behavior_pattern"]
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Get All AI Logs

**Endpoint:** `GET /api/ai-log`

### Request
No body required

### Response (200 OK)
```json
[
  {
    "_id": "60d5ec49f1b2c8b1f8c8e1g7",
    "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
    "action": "proxy_detection",
    "confidence": 0.95,
    "timestamp": "2024-01-01T12:00:00.000Z",
    "metadata": {
      "model": "shield-ai-v1",
      "features_analyzed": ["ip_reputation", "behavior_pattern"]
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Get AI Log By ID

**Endpoint:** `GET /api/ai-log/:id`

### Request
No body required

### Response (200 OK)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1g7",
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "action": "proxy_detection",
  "confidence": 0.95,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "metadata": {
    "model": "shield-ai-v1",
    "features_analyzed": ["ip_reputation", "behavior_pattern"]
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Response (404 Not Found)
```json
{
  "message": "Log not found"
}
```

---

## Update AI Log

**Endpoint:** `PUT /api/ai-log/:id`

### Request
```json
{
  "confidence": 0.98,
  "metadata": {
    "model": "shield-ai-v1",
    "features_analyzed": ["ip_reputation", "behavior_pattern"],
    "verified": true
  }
}
```

### Response (200 OK)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1g7",
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "action": "proxy_detection",
  "confidence": 0.98,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "metadata": {
    "model": "shield-ai-v1",
    "features_analyzed": ["ip_reputation", "behavior_pattern"],
    "verified": true
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

### Response (404 Not Found)
```json
{
  "message": "Log not found"
}
```

---

## Delete AI Log

**Endpoint:** `DELETE /api/ai-log/:id`

### Request
No body required

### Response (200 OK)
```json
{
  "message": "Log deleted successfully"
}
```

### Response (404 Not Found)
```json
{
  "message": "Log not found"
}
```
