<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
include '../config.php';

if (!isset($_SESSION['parent_id'])) {
    header("Location: login.php");
    exit();
}

$parent_id = $_SESSION['parent_id'];

// Fetch parent info
$query = "SELECT name, email FROM parents WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $parent_id);
$stmt->execute();
$stmt->bind_result($name, $email);
$stmt->fetch();
$stmt->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Parent Dashboard</title>
<style>
body { font-family: Arial, sans-serif; background:#222; color:#fff; text-align:center; padding:50px; }
.dashboard { background:#333; padding:30px; border-radius:10px; display:inline-block; margin-bottom:50px; }
a.logout { display:inline-block; margin-top:20px; padding:10px 20px; background:#ff4c4c; color:#fff; text-decoration:none; border-radius:5px; }
a.logout:hover { background:#ff2b2b; }
table { width: 80%; margin: 20px auto; border-collapse: collapse; }
table, th, td { border: 1px solid #555; }
th, td { padding: 10px; text-align: center; }
th { background: #444; }
tr:nth-child(even) { background: #333; }
</style>
</head>
<body>

<div class="dashboard">
    <h2>Welcome, <?php echo htmlspecialchars($name); ?> 👋</h2>
    <p><strong>Email:</strong> <?php echo htmlspecialchars($email); ?></p>
    <p>You are logged in as a Parent.</p>
    <a href="logout.php" class="logout">Logout</a>
    <a href="profile.php" style="color:#4CAF50; text-decoration:none; margin-top:20px; display:inline-block;">Edit Profile</a>
</div>

<?php
// Fetch children linked via enrollments
$children_sql = "
SELECT DISTINCT s.id, s.name 
FROM students s
JOIN enrollments e ON e.student_id = s.id
WHERE e.parent_id = ?
";
$stmt = $conn->prepare($children_sql);
$stmt->bind_param("i", $parent_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    while ($child = $result->fetch_assoc()) {
        echo "<h4>{$child['name']}'s Enrollments</h4>";

        // Fetch the enrollments for this child
        $enrollments_sql = "
        SELECT e.id, c.course_name, e.enrolled_by, e.enrolled_on, e.status
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        WHERE e.student_id = ?
        ";
        $stmt2 = $conn->prepare($enrollments_sql);
        $stmt2->bind_param("i", $child['id']);
        $stmt2->execute();
        $enrollments = $stmt2->get_result();

        if ($enrollments->num_rows > 0) {
            echo '<table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Enrolled By</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>';
            while ($row = $enrollments->fetch_assoc()) {
                echo "<tr>
                        <td>{$row['course_name']}</td>
                        <td>" . ucfirst($row['enrolled_by']) . "</td>
                        <td>" . date('d M Y', strtotime($row['enrolled_on'])) . "</td>
                        <td>" . ucfirst($row['status']) . "</td>
                      </tr>";
            }
            echo '</tbody></table>';
        } else {
            echo "<p>No enrollments found for {$child['name']}.</p>";
        }
        $stmt2->close();
    }
} else {
    echo "<p>No children enrolled under your account yet.</p>";
}

$stmt->close();
?>
</body>
</html>
