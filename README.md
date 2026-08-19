# Task API with PostgreSQL & Docker

A RESTful Task Management API built with **Node.js**, **Express**, and and **PostgreSQL** (`pg`), running entirely in containerized environments via **Docker Compose** with persistent storage volumes and interactive Swagger UI documentation.

---

## Running the Project

Start the entire application stack (Node.js API + PostgreSQL Database) in one command:

```bash
docker compose up --build
```

API Server: http://localhost:3000

Swagger Documentation: http://localhost:3000/docs

TO STOP THE SERVICES:

```bash
docker compose down
```

### Environment Variables

The application uses environment variables for database connectivity.

Create a .env file in the root directory (based on .env.example):

```bash
DATABASE_URL=postgres://username:password@localhost:5432/database
```


### API Endpoints

| Method | Endpoint       | Description                             | Status Code (Success / Error)                 |
|:------:|:---------------|:----------------------------------------|:---------------------------------------------:|
|GET     | /,             | API Metadata,                           | 200 OK                                        |
|GET     | /health,       | Health Check,                           | 200 OK                                        |
|GET     | /tasks,        | List all tasks,                         | 200 / 500 Internal ServererrorOK              |
|GET     | /tasks/:id,    | Get task by ID,                         | 200 OK / 404 Not Found                        |
|POST    | /tasks,        | Create a new task,                      | 201 Created / 400 Bad Request                 |
|PUT     | /tasks/:id,    | Update task title and/or done status,   | 200 OK / 400 Bad Request / 404 Not Found      |
|DELETE  | /tasks/:id,    | Delete task by ID,                      | 204 No Content / 404 Not Found                |
|POST    | /reset,        | Reset and reseed sample tasks,          | 200 OK/ 500 Internal Server Error             |


### Sample Request & Response (curl -i)

Creating a new task:
```bash

curl -i -X POST http://localhost:3000/tasks \ -H "Content-Type: application/json" \ -d '{"title": "Deploy to production"}'
```

  Response:

```bash
  HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 46
Date: Wed, 19 Aug 2026 03:25:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": 4,
  "title": "Deploy to production",
  "done": false
}
```


### Database Verification & Inspection

Data persists inside a named Docker volume (taskdata).

Database Inspection via psql:
