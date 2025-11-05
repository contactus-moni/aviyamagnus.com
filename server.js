import express from "express";
import pg from "pg";
import cors from "cors";

const { Pool } = pg;
const app = express();

app.use(cors());
app.use(express.json());

// ✅ PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://aviyamagnus:k6zXVRlotvtVRJzgRXKM0Z01CkQPz6dl@dpg-d3rm7q95pdvs73fqI7s0-a.singapore-postgres.render.com/aviyamagnus",
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

// ✅ Check database connection
pool.connect()
  .then(() => console.log("✅ Database connected successfully"))
  .catch(err => console.error("❌ Database connection error:", err.message));

// ✅ Home route
app.get("/", (req, res) => {
  res.send("✅ Server is running and database connected!");
});

// ✅ Register route (POST)
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );
    res.json({ status: "success", user: result.rows[0] });
  } catch (error) {
    console.error("Error during register:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ✅ Fallback for undefined routes
app.use((req, res) => {
  res.status(404).send("Route not found");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
