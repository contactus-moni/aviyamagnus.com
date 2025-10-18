<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
include '../config.php';

if (!isset($_SESSION['tutor_id'])) {
    header("Location: login.php");
    exit();
}

$tutor_id = $_SESSION['tutor_id'];
$query = "SELECT name, email FROM tutors WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $tutor_id);
$stmt->execute();
$stmt->bind_result($name, $email);
$stmt->fetch();
$stmt->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Tutor Dashboard</title>
<style>
body { font-family: Arial; background:#222; color:#fff; text-align:center; padding:50px; }
.dashboard { background:#333; padding:30px; border-radius:10px; display:inline-block; }
a.logout { display:inline-block; margin-top:20px; padding:10px 20px; background:#ff4c4c; color:#fff; text-decoration:none; border-radius:5px; }
a.logout:hover { background:#ff2b2b; }
</style>
</head>
<body>

<div class="dashboard">
<h2>Welcome, <?php echo htmlspecialchars($name); ?> 👋</h2>
<p><strong>Email:</strong> <?php echo htmlspecialchars($email); ?></p>
<p>You are logged in as a Tutor.</p>
<a href="logout.php" class="logout">Logout</a>
<a href="profile.php" style="color:#4CAF50; text-decoration:none; margin-top:20px; display:inline-block;">Edit Profile</a>
</div>

</body>
</html>
