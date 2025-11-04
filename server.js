import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from "mysql2";

const app = express();

// ✅ Allow frontend
app.use(
  cors({
    origin: "https://contactus.aviyamagnus.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to MySQL database
const db = mysql.createConnection({
  host: "localhost",        // e.g. sql123.epizy.com
  user: "aviyama1_aviyams",    // e.g. epiz_12345678
  password: "Monicaanandan",
  database: "aviyama1_sql",    // e.g. epiz_12345678_mydb
});

// ✅ Check DB connection
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database!");
  }
});

// Example register route
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(query, [name, email, password], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ status: "error", message: "Database error" });
    } else {
      res.json({ status: "success", message: "Registration successful!" });
    }
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("Backend and MySQL connected successfully!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
