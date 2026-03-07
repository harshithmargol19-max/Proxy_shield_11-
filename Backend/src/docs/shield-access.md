# Shield Access API

## Create Shield Access

**Endpoint:** `POST /api/shield-access`

### Request
```json
{
  "shield_id": "SHIELD_001",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "ip_address": "192.168.1.1",
  "ip_country": "USA",
  "device_type": "desktop",
  "browser": "Chrome",
  "os": "Windows",
  "login_hour": 12,
  "request_frequency": 0,
  "is_proxy": false
}
```

### Response (201 Created)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "shield_id": "SHIELD_001",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "ip_address": "192.168.1.1",
  "ip_country": "USA",
  "device_type": "desktop",
  "browser": "Chrome",
  "os": "Windows",
  "login_hour": 12,
  "request_frequency": 0,
  "is_proxy": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Get All Shield Accesses

**Endpoint:** `GET /api/shield-access`

### Request
No body required

### Response (200 OK)
```json
[
  {
    "_id": "60d5ec49f1b2c8b1f8c8e1a1",
    "shield_id": "SHIELD_001",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "ip_address": "192.168.1.1",
    "ip_country": "USA",
    "device_type": "desktop",
    "browser": "Chrome",
    "os": "Windows",
    "login_hour": 12,
    "request_frequency": 0,
    "is_proxy": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Get Shield Access By ID

**Endpoint:** `GET /api/shield-access/:id`

### Request
No body required

### Response (200 OK)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "shield_id": "SHIELD_001",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "ip_address": "192.168.1.1",
  "ip_country": "USA",
  "device_type": "desktop",
  "browser": "Chrome",
  "os": "Windows",
  "login_hour": 12,
  "request_frequency": 0,
  "is_proxy": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Response (404 Not Found)
```json
{
  "message": "Shield access not found"
}
```

---

## Update Shield Access

**Endpoint:** `PUT /api/shield-access/:id`

### Request
```json
{
  "is_proxy": true,
  "request_frequency": 5
}
```

### Response (200 OK)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "shield_id": "SHIELD_001",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "ip_address": "192.168.1.1",
  "ip_country": "USA",
  "device_type": "desktop",
  "browser": "Chrome",
  "os": "Windows",
  "login_hour": 12,
  "request_frequency": 5,
  "is_proxy": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

### Response (404 Not Found)
```json
{
  "message": "Shield access not found"
}
```

---

## Delete Shield Access

**Endpoint:** `DELETE /api/shield-access/:id`

### Request
No body required

### Response (200 OK)
```json
{
  "message": "Shield access deleted successfully"
}
```

### Response (404 Not Found)
```json
{
  "message": "Shield access not found"
}
```
