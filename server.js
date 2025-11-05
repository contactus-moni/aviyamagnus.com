import express from "express";
import pg from "pg";
import cors from "cors";

const { Pool } = pg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://aviyamagnus:k6zXVR1otvtVRJzgRXKM07O1cKQPz6d1a@dpg-d3rm7q95pdvs73fqI7s0-a.singapore-postgres.render.com/aviyamagnus",
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log("✅ Database connected successful"))
  .catch(err => console.error("❌ Database connection error:", err));

app.get("/", (req, res) => {
  res.send("✅ Server is running and database is connected!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
