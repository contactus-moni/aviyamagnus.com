import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pkg from "pg"; // for PostgreSQL
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- PostgreSQL Connection ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://aviyamagnus:k6zXVR1otvtVRJzgRXKM07O1cKQPz6d1a@dpg-d3rm7q95pdvs73fqI7s0-a.singapore-postgres.render.com/aviyamagnus",
  ssl: { rejectUnauthorized: false }
});


pool.connect()
  .then(() => console.log("✅ Database connected successful"))
  .catch(err => console.error("❌ Database connection error:", err));

// --- Register API ---
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: "error", message: "All fields required" });
    }

    const query = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)";
    await pool.query(query, [name, email, password]);

    res.json({ status: "success", message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// --- Default Route ---
pool.connect()
  .then(() => console.log("✅ Database connected successful"))
  .catch(err => console.error("❌ Database connection error:", err));

