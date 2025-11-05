const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL pool connecting to Render DB with SSL bypass
const pool = new Pool({
  user: "aviyamagnus",
  host: "dpg‑d3rm7q95pdvs73fql7s0‑a.oregion‑postgres.render.com", // Render DB host
  database: "aviyamangus",
  password: "k6zXVRlotvtVRJzgRXKM0Z01CkQPz6dl",
  port: 5432,
  ssl: { rejectUnauthorized: false } // <-- bypass SSL verification
});

// Test GET endpoint to see all users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Register POST endpoint
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, password]
    );
    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Start server on port from Render or default 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

