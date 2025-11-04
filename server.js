// ===============================
// server.js - Correct Version for MySQL2
// ===============================

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2"); // ✅ use mysql2 instead of mysql
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost", // replace sqlXXX
  user: process.env.DB_USER || "aviyama1_aviyams",
  password: process.env.DB_PASS || "Monicaanandan",
  database: process.env.DB_NAME || "aviyama1_sql",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  } else {
    console.log("✅ Connected to AquaHost MySQL database successfully!");
  }
});

app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
