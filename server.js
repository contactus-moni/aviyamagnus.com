import express from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: [
      "https://contactus.aviyamagnus.com", // live frontend
      "http://localhost:3000",             // React local test
      "http://127.0.0.1:5500"              // plain HTML test
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());
app.use(express.json());

// ✅ Database connection
const pool = new Pool({
  connectionString: "postgresql://postgres:ZavKvXmHfseabcTxjNGjVLSRCxaXjySB@shuttle.proxy.rlwy.net:25707/railway",
  ssl: { rejectUnauthorized: false },
});

// ------------------------------------------------------
// 🧩 Register endpoint
// ------------------------------------------------------
app.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, confirm_password, phone_number, captcha, role } = req.body;

  if (!first_name || !last_name || !email || !password || !confirm_password || !phone_number || !captcha || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (password !== confirm_password) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO aviyamagnus1 
      (first_name, last_name, email, password, confirm_password, phone_number, captcha, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [first_name, last_name, email, password, confirm_password, phone_number, captcha, role]
    );

    res.json({ message: "User registered successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// ------------------------------------------------------
// 🧩 Login endpoint
// ------------------------------------------------------
app.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Email, password, and role are required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM aviyamagnus1 WHERE email = $1 AND role = $2",
      [email, role]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email, password, or role" });
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid email, password, or role" });
    }

    res.json({
      status: "success",
      message: "Login successful",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// ------------------------------------------------------
// 🧩 Get all users (optional)
// ------------------------------------------------------
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM aviyamagnus1");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// ------------------------------------------------------
app.post("/enroll", async (req, res) => {
  try {
    const {
      full_name,
      name,
      email,
      mobile,
      phone,
      address,
      course_id,
      course,
      payment_method,
      payment
    } = req.body;

    // Normalize all possible field variations
    const finalFullName = full_name || name;
    const finalEmail = email;
    const finalMobile = mobile || phone;
    const finalAddress = address || "";
    const finalCourseId = course_id || course;
    const finalPaymentMethod = payment_method || payment;

    // Validate
    if (!finalFullName || !finalEmail || !finalCourseId || !finalPaymentMethod) {
      console.log("❌ Missing fields:", { finalFullName, finalEmail, finalCourseId, finalPaymentMethod });
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if student exists
    const userResult = await pool.query("SELECT id FROM aviyamagnus1 WHERE email = $1", [finalEmail]);
    let student_id;

    if (userResult.rows.length > 0) {
      student_id = userResult.rows[0].id;
    } else {
      const newStudent = await pool.query(
        `INSERT INTO aviyamagnus1 (first_name, email, phone_number, address, role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [finalFullName, finalEmail, finalMobile, finalAddress, "student"]
      );
      student_id = newStudent.rows[0].id;
    }

    // Insert into enrollments (without fee)
    const enrollment = await pool.query(
      `INSERT INTO enrollments (student_id, course_id, payment_method)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [student_id, finalCourseId, finalPaymentMethod]
    );

    res.json({ message: "Enrollment successful ✅", enrollment: enrollment.rows[0] });

  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});
// ------------------------------------------------------
// 🚀 Start Server
// ------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
