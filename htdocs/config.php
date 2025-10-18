<?php
// Display all errors for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database configuration
$host = "sql107.infinityfree.com";        // Usually localhost
$db_user = "if0_40179971";   // Replace with your DB username
$db_pass = "Monicaanandan";      // Your DB password
$db_name = "if0_40179971_aviyamagnus";       // Replace with your database name

// Create connection
$conn = new mysqli($host, $db_user, $db_pass, $db_name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
// Optional: echo "Database connected successfully"; // Uncomment for testing
?>
