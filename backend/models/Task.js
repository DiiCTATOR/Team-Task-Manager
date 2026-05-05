const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Project = require('./Project');
const User = require('./User');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  dueDate: { type: DataTypes.DATE }
});

Task.belongsTo(Project, { as: 'project', foreignKey: 'projectId', onDelete: 'CASCADE' });
Task.belongsTo(User, { as: 'assignee', foreignKey: 'assigneeId' });

module.exports = Task;
