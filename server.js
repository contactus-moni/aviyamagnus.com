// ✅ Aviya Magnus Backend Server

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

// --------------------------------------
// 🌐 Express App Setup
// --------------------------------------
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

// --------------------------------------
// 🗄️ PostgreSQL Connection
// --------------------------------------

// ✅ Use environment variables on Render; fallback to local DB
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "postgres",
  password: process.env.DB_PASSWORD || "Monicaanandan",
  port: process.env.DB_PORT || 5432,
  ssl:
    process.env.DB_SSL === "true"
      ? { rejectUnauthorized: false } // Render hosted PostgreSQL
      : false, // Local pgAdmin
});

// ✅ Test DB connection at startup
pool
  .connect()
  .then(() => console.log("✅ PostgreSQL connected successfully"))
  .catch((err) => console.error("❌ Database connection failed:", err));

// --------------------------------------
// 🔹 Test Route
// --------------------------------------
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

// --------------------------------------
// 🧾 Registration Route
// --------------------------------------
app.post("/register", async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || !email || !password || !phone || !role) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required.",
    });
  }

  try {
    const query = `
      INSERT INTO users (name, email, password, phone, role, created_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      RETURNING id
    `;
    const values = [name, email, password, phone, role];

    const result = await pool.query(query, values);

    res.status(200).json({
      status: "success",
      message: "User registered successfully!",
      userId: result.rows[0].id,
    });
  } catch (error) {
    console.error("❌ Error inserting user:", error);
    res.status(500).json({
      status: "error",
      message: "Database error",
      error: error.message,
    });
  }
});

// --------------------------------------
// 🏠 Root Route
// --------------------------------------
app.get("/", (req, res) => {
  res.send("🚀 Aviya Magnus Backend is Live!");
});

// --------------------------------------
// ▶️ Start Server
// --------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
