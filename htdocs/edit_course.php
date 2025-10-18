<?php
session_start();
include 'db_connect.php';
if(!isset($_SESSION['admin'])){
    header("Location: admin_login.php");
    exit;
}

$id = $_GET['id'];
$stmt = $conn->prepare("SELECT * FROM courses WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$course = $result->fetch_assoc();

$message = "";
if(isset($_POST['update'])){
    $name = $_POST['course_name'];
    $desc = $_POST['description'];
    $duration = $_POST['duration'];
    $price = $_POST['price'];

    $stmt = $conn->prepare("UPDATE courses SET course_name=?, description=?, duration=?, price=? WHERE id=?");
    $stmt->bind_param("sssdi", $name, $desc, $duration, $price, $id);
    if($stmt->execute()){
        $message = "Course updated successfully!";
    } else {
        $message = "Error updating course!";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Edit Course</title>
</head>
<body>
<h2>Edit Course</h2>
<?php if($message != "") echo "<p>$message</p>"; ?>
<form method="post">
    Course Name: <input type="text" name="course_name" value="<?php echo $course['course_name']; ?>" required><br><br>
    Description: <textarea name="description" required><?php echo $course['description']; ?></textarea><br><br>
    Duration: <input type="text" name="duration" value="<?php echo $course['duration']; ?>" required><br><br>
    Price: <input type="number" step="0.01" name="price" value="<?php echo $course['price']; ?>" required><br><br>
    <button type="submit" name="update">Update Course</button>
</form>
<p><a href="view_courses.php">Back to Courses</a></p>
</body>
</html>
