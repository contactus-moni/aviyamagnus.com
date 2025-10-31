import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://contactus.aviyamagnus.com", // your real frontend
  })
);

// ✅ simple check route
app.get("/", (req, res) => {
  res.send("Backend is running fine ✅");
});

// ✅ show message for GET /register
app.get("/register", (req, res) => {
  res.send("Use POST /register instead");
});

// ✅ actual POST API
app.post("/register", (req, res) => {
  const { name, email, message } = req.body;
  console.log("Received:", name, email, message);
  res.json({ status: "success", message: "Registered OK" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port", port));

app.post('/register', (req, res) => {
  // handle registration
  res.json({ message: 'User registered successfully!' });
});

