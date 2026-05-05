require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

require('./models/User');
require('./models/Project');
require('./models/Task');

const startServer = async () => {
  try {
    await sequelize.sync();
    console.log("SQLite Database synced");
  } catch (err) {
    console.error("DB Connection Error:", err);
  }

  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/projects', require('./routes/projects'));
  app.use('/api/tasks', require('./routes/tasks'));

  app.use(express.static(path.join(__dirname, '../frontend')));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`));
};

startServer();
