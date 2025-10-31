import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

// === PostgreSQL connection ===
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Render automatically sets this
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(cors());
app.use(express.json());

// --- Test route ---
app.get("/", (req, res) => {
  res.json({ message: "Backend is running successfully 🚀" });
});

// --- Register route ---
app.post("/register", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email)
      return res.status(400).json({ error: "Missing fields" });

    await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2)",
      [name, email]
    );

    res.json({ status: "success", message: "User added!" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
