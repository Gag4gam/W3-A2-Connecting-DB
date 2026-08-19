<<<<<<< HEAD
# Task API with PostgreSQL & Docker

A RESTful Task Management API built with **Node.js**, **Express**, and and **PostgreSQL** (`pg`), running entirely in containerized environments via **Docker Compose** with persistent storage volumes and interactive Swagger UI documentation.
=======

# Task API with SQLite Database

A restful Task Management API built with **Node.js**, **Express**, and **better-sqlite3**, featuring persistent data storage and interactive Swagger UI documentation.
>>>>>>> 4f4e0e15682bbc7573d6b47b9f8fe124e1fe5099

---

## 🚀 Running the Project

Start the entire application stack (Node.js API + PostgreSQL Database) in one command:

```bash
docker compose up --build
```

API Server: http://localhost:3000

Swagger Documentation: http://localhost:3000/docs

<<<<<<< HEAD
TO STOP THE SERVICES:
=======
### Database Inspection (DB Browser for SQLite)

Below is a snapshot of the tasks table visualized in DB Browser for SQLite:

<img width="1037" height="661" alt="Captura de tela 2026-08-18 025628" src="https://github.com/user-attachments/assets/9e0ade5a-7144-40be-9646-4e8ff4711989" />

### Example SQL Query & Results

The following queries were executed to batch-update the status of all existing tasks to completed (done = 1) and inspect the entire table:
>>>>>>> 4f4e0e15682bbc7573d6b47b9f8fe124e1fe5099

```bash
docker compose down
```

### Environment Variables

<<<<<<< HEAD
The application uses environment variables for database connectivity.

Create a .env file in the root directory (based on .env.example):

```bash
DATABASE_URL=postgres://username:password@localhost:5432/database
```
=======
| id | title             | done |
|:--:|:------------------|:----:|
| 1  | Wash the dishes   |  1   |
| 2  | clean the house   |  1   |
| 3  | walk the dog      |  1   |
| 4  | play video games  |  1   |
| 5  | Buy MIlk          |  1   |
| 6  | Buy Vodka         |  1   |
>>>>>>> 4f4e0e15682bbc7573d6b47b9f8fe124e1fe5099


### API Endpoints

| Method | Endpoint       | Description                             | Status Code (Success / Error)                 |
|:------:|:---------------|:----------------------------------------|:---------------------------------------------:|
|GET     | /,             | API Metadata,                           | 200 OK                                        |
|GET     | /health,       | Health Check,                           | 200 OK                                        |
<<<<<<< HEAD
|GET     | /tasks,        | List all tasks,                         | 200 / 500 Internal ServererrorOK              |
=======
|GET     | /tasks,        | List all tasks,                         | 200 OK                                        |
>>>>>>> 4f4e0e15682bbc7573d6b47b9f8fe124e1fe5099
|GET     | /tasks/:id,    | Get task by ID,                         | 200 OK / 404 Not Found                        |
|POST    | /tasks,        | Create a new task,                      | 201 Created / 400 Bad Request                 |
|PUT     | /tasks/:id,    | Update task title and/or done status,   | "200 OK / 400 Bad Request, 404 Not Found"     |
|DELETE  | /tasks/:id,    | Delete task by ID,                      | 204 No Content / 404 Not Found                |
<<<<<<< HEAD
|POST    | /reset,        | Reset and reseed sample tasks,          | 200 OK/ 500 Internal Server Error             |


### Sample Request & Response (curl -i)

Creating a new task:

curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Deploy to production"}'

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

=======
|POST    | /reset,        | Reset and reseed sample tasks,          | 200 OK                                        |
>>>>>>> 4f4e0e15682bbc7573d6b47b9f8fe124e1fe5099
