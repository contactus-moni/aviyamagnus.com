// server.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// ✅ Allow your frontend domain
app.use(
  cors({
    origin: "https://contactus.aviyamagnus.com", // frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example register route
app.post("/register", (req, res) => {
  console.log("Register request received:", req.body);
  // your signup logic here
  res.json({ status: "success", message: "Registration successful!" });
});

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

// ✅ Render requires dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
