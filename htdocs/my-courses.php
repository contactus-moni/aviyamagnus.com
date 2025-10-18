<?php
session_start();
include 'db_connect.php';
$user_id = $_SESSION['user_id'];

$sql = "SELECT courses.* FROM courses 
        JOIN enrollments ON courses.id = enrollments.course_id 
        WHERE enrollments.user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
?>
