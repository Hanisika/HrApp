const express = require('express');
const router = express.Router();
const Task = require('../model/task');

// Create task
router.post('/assign', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get tasks assigned to a user
router.get('/employee/:email', async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.email });
    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get tasks assigned by a manager
router.get('/manager/:email', async (req, res) => {
  try {
    const tasks = await Task.find({ assignedBy: req.params.email });
    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update task status
router.put('/:id/status', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
