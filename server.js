import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Pool } from "pg";

const app = express();

// Allow requests from your frontend domain
app.use(cors({
  origin: "https://contactus.aviyamagnus.com",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(bodyParser.json());

const pool = new Pool({
  user: "postgres",
  host: "postgres.railway.internal", // Render DB host
  database: "railway",
  password: "ZavKvXmHfseabcTxjNGjVLSRCxaXjySB",
  port: 5432,
  ssl: { rejectUnauthorized: false } // important for Railway
});

// Routes
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );
    res.json({ message: "User registered successfully", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
