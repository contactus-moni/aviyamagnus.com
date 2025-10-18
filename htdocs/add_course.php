<?php
session_start();
include 'db_connect.php';
if(!isset($_SESSION['admin'])){
    header("Location: admin_login.php");
    exit;
}

$message = "";
if(isset($_POST['add'])) {
    $name = $_POST['course_name'];
    $desc = $_POST['description'];
    $duration = $_POST['duration'];
    $price = $_POST['price'];

    $stmt = $conn->prepare("INSERT INTO courses (course_name, description, duration, price) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssd", $name, $desc, $duration, $price);
    if($stmt->execute()){
        $message = "Course added successfully!";
    } else {
        $message = "Error adding course!";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Add New Course</title>
</head>
<body>
<h2>Add New Course</h2>
<?php if($message != "") echo "<p>$message</p>"; ?>
<form method="post">
    Course Name: <input type="text" name="course_name" required><br><br>
    Description: <textarea name="description" required></textarea><br><br>
    Duration: <input type="text" name="duration" required><br><br>
    Price: <input type="number" step="0.01" name="price" required><br><br>
    <button type="submit" name="add">Add Course</button>
</form>
<p><a href="admin_dashboard.php">Back to Dashboard</a></p>
</body>
</html>
