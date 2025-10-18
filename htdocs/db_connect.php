<?php
// Database connection settings for phpMyAdmin (using shared hosting like InfinityFree)
$servername = "sql100.epizy.com";  // Replace with the actual host from your phpMyAdmin panel
$username = "aviyamagnus_suer";    // Replace with your actual MySQL username
$password = "Monicaanandan";    // Replace with your actual MySQL password
$dbname = "aviyamagnus_db";        // Replace with your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    // If connection fails, show error message and stop script
    die("Connection failed: " . $conn->connect_error);
}
// Optional debugging: Uncomment below to test connection
// echo "Database connected successfully!";
?>
