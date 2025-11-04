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

// --- Create Users Table Route ---
app.get("/createtable", async (req, res) => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
    res.send("✅ Table 'users' created successfully!");
  } catch (err) {
    console.error("❌ Error creating table:", err.message);
    res.status(500).send("❌ Error creating table: " + err.message);
  }
});

// --- Register route (Insert data) ---
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

// ==========================
// 📜 View All Users
// ==========================
app.get("/viewusers", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, created_at FROM users ORDER BY id ASC");
    res.json({ status: "success", users: result.rows });
  } catch (err) {
    console.error("❌ View Error:", err.message);
    res.status(500).json({ status: "error", message: "Failed to fetch users" });
  }
});

// ==========================
// ✏️ Update User
// ==========================
app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const result = await pool.query(
      "UPDATE users SET name=$1, email=$2, password=$3 WHERE id=$4 RETURNING *",
      [name, email, password, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ status: "error", message: "User not found" });

    res.json({ status: "success", user: result.rows[0] });
  } catch (err) {
    console.error("❌ Update Error:", err.message);
    res.status(500).json({ status: "error", message: "Failed to update user" });
  }
});

// ==========================
// ❌ Delete User
// ==========================
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ status: "error", message: "User not found" });

    res.json({ status: "success", message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Error:", err.message);
    res.status(500).json({ status: "error", message: "Failed to delete user" });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
