// server.js

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

// ✅ Allow your frontend domain
app.use(
  cors({
    origin: "https://contactus.aviyamagnus.com", // your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example route
app.post("/register", (req, res) => {
  console.log("Register request received:", req.body);
  res.json({ status: "success", message: "Registration successful!" });
});

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

// ✅ Render dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
