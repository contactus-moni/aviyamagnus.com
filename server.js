import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "postgres.railway.internal", // Render DB host
  database: "railway",
  password: "ZavKvXmHfseabcTxjNGjVLSRCxaXjySB",
  port: 5432,
  ssl: { rejectUnauthorized: false } // important for Railway
});

app.get("/", (req, res) => {
  res.send("Backend is running! Use /register or /users routes.");
});


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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
