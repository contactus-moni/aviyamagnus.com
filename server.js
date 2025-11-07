import express from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();
app.use(cors()); // allow all origins, can restrict later
app.use(express.json());

// ✅ Replace with your Railway database details
const pool = new Pool({
  connectionString: "postgresql://postgres:ZavKvXmHfseabcTxjNGjVLSRCxaXjySB@shuttle.proxy.rlwy.net:25707/railway",
  ssl: { rejectUnauthorized: false } // bypass SSL certificate check
});

// --- Register endpoint ---
app.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, confirm_password, phone_number, captcha, role } = req.body;

  // basic validation
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

// --- POST /login ---
app.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  // Basic validation
  if (!email || !password || !role) {
    return res.status(400).json({ error: "Email, password, and role are required" });
  }

  try {
    // Check if the user exists with the specified role
    const result = await pool.query(
      "SELECT * FROM aviyamagnus1 WHERE email = $1 AND role = $2",
      [email, role]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email, password, or role" });
    }

    const user = result.rows[0];

    // Compare passwords (plain text example, use bcrypt for production)
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid email, password, or role" });
    }

    // User exists and password matches
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

// --- Optional: Get all users ---
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM aviyamagnus1");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// -------------------- Enroll a Student --------------------
app.post("/api/enrollments", async (req, res) => {
  const { full_name, email, mobile, address, course_id, payment_method } = req.body;

  if (!full_name || !email || !course_id || !payment_method) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 1️⃣ Check if student already exists
    let student = await pool.query("SELECT * FROM students WHERE email = $1", [email]);

    let student_id;
    if (student.rows.length === 0) {
      // Insert new student
      const newStudent = await pool.query(
        `INSERT INTO students (full_name, email, mobile, address)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [full_name, email, mobile, address]
      );
      student_id = newStudent.rows[0].id;
    } else {
      student_id = student.rows[0].id;
    }

    // 2️⃣ Fetch course fee
    const course = await pool.query("SELECT fee FROM courses WHERE id = $1", [course_id]);
    const registration_fee = course.rows[0]?.fee || 0;

    // 3️⃣ Insert enrollment
    const enrollment = await pool.query(
      `INSERT INTO enrollments (student_id, course_id, payment_method, registration_fee)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [student_id, course_id, payment_method, registration_fee]
    );

    res.json({ message: "Enrollment successful", enrollment: enrollment.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------- Get all enrollments (optional) --------------------
app.get("/api/enrollments", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.id, s.full_name, s.email, c.title AS course, e.payment_method, e.registration_fee, e.status
       FROM enrollments e
       JOIN students s ON e.student_id = s.id
       JOIN courses c ON e.course_id = c.id
       ORDER BY e.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Fix CORS to allow your frontend domain
app.use(
  cors({
    origin: [
      "https://contactus.aviyamagnus.com", // your frontend live domain
      "http://localhost:3000",             // for local testing
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Example route
app.post("/api/enroll", async (req, res) => {
  try {
    // your DB logic here
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

