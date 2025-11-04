const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔐 Database connection
const pool = new Pool({
  host: "dpg-d3rm7q95pdvs73fql7s0-a.singapore-postgres.render.com",
  port: 5432,
  database: "aviyamagnus",
  user: "aviyamagnus",
  password: "k6zXVRlotvtVRJzgRXKM0Z01CkQPz6dl",
  ssl: { rejectUnauthorized: false }
});

// ✅ Register endpoint
app.post("/register", async (req, res) => {
  try {
    const {
      user_type,
      first_name,
      last_name,
      email,
      password,
      confirm_password,
      country_code,
      phone_number,
      captcha
    } = req.body;

    const result = await pool.query(
      `INSERT INTO users 
      (user_type, first_name, last_name, email, password, confirm_password, country_code, phone_number, captcha) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id`,
      [user_type, first_name, last_name, email, password, confirm_password, country_code, phone_number, captcha]
    );

    res.json({
      status: "success",
      message: "User registered successfully!",
      user_id: result.rows[0].id
    });

  } catch (error) {
    console.error("❌ Error inserting data:", error);
    res.status(500).json({ status: "error", message: "Database insert failed." });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
