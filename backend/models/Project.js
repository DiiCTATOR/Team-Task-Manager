const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT }
});

Project.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

module.exports = Project;
