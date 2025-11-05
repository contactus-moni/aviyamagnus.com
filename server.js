import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "aviyamagnus",
  host: "dpg‑d3rm7q95pdvs73fql7s0‑a.oregion‑postgres.render.com", // Render DB host
  database: "aviyamangus",
  password: "k6zXVRlotvtVRJzgRXKM0Z01CkQPz6dl",
  port: 5432,
  ssl: { rejectUnauthorized: false } // <-- bypass SSL verification
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
