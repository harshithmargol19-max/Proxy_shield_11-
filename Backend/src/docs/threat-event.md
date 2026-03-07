# Threat Event API

## Create Threat Event

**Endpoint:** `POST /api/threat-event`

### Request
```json
{
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "event_type": "credential_leak",
  "detected_at": "2024-01-01T12:00:00.000Z",
  "severity": "high",
  "metadata": {
    "source": "monitoring_system",
    "details": "Suspicious activity detected"
  }
}
```

### Response (201 Created)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1c3",
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "event_type": "credential_leak",
  "detected_at": "2024-01-01T12:00:00.000Z",
  "severity": "high",
  "metadata": {
    "source": "monitoring_system",
    "details": "Suspicious activity detected"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Get All Threat Events

**Endpoint:** `GET /api/threat-event`

### Request
No body required

### Response (200 OK)
```json
[
  {
    "_id": "60d5ec49f1b2c8b1f8c8e1c3",
    "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
    "event_type": "credential_leak",
    "detected_at": "2024-01-01T12:00:00.000Z",
    "severity": "high",
    "metadata": {
      "source": "monitoring_system",
      "details": "Suspicious activity detected"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Get Threat Event By ID

**Endpoint:** `GET /api/threat-event/:id`

### Request
No body required

### Response (200 OK)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1c3",
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "event_type": "credential_leak",
  "detected_at": "2024-01-01T12:00:00.000Z",
  "severity": "high",
  "metadata": {
    "source": "monitoring_system",
    "details": "Suspicious activity detected"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Response (404 Not Found)
```json
{
  "message": "Threat event not found"
}
```

---

## Update Threat Event

**Endpoint:** `PUT /api/threat-event/:id`

### Request
```json
{
  "severity": "medium",
  "metadata": {
    "source": "monitoring_system",
    "details": "Updated details",
    "resolved": true
  }
}
```

### Response (200 OK)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1c3",
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "event_type": "credential_leak",
  "detected_at": "2024-01-01T12:00:00.000Z",
  "severity": "medium",
  "metadata": {
    "source": "monitoring_system",
    "details": "Updated details",
    "resolved": true
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

### Response (404 Not Found)
```json
{
  "message": "Threat event not found"
}
```

---

## Delete Threat Event

**Endpoint:** `DELETE /api/threat-event/:id`

### Request
No body required

### Response (200 OK)
```json
{
  "message": "Threat event deleted successfully"
}
```

### Response (404 Not Found)
```json
{
  "message": "Threat event not found"
}
```
