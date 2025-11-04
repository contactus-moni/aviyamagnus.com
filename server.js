import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Render PostgreSQL connection (replace below with your exact values)
const pool = new Pool({
  connectionString: "postgres://<username>:<password>@dpg-xxxxx.singapore-postgres.render.com:5432/<dbname>",
  ssl: { rejectUnauthorized: false }
});

// ✅ Test route to verify DB connection
app.get("/testdb", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    console.error("DB test error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Basic route for root (optional)
app.get("/", (req, res) => {
  res.send("Backend is live and working ✅");
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
