const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, async (req, res) => {
    try {
      const tasks = await Task.findAll({
        include: [
          { model: Project, as: 'project', attributes: ['id', 'name'] },
          { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }
        ]
      });
      res.json(tasks.map(t => {
        let tJSON = t.toJSON();
        tJSON._id = tJSON.id;
        if(tJSON.project) tJSON.project._id = tJSON.project.id;
        if(tJSON.assignee) tJSON.assignee._id = tJSON.assignee.id;
        return tJSON;
      }));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post(protect, admin, async (req, res) => {
    const { title, description, project, assignee, dueDate } = req.body;
    try {
      const task = await Task.create({
        title, description, 
        projectId: project, 
        assigneeId: assignee || null, 
        dueDate
      });
      res.status(201).json({ ...task.toJSON(), _id: task.id });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.route('/:id')
  .put(protect, async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });
      
      if (req.body.status) task.status = req.body.status;
      if (req.user.role === 'Admin') {
        if (req.body.title) task.title = req.body.title;
        if (req.body.description) task.description = req.body.description;
        if (req.body.assignee !== undefined) task.assigneeId = req.body.assignee;
        if (req.body.dueDate) task.dueDate = req.body.dueDate;
      }

      await task.save();
      res.json({ ...task.toJSON(), _id: task.id });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .delete(protect, admin, async (req, res) => {
    try {
      await Task.destroy({ where: { id: req.params.id } });
      res.json({ message: 'Task removed' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
