const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let tasks = [
    { id: 1, description: 'Buy groceries', status: 'incomplete' },
    { id: 2, description: 'Read a book', status: 'complete' },
];

// GET /tasks - Get all tasks
const pool = require('./DB');

app.get('/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});


// POST /tasks - Add a new task
app.post('/tasks', async (req, res) => {
    const { description, status } = req.body;
    if (!description || !status) {
        return res.status(400).json({ error: 'All fields (description, status) are required' });
    }

    try {
        await pool.query(
            'INSERT INTO tasks (description, status) VALUES ($1, $2)',
            [description, status]
        );
        res.status(201).json({ message: 'Task added' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding task' });
    }
});


// PUT /tasks/:id - Update a task's status
app.put('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const { status } = req.body;

    try {
        const result = await pool.query(
            'UPDATE tasks SET status = $1 WHERE id = $2',
            [status, taskId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task updated' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating task' });
    }
});


// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id, 10);

    try {
        const result = await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
});


