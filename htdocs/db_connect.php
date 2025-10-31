<?php
// Database connection settings for phpMyAdmin (using shared hosting like InfinityFree)
$servername = "dpg-d3rm7q95pdvs73fql7s0-a"; 
$username = "aviyamagnus1"; 
$password = "k6zXVRlotvtVRJzgRXKM0Z01CkQPz6dl"; 
$dbname = "aviyamagnus";

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
