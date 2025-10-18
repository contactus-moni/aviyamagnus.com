<?php
session_start();
include 'db_connect.php';
if(!isset($_SESSION['admin'])){
    header("Location: admin_login.php");
    exit;
}

if(isset($_GET['delete'])){
    $id = $_GET['delete'];
    $stmt = $conn->prepare("DELETE FROM courses WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    header("Location: view_courses.php");
    exit;
}

$result = $conn->query("SELECT * FROM courses");
?>

<!DOCTYPE html>
<html>
<head>
    <title>View Courses</title>
</head>
<body>
<h2>All Courses</h2>
<table border="1" cellpadding="10">
<tr>
    <th>ID</th>
    <th>Course Name</th>
    <th>Description</th>
    <th>Duration</th>
    <th>Price</th>
    <th>Actions</th>
</tr>
<?php while($row = $result->fetch_assoc()): ?>
<tr>
    <td><?php echo $row['id']; ?></td>
    <td><?php echo $row['course_name']; ?></td>
    <td><?php echo $row['description']; ?></td>
    <td><?php echo $row['duration']; ?></td>
    <td>₹<?php echo $row['price']; ?></td>
    <td>
        <a href="edit_course.php?id=<?php echo $row['id']; ?>">Edit</a> | 
        <a href="view_courses.php?delete=<?php echo $row['id']; ?>" onclick="return confirm('Are you sure?')">Delete</a>
    </td>
</tr>
<?php endwhile; ?>
</table>
<p><a href="admin_dashboard.php">Back to Dashboard</a></p>
</body>
</html>
