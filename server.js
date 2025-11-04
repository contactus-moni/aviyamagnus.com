import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to PostgreSQL using environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { require: true, rejectUnauthorized: false }
});

// Default route
app.get("/", (req, res) => res.send("✅ Backend live and connected to PostgreSQL"));

// Test database connection
app.get("/testdb", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    res.json({ success: true, now: rows[0].now });
  } catch (err) {
    console.error("DB test error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
