# Identity Rotation API

## Create Identity Rotation

**Endpoint:** `POST /api/identity-rotation`

### Request
```json
{
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "rotation_type": "auto",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "reason": "Routine rotation",
  "new_shield_id": "60d5ec49f1b2c8b1f8c8e1b2"
}
```

### Response (201 Created)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1d4",
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "rotation_type": "auto",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "reason": "Routine rotation",
  "new_shield_id": "60d5ec49f1b2c8b1f8c8e1b2",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Get All Identity Rotations

**Endpoint:** `GET /api/identity-rotation`

### Request
No body required

### Response (200 OK)
```json
[
  {
    "_id": "60d5ec49f1b2c8b1f8c8e1d4",
    "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
    "rotation_type": "auto",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "reason": "Routine rotation",
    "new_shield_id": "60d5ec49f1b2c8b1f8c8e1b2",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Get Identity Rotation By ID

**Endpoint:** `GET /api/identity-rotation/:id`

### Request
No body required

### Response (200 OK)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1d4",
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "rotation_type": "auto",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "reason": "Routine rotation",
  "new_shield_id": "60d5ec49f1b2c8b1f8c8e1b2",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Response (404 Not Found)
```json
{
  "message": "Identity rotation not found"
}
```

---

## Update Identity Rotation

**Endpoint:** `PUT /api/identity-rotation/:id`

### Request
```json
{
  "reason": "Updated reason for rotation",
  "rotation_type": "manual"
}
```

### Response (200 OK)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1d4",
  "shield_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "rotation_type": "manual",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "reason": "Updated reason for rotation",
  "new_shield_id": "60d5ec49f1b2c8b1f8c8e1b2",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

### Response (404 Not Found)
```json
{
  "message": "Identity rotation not found"
}
```

---

## Delete Identity Rotation

**Endpoint:** `DELETE /api/identity-rotation/:id`

### Request
No body required

### Response (200 OK)
```json
{
  "message": "Identity rotation deleted successfully"
}
```

### Response (404 Not Found)
```json
{
  "message": "Identity rotation not found"
}
```
