app.get("/", (req, res) => {
  res.send("Backend is running and connected successfully 🚀");
});
import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: { rejectUnauthorized: false },
});

// --- Default route ---
app.get("/", (req, res) => {
  res.send("✅ Server is live and connected to PostgreSQL!");
});

// --- Register route ---
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1️⃣ check if user already exists
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ status: "error", message: "Email already exists" });
    }

    // 2️⃣ insert user data
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );

    res.json({ status: "success", user: newUser.rows[0] });
  } catch (err) {
    console.error("❌ Database Error:", err.message);
    res.status(500).json({ status: "error", message: "Database error" });
  }
});

// --- Start server ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
