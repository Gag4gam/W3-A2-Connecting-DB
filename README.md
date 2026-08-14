## Getting Started

### 1. Install Dependencies
npm install
node index.js

The server will start on: http://localhost:3000

Interactive Swagger Docs: http://localhost:3000/docs

Method,Endpoint,Description,Status Code (Success / Error)
GET,/,API Information / Meta info,200 OK
GET,/health,Health check endpoint,200 OK
GET,/tasks,List all tasks,200 OK
GET,/tasks/:id,Get a specific task by ID,200 OK / 404 Not Found
POST,/tasks,Create a new task,201 Created / 400 Bad Request
PUT,/tasks/:id,Update title and/or done status,200 OK / 400 Empty/invalid body, 404 Unknown id
DELETE,/tasks/:id,Remove a task by ID,204 No Content / 404 Unknown id

Sample cURL Output
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"Buy milk\"}"
  
response:

HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 39
ETag: W/"27-..."
Date: Fri, 14 Aug 2026 05:10:00 GMT
Connection: keep-alive

{
  "id": 4,
  "title": "Buy milk",
  "done": false
}

<img width="1477" height="8309" alt="Image" src="https://github.com/user-attachments/assets/0fcacda1-a9f2-4a4c-a5d5-0a22dddfe412" />
