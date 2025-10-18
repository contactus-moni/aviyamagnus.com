<?php
session_start();
if(!isset($_SESSION['admin'])){
    header("Location: admin_login.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>
</head>
<body>
<h2>Welcome, <?php echo $_SESSION['admin']; ?>!</h2>

<ul>
    <li><a href="add_course.php">Add New Course</a></li>
    <li><a href="view_courses.php">View/Edit/Delete Courses</a></li>
    <li><a href="logout.php">Logout</a></li>
</ul>
</body>
</html>
