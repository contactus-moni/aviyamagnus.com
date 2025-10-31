// server.js or index.js
import express from "express";
const app = express();
app.use(express.json());

// allow your frontend
import cors from "cors";
app.use(cors({ origin: "https://contactus.aviyamagnus.com" }));

app.post("/register", (req, res) => {
  const { name, email, message } = req.body;
  // Save to DB or do whatever
  res.json({ status: "success", message: "Registered OK" });
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Server running")
);
