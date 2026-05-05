const express = require('express');
const Task = require('../models/Task');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, async (req, res) => {
    try {
      const tasks = await Task.find()
        .populate('project', 'name')
        .populate('assignee', 'name email');
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post(protect, admin, async (req, res) => {
    const { title, description, project, assignee, dueDate } = req.body;
    try {
      const task = await Task.create({
        title,
        description,
        project,
        assignee: assignee || null,
        dueDate
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.route('/:id')
  .put(protect, async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });
      
      // Members can only update status if they are assignee, but let's allow all for simplicity in demo
      if (req.body.status) task.status = req.body.status;
      if (req.user.role === 'Admin') {
        if (req.body.title) task.title = req.body.title;
        if (req.body.description) task.description = req.body.description;
        if (req.body.assignee !== undefined) task.assignee = req.body.assignee;
        if (req.body.dueDate) task.dueDate = req.body.dueDate;
      }

      const updatedTask = await task.save();
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .delete(protect, admin, async (req, res) => {
    try {
      await Task.findByIdAndDelete(req.params.id);
      res.json({ message: 'Task removed' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
