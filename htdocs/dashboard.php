<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
include '../config.php';

// Redirect if not logged in
if (!isset($_SESSION['student_id'])) {
    header("Location: login.php");
    exit();
}

// Fetch student info
$student_id = $_SESSION['student_id'];
$query = "SELECT name, email FROM students WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $student_id);
$stmt->execute();
$stmt->bind_result($name, $email);
$stmt->fetch();
$stmt->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Student Dashboard | Aviya Magnus</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="../img/favicon.ico" rel="shortcut icon"/>
<link href="https://fonts.googleapis.com/css?family=Raleway:400,500,600,700" rel="stylesheet">
<link rel="stylesheet" href="../css/bootstrap.min.css"/>
<link rel="stylesheet" href="../css/font-awesome.min.css"/>
<link rel="stylesheet" href="../css/style.css"/>
<style>
body { background-color: #0b0b0b; color: #fff; font-family: 'Raleway', sans-serif; text-align: center; padding-top: 80px; }
.dashboard { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 15px; display: inline-block; padding: 40px 50px; box-shadow: 0 0 25px rgba(255,255,255,0.05); transition: all 0.3s ease; }
.dashboard:hover { box-shadow: 0 0 30px rgba(255,255,255,0.15); }
h2 { color: #ffcc00; font-weight: 700; margin-bottom: 15px; letter-spacing: 1px; }
p { color: #ccc; font-size: 16px; margin-bottom: 10px; }
.logout, .profile { display: inline-block; margin-top: 20px; padding: 10px 25px; border-radius: 25px; text-decoration: none; font-weight: 600; letter-spacing: 0.5px; transition: 0.3s; }
.logout { background: #ff4c4c; color: #fff; }
.logout:hover { background: #e63333; }
.profile { background: #ffcc00; color: #000; margin-left: 10px; }
.profile:hover { background: #e6b800; }
h3 { margin-top: 50px; color:#ffcc00; }
table { width: 90%; margin: 20px auto; color:#fff; }
th, td { padding: 12px; text-align: center; border-bottom: 1px solid #444; }
th { color:#ffcc00; }
footer { margin-top: 70px; color: #888; font-size: 14px; letter-spacing: 0.5px; }
</style>
</head>
<body>

<div class="dashboard">
<h2>Welcome, <?php echo htmlspecialchars($name); ?> 👋</h2>
<p><strong>Email:</strong> <?php echo htmlspecialchars($email); ?></p>
<p>You are logged in as a Student.</p>
<a href="logout.php" class="logout">Logout</a>
<a href="profile.php" class="profile">Edit Profile</a>
</div>

<?php
// Fetch student enrollments safely
$student_id = $_SESSION['student_id'];
$enrollments_query = $conn->prepare("
    SELECT e.id, c.course_name, e.enrolled_by, e.enrolled_on, e.status
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.student_id = ?
    ORDER BY e.enrolled_on DESC
");
$enrollments_query->bind_param("i", $student_id);
$enrollments_query->execute();
$enrollments_result = $enrollments_query->get_result();
?>

<h3>My Enrollments</h3>
<table>
<thead>
<tr>
<th>Course Name</th>
<th>Enrolled By</th>
<th>Date</th>
<th>Status</th>
</tr>
</thead>
<tbody>
<?php while($row = $enrollments_result->fetch_assoc()) { ?>
<tr>
<td><?= htmlspecialchars($row['course_name']) ?></td>
<td><?= ucfirst(htmlspecialchars($row['enrolled_by'])) ?></td>
<td><?= date('d M Y', strtotime($row['enrolled_on'])) ?></td>
<td><?= ucfirst(htmlspecialchars($row['status'])) ?></td>
</tr>
<?php } ?>
</tbody>
</table>

<footer>© <?php echo date("Y"); ?> Aviya Magnus. All Rights Reserved.</footer>

</body>
</html>
