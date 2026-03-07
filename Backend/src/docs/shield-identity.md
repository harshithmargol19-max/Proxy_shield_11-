# Shield Identity API

## Create Shield Identity

**Endpoint:** `POST /api/shield-identity`

### Request
```json
{
  "user_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "proxy_email": "proxy@example.com",
  "proxy_phone": "+1234567890",
  "browser_fingerprint": "abc123def456",
  "last_used": "2024-01-01T12:00:00.000Z",
  "status": "active",
  "linked_services": ["service1", "service2"]
}
```

### Response (201 Created)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1b2",
  "user_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "proxy_email": "proxy@example.com",
  "proxy_phone": "+1234567890",
  "browser_fingerprint": "abc123def456",
  "creation_time": "2024-01-01T00:00:00.000Z",
  "last_used": "2024-01-01T12:00:00.000Z",
  "status": "active",
  "linked_services": ["service1", "service2"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Get All Shield Identities

**Endpoint:** `GET /api/shield-identity`

### Request
No body required

### Response (200 OK)
```json
[
  {
    "_id": "60d5ec49f1b2c8b1f8c8e1b2",
    "user_id": "60d5ec49f1b2c8b1f8c8e1a1",
    "proxy_email": "proxy@example.com",
    "proxy_phone": "+1234567890",
    "browser_fingerprint": "abc123def456",
    "creation_time": "2024-01-01T00:00:00.000Z",
    "last_used": "2024-01-01T12:00:00.000Z",
    "status": "active",
    "linked_services": ["service1", "service2"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Get Shield Identity By ID

**Endpoint:** `GET /api/shield-identity/:id`

### Request
No body required

### Response (200 OK)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1b2",
  "user_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "proxy_email": "proxy@example.com",
  "proxy_phone": "+1234567890",
  "browser_fingerprint": "abc123def456",
  "creation_time": "2024-01-01T00:00:00.000Z",
  "last_used": "2024-01-01T12:00:00.000Z",
  "status": "active",
  "linked_services": ["service1", "service2"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Response (404 Not Found)
```json
{
  "message": "Shield identity not found"
}
```

---

## Update Shield Identity

**Endpoint:** `PUT /api/shield-identity/:id`

### Request
```json
{
  "status": "burned",
  "last_used": "2024-01-02T12:00:00.000Z"
}
```

### Response (200 OK)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1b2",
  "user_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "proxy_email": "proxy@example.com",
  "proxy_phone": "+1234567890",
  "browser_fingerprint": "abc123def456",
  "creation_time": "2024-01-01T00:00:00.000Z",
  "last_used": "2024-01-02T12:00:00.000Z",
  "status": "burned",
  "linked_services": ["service1", "service2"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

### Response (404 Not Found)
```json
{
  "message": "Shield identity not found"
}
```

---

## Delete Shield Identity

**Endpoint:** `DELETE /api/shield-identity/:id`

### Request
No body required

### Response (200 OK)
```json
{
  "message": "Shield identity deleted successfully"
}
```

### Response (404 Not Found)
```json
{
  "message": "Shield identity not found"
}
```
