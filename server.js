// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

// PostgreSQL Pool
const pool = new Pool({
  connectionString: "postgresql://postgres:ZavKvXmHfseabcTxjNGjVLSRCxaXjySB@shuttle.proxy.rlwy.net:25707/railway",
  ssl: { rejectUnauthorized: false }
});

// Express App
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// REGISTER ROUTE
app.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, confirm_password, phone_number, captcha, role } = req.body;
  if (!first_name || !last_name || !email || !password || !confirm_password || !phone_number || !captcha || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (password !== confirm_password) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO aviyamagnus1 
       (first_name, last_name, email, password, confirm_password, phone_number, captcha, role)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [first_name, last_name, email, password, confirm_password, phone_number, captcha, role]
    );
    res.json({ status: "success", user: result.rows[0] });
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// LOGIN ROUTE
app.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: "Email, password, and role are required" });
  }
  try {
    const result = await pool.query(
      "SELECT * FROM aviyamagnus1 WHERE email = $1 AND role = $2",
      [email, role]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email, password, or role" });
    }
    const user = result.rows[0];
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid email, password, or role" });
    }
    res.json({ status: "success", message: "Login successful", user: { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// GET USERS (for testing)
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM aviyamagnus1");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
