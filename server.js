import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// --- PostgreSQL Connection (Render environment variables) ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Render provides this automatically
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

// --- Default route ---
app.get("/", (req, res) => {
  res.send("✅ Backend is live and PostgreSQL connected!");
});

// --- Test route ---
app.get("/testdb", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    console.error("Database Error:", err.message);
    res.json({ success: false, error: err.message });
  }
});

// --- Register route ---
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ status: "error", message: "Email already exists" });
    }

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );

    res.json({ status: "success", user: newUser.rows[0] });
  } catch (err) {
    console.error("❌ Database Error:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
