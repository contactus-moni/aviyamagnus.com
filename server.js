// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Port setup
const PORT = process.env.PORT || 3000;

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aviyamagnus',
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1); // Exit if DB fails
  } else {
    console.log('✅ Database connected successfully');
  }
});

// Simple test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Example API route to fetch courses (adjust table names as per your DB)
app.get('/courses', (req, res) => {
  const sql = 'SELECT * FROM courses';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching courses:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
