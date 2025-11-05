import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pkg from "pg";
const { Pool } = pkg;

const app = express();

// Allow requests from your frontend domain
app.use(cors({
  origin: "https://contactus.aviyamagnus.com", // Replace with your frontend domain
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


// POST /register route
app.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, confirm_password, phone_number, captcha } = req.body;
  
  // Optional: validate password match here
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
    console.error("Register Error:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// GET /users route to see all users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM aviyamagnus1");
    res.json(result.rows);
  } catch (err) {
    console.error("Users Error:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
