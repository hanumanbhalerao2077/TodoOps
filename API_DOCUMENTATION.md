# TodoOps API Documentation

Complete REST API documentation for the TodoOps backend service.

## Base URL

```
Development: http://localhost:5000
Production: https://api.example.com (configure as needed)
```

## Table of Contents

- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Todo Operations](#todo-operations)

## Authentication

Currently, the API does not require authentication. In a production environment, consider implementing:

- JWT (JSON Web Tokens)
- API Keys
- OAuth 2.0

**Future Enhancement:** Add authentication middleware for secure deployments.

## Error Handling

### Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

### Error Response Format

```json
{
  "error": "Error message describing what went wrong",
  "status": 400,
  "timestamp": "2026-05-10T10:30:00Z"
}
```

## Endpoints

### Health Check

#### GET /

**Description:** Health check endpoint to verify API is running.

**Request:**
```bash
curl http://localhost:5000/
```

**Response:** `200 OK`
```json
{
  "message": "Server is running",
  "timestamp": "2026-05-10T10:30:00Z"
}
```

**Use Case:** 
- Kubernetes health probes
- Load balancer status checks
- Docker container health checks

---

### Todo Operations

#### GET /api/todos

**Description:** Retrieve all todos.

**Request:**
```bash
curl http://localhost:5000/api/todos
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: `active`, `completed` |
| `sort` | string | Sort field: `createdAt`, `updatedAt`, `title` |
| `order` | string | Sort order: `asc`, `desc` |
| `limit` | number | Limit results (default: 50) |
| `skip` | number | Skip results for pagination (default: 0) |

**Example:**
```bash
curl "http://localhost:5000/api/todos?status=active&sort=createdAt&order=desc&limit=10"
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "createdAt": "2026-05-10T09:00:00Z",
      "updatedAt": "2026-05-10T09:00:00Z"
    }
  ],
  "count": 1,
  "total": 1
}
```

---

#### POST /api/todos

**Description:** Create a new todo.

**Request:**
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Kubernetes",
    "description": "Complete Kubernetes certification"
  }'
```

**Request Body:**
```json
{
  "title": "string (required, max 200 chars)",
  "description": "string (optional, max 1000 chars)",
  "completed": "boolean (optional, default: false)"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Learn Kubernetes",
    "description": "Complete Kubernetes certification",
    "completed": false,
    "createdAt": "2026-05-10T10:00:00Z",
    "updatedAt": "2026-05-10T10:00:00Z"
  }
}
```

**Error Examples:**

Missing required field:
```json
{
  "success": false,
  "error": "Title is required"
}
```

---

#### GET /api/todos/:id

**Description:** Retrieve a specific todo by ID.

**Request:**
```bash
curl http://localhost:5000/api/todos/507f1f77bcf86cd799439011
```

**Parameters:**
- `id` (string): MongoDB object ID of the todo

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "createdAt": "2026-05-10T09:00:00Z",
    "updatedAt": "2026-05-10T09:00:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Todo not found"
}
```

---

#### PUT /api/todos/:id

**Description:** Update an existing todo.

**Request:**
```bash
curl -X PUT http://localhost:5000/api/todos/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries and cook",
    "completed": true
  }'
```

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "completed": "boolean (optional)"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Buy groceries and cook",
    "description": "Milk, eggs, bread",
    "completed": true,
    "createdAt": "2026-05-10T09:00:00Z",
    "updatedAt": "2026-05-10T10:30:00Z"
  }
}
```

---

#### DELETE /api/todos/:id

**Description:** Delete a todo.

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/todos/507f1f77bcf86cd799439011
```

**Parameters:**
- `id` (string): MongoDB object ID of the todo

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Todo deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Todo not found"
}
```

---

#### DELETE /api/todos

**Description:** Delete all completed todos.

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/todos?status=completed
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter: `completed` to delete only completed todos |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "5 completed todos deleted",
  "deletedCount": 5
}
```

---

## Usage Examples

### JavaScript/Fetch

```javascript
// Get all todos
const response = await fetch('http://localhost:5000/api/todos');
const todos = await response.json();
console.log(todos.data);

