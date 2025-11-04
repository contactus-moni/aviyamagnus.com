import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// --- PostgreSQL Connection ---
const pool = new Pool({
  user: "aviyamagnus",
  host: "dpg-d3rm7q95pdvs73fqI7s0-a",
  database: "aviyamagnus",
  password: "k6zXVR1otvtVRJzgRXKM0Z01CkQPz6d1",
  port: 5432, // ✅ keep this line inside the object
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

// --- Test Route ---
app.get("/testdb", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    console.error("Database Error:", err.message);
    res.json({ success: false, error: err.message });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
