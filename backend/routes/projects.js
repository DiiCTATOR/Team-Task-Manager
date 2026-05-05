const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, async (req, res) => {
    try {
      const projects = await Project.findAll({
        include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }]
      });
      res.json(projects.map(p => {
        let pJSON = p.toJSON();
        pJSON._id = pJSON.id;
        pJSON.owner._id = pJSON.owner.id;
        return pJSON;
      }));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post(protect, admin, async (req, res) => {
    const { name, description } = req.body;
    try {
      const project = await Project.create({ name, description, ownerId: req.user.id });
      res.status(201).json({ ...project.toJSON(), _id: project.id });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.route('/:id')
  .delete(protect, admin, async (req, res) => {
    try {
      await Project.destroy({ where: { id: req.params.id } });
      // Sequelize CASCADE deletes tasks if configured, or we delete explicitly
      await Task.destroy({ where: { projectId: req.params.id } });
      res.json({ message: 'Project removed' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
