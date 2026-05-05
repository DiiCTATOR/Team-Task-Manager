const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, async (req, res) => {
    try {
      const projects = await Project.find().populate('owner', 'name email');
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post(protect, admin, async (req, res) => {
    const { name, description } = req.body;
    try {
      const project = await Project.create({
        name,
        description,
        owner: req.user.id
      });
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.route('/:id')
  .delete(protect, admin, async (req, res) => {
    try {
      await Project.findByIdAndDelete(req.params.id);
      await Task.deleteMany({ project: req.params.id });
      res.json({ message: 'Project removed' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
