// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // PostgreSQL client

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Port setup (Render sets process.env.PORT automatically)
const PORT = process.env.PORT || 3000;

// PostgreSQL database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false } // Required for Render Postgres
});

// Test DB connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1); // Exit if DB fails
  } else {
    console.log('✅ PostgreSQL connected successfully');
    release();
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Example route: fetch courses
app.get('/courses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching courses:', err.message);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