// Create a new todo
const newTodo = await fetch('http://localhost:5000/api/todos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Learn Docker',
    description: 'Master Docker containerization'
  })
});
const created = await newTodo.json();
console.log(created.data._id);

// Update a todo
const updated = await fetch('http://localhost:5000/api/todos/507f1f77bcf86cd799439011', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ completed: true })
});

// Delete a todo
const deleted = await fetch('http://localhost:5000/api/todos/507f1f77bcf86cd799439011', {
  method: 'DELETE'
});
```

### Python (requests library)

```python
import requests

API_URL = 'http://localhost:5000/api'

# Get all todos
response = requests.get(f'{API_URL}/todos')
todos = response.json()
print(todos['data'])

# Create a new todo
new_todo = {
    'title': 'Learn Python',
    'description': 'Advanced Python programming'
}
response = requests.post(f'{API_URL}/todos', json=new_todo)
created = response.json()
print(created['data']['_id'])

# Update a todo
update_data = {'completed': True}
response = requests.put(f'{API_URL}/todos/507f1f77bcf86cd799439011', json=update_data)

# Delete a todo
response = requests.delete(f'{API_URL}/todos/507f1f77bcf86cd799439011')
```

### cURL

```bash
# Get all todos
curl -s http://localhost:5000/api/todos | jq .

# Create with cURL
curl -s -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Details"}' | jq .

# Update
curl -s -X PUT http://localhost:5000/api/todos/ID \
  -H "Content-Type: application/json" \
  -d '{"completed":true}' | jq .

# Delete
curl -s -X DELETE http://localhost:5000/api/todos/ID | jq .
```

## Rate Limiting

Currently no rate limiting is implemented. For production:

- Implement rate limiting (e.g., 100 requests/minute per IP)
- Use middleware like `express-rate-limit`
- Add request throttling

## CORS Configuration

The API allows cross-origin requests from:
- `http://localhost:3000` (local development)
- `http://localhost:5173` (Vite development)

Update CORS settings in `server/index.js` for production domains.

## Testing the API

### Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create a new request collection
3. Use the endpoints documented above
4. Save requests for future use

### Using Insomnia

1. Download [Insomnia](https://insomnia.rest/)
2. Import API collection
3. Test endpoints with different parameters

### Using REST Client Extension (VS Code)

Install REST Client extension and create `requests.http`:

```http
### Health check
GET http://localhost:5000/

### Get all todos
GET http://localhost:5000/api/todos

### Create a todo
POST http://localhost:5000/api/todos
Content-Type: application/json

{
  "title": "Test todo",
  "description": "Testing API"
}

### Get specific todo
GET http://localhost:5000/api/todos/{{todoId}}

### Update todo
PUT http://localhost:5000/api/todos/{{todoId}}
Content-Type: application/json

{
  "completed": true
}

### Delete todo
DELETE http://localhost:5000/api/todos/{{todoId}}
```

## API Health Monitoring

### Kubernetes Health Probes

The API supports Kubernetes health probes configured in `k8s/deployment-backend.yaml`:

```yaml
livenessProbe:
  httpGet:
    path: /
    port: 5000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /
    port: 5000
  initialDelaySeconds: 10
  periodSeconds: 5
```

### Docker Health Check

Docker Compose includes health checks:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:5000/"]
  interval: 10s
  timeout: 5s
  retries: 3
```

## Versioning

Current API Version: **v1**

Future versions may include:
- `/api/v2/todos` with additional features
- GraphQL endpoint
- WebSocket support for real-time updates

## Support and Issues

- Report bugs on [GitHub Issues](https://github.com/hanumanbhalerao2077/TodoOps/issues)
- Check [Deployment Guide](./DEPLOYMENT.md) for troubleshooting
- Review [Environment Setup](./ENVIRONMENT_SETUP.md) for configuration help

## Changelog

### Version 1.0.0 (Current)
- Basic CRUD operations for todos
- MongoDB persistence
- CORS support
- Docker and Kubernetes ready
- Health check endpoint
