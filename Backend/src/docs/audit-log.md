# Audit Log API

## Create Audit Log

**Endpoint:** `POST /api/audit-log`

### Request
```json
{
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "action": "rotation",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "blockchain_hash": "0x1234567890abcdef",
  "metadata": {
    "previous_status": "active",
    "new_status": "burned"
  }
}
```

### Response (201 Created)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1f6",
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "action": "rotation",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "blockchain_hash": "0x1234567890abcdef",
  "metadata": {
    "previous_status": "active",
    "new_status": "burned"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Get All Audit Logs

**Endpoint:** `GET /api/audit-log`

### Request
No body required

### Response (200 OK)
```json
[
  {
    "_id": "60d5ec49f1b2c8b1f8c8e1f6",
    "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
    "action": "rotation",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "blockchain_hash": "0x1234567890abcdef",
    "metadata": {
      "previous_status": "active",
      "new_status": "burned"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Get Audit Log By ID

**Endpoint:** `GET /api/audit-log/:id`

### Request
No body required

### Response (200 OK)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1f6",
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "action": "rotation",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "blockchain_hash": "0x1234567890abcdef",
  "metadata": {
    "previous_status": "active",
    "new_status": "burned"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Response (404 Not Found)
```json
{
  "message": "Audit log not found"
}
```

---

## Update Audit Log

**Endpoint:** `PUT /api/audit-log/:id`

### Request
```json
{
  "metadata": {
    "previous_status": "active",
    "new_status": "burned",
    "verified": true
  }
}
```

### Response (200 OK)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1f6",
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "action": "rotation",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "blockchain_hash": "0x1234567890abcdef",
  "metadata": {
    "previous_status": "active",
    "new_status": "burned",
    "verified": true
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

### Response (404 Not Found)
```json
{
  "message": "Audit log not found"
}
```

---

## Delete Audit Log

**Endpoint:** `DELETE /api/audit-log/:id`

### Request
No body required

### Response (200 OK)
```json
{
  "message": "Audit log deleted successfully"
}
```

### Response (404 Not Found)
```json
{
  "message": "Audit log not found"
}
```
