const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();
const port = 3000;

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

app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({error: 'Task not found'});
  }

  res.json(tasks);
});
  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});