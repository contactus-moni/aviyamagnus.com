<?php
// Include database config
include('config.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Aviya Magnus</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #000; /* black theme */
            color: #fff;
            text-align: center;
            padding-top: 50px;
        }
        h1 {
            color: #ffcc00;
        }
    </style>
</head>
<body>
    <h1>Welcome to Aviya Magnus</h1>
    <p>Database connected successfully.</p>

    <?php
    // Example query to test DB connection
    $sql = "SELECT * FROM courses"; // Make sure table 'courses' exists
    $result = $conn->query($sql);

    if ($result) {
        echo "<h2>Courses:</h2><ul>";
        while($row = $result->fetch_assoc()) {
            echo "<li>" . htmlspecialchars($row['course_name']) . "</li>";
        }
        echo "</ul>";
    } else {
        echo "Error fetching courses: " . $conn->error;
    }

    $conn->close();
    ?>
</body>
</html>
