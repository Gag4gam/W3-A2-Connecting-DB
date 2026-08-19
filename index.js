require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

const Database = require('better-sqlite3');
const db = new Database('tasks.db');
const bodyParser = require('body-parser');
const router = express.Router();

const app = express();
const port = 3000;
const { pool, initDB } = require('./db');

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


initDB().catch(err => {
  console.error('Failed to initialize database:', err);
});

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

//To get entire list of tasks, you can use the following curl command:
//curl -i http://localhost:3000/tasks
app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'database Error' });
  }
});

// because I was using windows had to test with:
// curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{""title"":""play video games""}" 
// in the cmd as otherwise it wouldn't read de """" properly

app.get('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    console.error('Error fetching task by id:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

//create a new task 

app.post('/tasks', async(req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Bad Request'});
  }
  try {
    const result = await pool.query('INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING *', [title, false]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Database error' });
  }
  const newTask = db.prepare('INSERT INTO tasks (title, done) VALUES (?,?)').run(title.trim(), 0);
  res.status(201).json(newTask);
});

// update a task by id

app.put('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const { title, done } = req.body;

  // Validate body: at least one field must be provided
  if (title === undefined && done === undefined) {
    return res.status(400).json({ error: 'Empty/invalid body' });
  }

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ error: 'Empty/invalid body' });
  }

  if (done !== undefined && typeof done !== 'boolean') {
    return res.status(400).json({ error: 'Empty/invalid body' });
  }

  try {
    // First, fetch the current task to preserve unmodified fields
    const current = await pool.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    if (current.rows.length === 0) {
      return res.status(404).json({ error: 'Unknown id' });
    }

    const newTitle = title !== undefined ? title.trim() : current.rows[0].title;
    const newDone = done !== undefined ? done : current.rows[0].done;

    const result = await pool.query(
      'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *',
      [newTitle, newDone, taskId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// change title: curl -i -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d "{\"title\": \"title change\"}"
// change done : curl -i -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d "{\"done\": true}"




///delete a task by id
 

app.delete('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [taskId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Unknown id' });
    }
    return res.status(204).json();
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

//curl -i -X DELETE http://localhost:3000/tasks/

//port message

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

