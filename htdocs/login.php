<?php
// login.php
session_start();
require_once 'db_connect.php'; // must define $conn

if (!isset($_POST['login'])) {
    header("Location: admin_login.php");
    exit;
}

$username = trim($_POST['username']);
$password = $_POST['password'];

// Prepared statement to fetch admin by username
$stmt = $conn->prepare("SELECT * FROM admin WHERE username = ? LIMIT 1");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows !== 1) {
    header("Location: admin_login.php?msg=" . urlencode("Username not found."));
    exit;
}

$row = $result->fetch_assoc();
$stored = $row['password'];

// Support both hashed and plain-text stored passwords:
// If stored looks like a bcrypt hash (starts with $2y$ or $2a$), use password_verify
$ok = false;
if (is_string($stored) && (strpos($stored, '$2y$') === 0 || strpos($stored, '$2a$') === 0)) {
    if (password_verify($password, $stored)) $ok = true;
} else {
    // plain text fallback (temporary)
    if ($password === $stored) $ok = true;
}

if ($ok) {
    // Authentication successful
    $_SESSION['admin'] = $row['username'];
    // Optionally store admin id: $_SESSION['admin_id'] = $row['id'];
    header("Location: admin_dashboard.php");
    exit;
} else {
    header("Location: admin_login.php?msg=" . urlencode("Incorrect password."));
    exit;
}
