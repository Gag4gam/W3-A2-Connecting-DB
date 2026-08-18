# Task API with SQLite Database

A RESTful Task Management API built with **Node.js**, **Express**, and **better-sqlite3**, featuring persistent data storage and interactive Swagger UI documentation.

---

## Database Architecture: Why SQLite?

SQLite was chosen as the database solution for several key reasons:
* Single File Storage: The entire database lives in one portable file (`tasks.db`) rather than requiring a dedicated background server process.
* Zero Configuration: No setup, separate installations, or connection credentials needed; it runs directly within the application runtime.
* Persistent Across Restarts: Unlike in-memory data structures, records survive server crashes and restarts.

### Database Location & Git Strategy
* File Location: The database file is located at `./tasks.db` in the root directory and is created automatically upon first server launch if not present.
* Version Control: `tasks.db` is typically added to `.gitignore` so every fresh clone initializes its own clean, seeded state without committing local binary artifacts.

---

##  Running the Project

Install dependencies and start the local server with:

```bash
npm install && node index.js

```

API Server: http://localhost:3000

Swagger Documentation: http://localhost:3000/docs

### Database Inspection (DB Browser for SQLite)

Below is a snapshot of the tasks table visualized in DB Browser for SQLite:

### Example SQL Query & Results

The following queries were executed to batch-update the status of all existing tasks to completed (done = 1) and inspect the entire table:

```bash
UPDATE tasks SET done = 1;
SELECT * FROM tasks;
```

### Result Table:

id    title              done  
1     Wash the dishes    1
2     clean the house    1
3     walk the dog       1
4     play video games   1 
5     Buy MIlk           1
6     Buy Vodka          1


### API Endpoints

Method,       Endpoint,       Description,                              Status Code (Success / Error)
GET,          /,              API Metadata,                             200 OK
GET,          /health,        Health Check,                             200 OK
GET,          /tasks,         List all tasks,                           200 OK
GET,          /tasks/:id,     Get task by ID,                           200 OK / 404 Not Found
POST,         /tasks,         Create a new task,                        201 Created / 400 Bad Request
PUT,          /tasks/:id,     Update task title and/or done status,     "200 OK / 400 Bad Request, 404 Not Found"
DELETE,       /tasks/:id,     Delete task by ID,                        204 No Content / 404 Not Found
POST,         /reset,         Reset and reseed sample tasks,            200 OK