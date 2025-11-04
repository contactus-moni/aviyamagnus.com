// ===============================
// server.js - Final Working Version
// ===============================

// Import required packages
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
require("dotenv").config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// -----------------------------------------
// ✅ DATABASE CONNECTION (AquaHost MySQL)
// -----------------------------------------
const db = mysql.createConnection({
  host: process.env.DB_HOST || "sqlXXX.aquahost.net", // Replace with your actual host name from AquaHost
  user: process.env.DB_USER || "aviyama1_aviyams",
  password: process.env.DB_PASS || "YOUR_MYSQL_PASSWORD_HERE",
  database: process.env.DB_NAME || "aviyama1_sql",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // Stop app if DB connection fails
  } else {
    console.log("✅ Connected to AquaHost MySQL database successfully!");
  }
});

// -----------------------------------------
// ✅ SAMPLE API ROUTES
// -----------------------------------------

// Root route
app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

// Example route - Fetch all users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Database query error" });
    } else {
      res.json(results);
    }
  });
});

// Example route - Insert user
app.post("/add-user", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Missing fields" });

  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.query(sql, [name, email], (err, result) => {
    if (err) {
      console.error("Error inserting user:", err);
      res.status(500).json({ error: "Insert failed" });
    } else {
      res.json({ message: "User added successfully!", id: result.insertId });
    }
  });
});

// -----------------------------------------
// ✅ START SERVER
// -----------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
