require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Set default fallback URI for quick testing if user hasn't set it
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/taskmanager";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>console.log("DB Connected to " + mongoURI))
  .catch(err => console.error("DB Connection Error:", err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// Serve static frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`));
