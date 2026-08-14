const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();
const port = 3000;

app.use(express.json());

const tasks = [{
  id: 1,  title: 'Wash the dishes',  done: false},
{ id: 2,  title: 'clean the house',  done: true},
{ id: 3,  title: 'walk the dog',  done: false},
];

app.get('/', (req, res) => {
  res.json({
    name: 'Task API',
    version: '1.0',
    endpoints: ['/tasks']
  });
});

app.get('/health', (req, res) => {
  res.json({status: 'ok'});
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// because I was using windows had to test with/;
// curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{""title"":""play video games""}" in the cmd as otherwise it wouldn't read de ' properly

app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({error: 'Task not found'});
  }
});
  
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Bad Request'});
  }
  const newTask = {
    id: tasks.length + 1,
    title: title.trim(),
    done: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
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
    task.title = title.trim();
  }

  if (done !== undefined) {
    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: 'Empty/invalid body' });
    }
    task.done = done;
  }

  res.json(task);
});

// change title: curl -i -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d "{\"title\": \"Apenas o titulo mudou\"}"
// change done : curl -i -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d "{\"done\": true}"

app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const deletedTask = tasks.splice(taskIndex, 1);
  return res.status(204).json({ message: 'No content', task: deletedTask });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

