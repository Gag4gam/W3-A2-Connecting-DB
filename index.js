const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const Database = require('better-sqlite3');
const db = new Database('tasks.db');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();
const port = 3000;

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



//creating databse
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0
  );
`);

const countResult = db.prepare('SELECT COUNT(*) AS count FROM tasks').get();

if (countResult.count === 0) {
  const insertTask = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
  insertTask.run('Wash the dishes', 0);
  insertTask.run('clean the house', 1);
  insertTask.run('walk the dog', 0);
}

//tasks for reset endpoint
const initialTasks = [
  { id: 1, title: 'Wash the dishes', done: false },
  { id: 2, title: 'clean the house', done: true },
  { id: 3, title: 'walk the dog', done: false }
];

let tasks = JSON.parse(JSON.stringify(initialTasks));

app.post('/reset', (req, res) => {
  tasks = JSON.parse(JSON.stringify(initialTasks));
  res.status(200).json({
    message: 'Tasks reset to initial state',
    tasks: tasks
  });
});

app.get('/', (req, res) => {
  res.json({
    name: 'Task API',
    version: '1.0',
    endpoints: ['/tasks', '/stats', '/reset']
  });
});

app.get('/health', (req, res) => {
  res.json({status: 'ok'});
});

app.get('/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks').all();
  res.json(tasks);
});

// because I was using windows had to test with:
// curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{""title"":""play video games""}" 
// in the cmd as otherwise it wouldn't read de """" properly

app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({error: 'Task not found'});
  }
});

//create a new task 

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Bad Request'});
  }
  const newTask = db.prepare('INSERT INTO tasks (title, done) VALUES (?,?)').run(title.trim(), 0);
  res.status(201).json(newTask);
});

// update a task by id

app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskup = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  if (!taskup) {
    return res.status(404).json({ error: 'Unknown id' });
  }

  const { title, done } = req.body;

  if (title === undefined && done === undefined) {
    return res.status(400).json({ error: 'Empty/invalid body' });
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Empty/invalid body' });
    }
    taskup.title = title.trim();
  }

  if (done !== undefined) {
    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: 'Empty/invalid body' });
    }
    taskup.done = done;
  }
  
  const task = db.prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?').run(taskup.title, taskup.done ? 1 : 0, taskId);

  const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  res.json(updatedTask);
});

// change title: curl -i -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d "{\"title\": \"title change\"}"
// change done : curl -i -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d "{\"done\": true}"


///delete a task by id

app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const tasks = db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);
  if (tasks.changes === 0) {
    return res.status(404).json({ error: 'Task not found' });
  }
  return res.status(204).json({ message: 'No content' });
});


//port message

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

