import express from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();
app.use(cors()); // allow all origins, can restrict later
app.use(express.json());

// ✅ Replace with your Railway database details
const pool = new Pool({
  connectionString: "postgresql://postgres:ZavKvXmHfseabcTxjNGjVLSRCxaXjySB@shuttle.proxy.rlwy.net:25707/railway",
  ssl: { rejectUnauthorized: false } // bypass SSL certificate check
});

// --- Register endpoint ---
app.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, confirm_password, phone_number, captcha } = req.body;

  // basic validation
  if (!first_name || !last_name || !email || !password || !confirm_password || !phone_number || !captcha) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (password !== confirm_password) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO aviyamagnus1 
      (first_name, last_name, email, password, confirm_password, phone_number, captcha)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [first_name, last_name, email, password, confirm_password, phone_number, captcha]
    );

    res.json({ message: "User registered successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// --- Optional: Get all users ---
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM aviyamagnus1");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
