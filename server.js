import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(bodyParser.json());

// ✅ PostgreSQL Connection
const pool = new Pool({
  user: "postgres",           // your DB user
  host: "localhost",          // your DB host
  database: "postgres",       // your DB name
  password: "Monicaanandan",  // your DB password
  port: 5432,
  ssl: false,                 // keep it false for local pgAdmin
});

// ✅ Route to test DB connection
app.get("/testdb", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "success",
      message: "Database connected successfully!",
      time: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Database test failed:", error);
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// ✅ Root route
app.get("/", (req, res) =
