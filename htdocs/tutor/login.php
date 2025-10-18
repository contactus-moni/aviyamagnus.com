<?php
session_start();
include '../config.php';

$message = "";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM tutors WHERE email='$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['password'])) {
            $_SESSION['tutor_id'] = $row['id'];
            $_SESSION['tutor_name'] = $row['name'];
            header("Location: dashboard.php");
            exit();
        } else {
            $message = "❌ Incorrect password!";
        }
    } else {
        $message = "❌ Email not found!";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Tutor Login</title>
<style>
body { font-family: Arial; background:#222; color:#fff; text-align:center; padding-top:50px; }
form { background:#333; padding:20px; border-radius:10px; display:inline-block; }
input { margin:10px; padding:10px; width:200px; border-radius:5px; border:none; }
button { padding:10px 20px; border:none; border-radius:5px; background:#4CAF50; color:#fff; cursor:pointer; }
button:hover { background:#45a049; }
.message { color:#ff4c4c; margin-bottom:10px; }
</style>
</head>
<body>

<h2>Tutor Login</h2>
<?php if($message != "") echo "<div class='message'>$message</div>"; ?>
<form method="POST">
<input type="email" name="email" placeholder="Email" required><br>
<input type="password" name="password" placeholder="Password" required><br>
<button type="submit">Login</button>
</form>

</body>
</html>
