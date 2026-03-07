# Users API

## Create User

**Endpoint:** `POST /api/users`

### Request
```json
{
  "field1": "value1",
  "field2": "value2"
}
```

### Response (201 Created)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "field1": "value1",
  "field2": "value2",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Get All Users

**Endpoint:** `GET /api/users`

### Request
No body required

### Response (200 OK)
```json
[
  {
    "_id": "60d5ec49f1b2c8b1f8c8e1a1",
    "field1": "value1",
    "field2": "value2",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Get User By ID

**Endpoint:** `GET /api/users/:id`

### Request
No body required

### Response (200 OK)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "field1": "value1",
  "field2": "value2",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Response (404 Not Found)
```json
{
  "message": "User not found"
}
```

---

## Update User

**Endpoint:** `PUT /api/users/:id`

### Request
```json
{
  "field1": "updated_value"
}
```

### Response (200 OK)
```json
{
  "_id": "60d5ec49f1b2c8b1f8c8e1a1",
  "field1": "updated_value",
  "field2": "value2",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

### Response (404 Not Found)
```json
{
  "message": "User not found"
}
```

---

## Delete User

**Endpoint:** `DELETE /api/users/:id`

### Request
No body required

### Response (200 OK)
```json
{
  "message": "User deleted successfully"
}
```

### Response (404 Not Found)
```json
{
  "message": "User not found"
}
```
