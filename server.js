// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // Example simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ status: "error", message: "All fields required" });
  }

  // Your database insert logic here...
  return res.json({ status: "success", message: "User registered successfully" });
});

app.get("/", (req, res) => {
  res.send("Backend is running successfully ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
