// Initialize Express application
const express = require('express');
const app = express();

app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

module.exports = app;