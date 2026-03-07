# Communication Proxy API

## Create Communication Proxy

**Endpoint:** `POST /api/communication-proxy`

### Request
```json
{
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "type": "email",
  "sender": "sender@example.com",
  "recipient": "recipient@example.com",
  "received_at": "2024-01-01T12:00:00.000Z",
  "delivered_at": "2024-01-01T12:05:00.000Z",
  "status": "delivered",
  "sanitized_content": "Clean email content"
}
```

### Response (201 Created)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1e5",
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "type": "email",
  "sender": "sender@example.com",
  "recipient": "recipient@example.com",
  "received_at": "2024-01-01T12:00:00.000Z",
  "delivered_at": "2024-01-01T12:05:00.000Z",
  "status": "delivered",
  "sanitized_content": "Clean email content",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Get All Communication Proxies

**Endpoint:** `GET /api/communication-proxy`

### Request
No body required

### Response (200 OK)
```json
[
  {
    "_id": "60d5ec49f1b2c8b1f8c8e1e5",
    "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
    "type": "email",
    "sender": "sender@example.com",
    "recipient": "recipient@example.com",
    "received_at": "2024-01-01T12:00:00.000Z",
    "delivered_at": "2024-01-01T12:05:00.000Z",
    "status": "delivered",
    "sanitized_content": "Clean email content",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Get Communication Proxy By ID

**Endpoint:** `GET /api/communication-proxy/:id`

### Request
No body required

### Response (200 OK)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1e5",
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "type": "email",
  "sender": "sender@example.com",
  "recipient": "recipient@example.com",
  "received_at": "2024-01-01T12:00:00.000Z",
  "delivered_at": "2024-01-01T12:05:00.000Z",
  "status": "delivered",
  "sanitized_content": "Clean email content",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Response (404 Not Found)
```json
{
  "message": "Communication proxy not found"
}
```

---

## Update Communication Proxy

**Endpoint:** `PUT /api/communication-proxy/:id`

### Request
```json
{
  "status": "filtered",
  "sanitized_content": "Filtered content"
}
```

### Response (200 OK)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1e5",
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "type": "email",
  "sender": "sender@example.com",
  "recipient": "recipient@example.com",
  "received_at": "2024-01-01T12:00:00.000Z",
  "delivered_at": "2024-01-01T12:05:00.000Z",
  "status": "filtered",
  "sanitized_content": "Filtered content",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

### Response (404 Not Found)
```json
{
  "message": "Communication proxy not found"
}
```

---

## Delete Communication Proxy

**Endpoint:** `DELETE /api/communication-proxy/:id`

### Request
No body required

### Response (200 OK)
```json
{
  "message": "Communication proxy deleted successfully"
}
```

### Response (404 Not Found)
```json
{
  "message": "Communication proxy not found"
}
```
