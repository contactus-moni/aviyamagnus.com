import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json()); // replaces bodyParser.json()

// ✅ PostgreSQL connection
const pool = new Pool({
  user: "postgres", // your DB user
  host: "localhost",
  database: "postgres", // your DB name
  password: "Monicaanandan", // replace with actual password
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL database successfully"))
  .catch(err => console.error("❌ Database connection failed:", err));

// ✅ Register endpoint
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: "error", message: "Missing required fields" });
    }

    // Insert into table
    const result = await pool.query(
      `INSERT INTO users (username, email, password, created_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       RETURNING id`,
      [name, email, password]
    );

    console.log("✅ User registered with ID:", result.rows[0].id);
    res.json({ status: "success", message: "User registered successfully" });

  } catch (err) {
    console.error("❌ Error inserting user:", err);
    res.status(500).json({ status: "error", message: "Database error" });
  }
});

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("Backend running successfully ✅");
});

// ✅ Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
