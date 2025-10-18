<?php
// signin.php - one-time admin register (recommended remove after use)
session_start();
require_once 'db_connect.php';

// Simple protection: a secret code to allow registration.
// Change this value BEFORE using and share only with yourself.
$REG_SECRET = 'create_admin_now_2025';

$message = '';
if (isset($_POST['create'])) {
    $secret = $_POST['secret'] ?? '';
    if ($secret !== $REG_SECRET) {
        $message = "Invalid registration secret.";
    } else {
        $username = trim($_POST['username']);
        $password = $_POST['password'];
        if ($username === '' || $password === '') {
            $message = "Provide username and password.";
        } else {
            // Hash the password for security (recommended)
            $hash = password_hash($password, PASSWORD_DEFAULT);

            // Insert (use prepared)
            $stmt = $conn->prepare("INSERT INTO admin (username, password) VALUES (?, ?)");
            $stmt->bind_param("ss", $username, $hash);
            if ($stmt->execute()) {
                $message = "Admin created successfully. You can now login.";
            } else {
                $message = "Error creating admin: " . $conn->error;
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Create Admin</title>
<style>
  body{font-family:Arial;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh}
  .box{background:#1e1e1e;padding:20px;border-radius:8px;width:420px}
  input{width:100%;padding:10px;margin:8px 0;border-radius:4px;border:1px solid #444;background:#0f0f0f;color:#fff}
  button{padding:10px 14px;border-radius:4px;border:0;background:#3b82f6;color:#fff}
  .msg{color:#ffd; margin-bottom:8px}
</style>
</head>
<body>
  <div class="box">
    <h2>Create Admin Account</h2>
    <?php if ($message) echo "<div class='msg'>" . htmlspecialchars($message) . "</div>"; ?>
    <form method="post" autocomplete="off">
      <label>Registration Secret (ask yourself):</label>
      <input name="secret" type="text" required placeholder="Enter secret code">
      <label>Username / Email</label>
      <input name="username" type="text" required placeholder="admin@example.com">
      <label>Password</label>
      <input name="password" type="password" required placeholder="Strong password">
      <div style="margin-top:10px">
        <button name="create" type="submit">Create Admin</button>
      </div>
    </form>

    <p style="margin-top:12px;font-size:13px;color:#bbb">
      After creating, delete or protect this file. You can then login at
      <a href="admin_login.php" style="color:#82c0ff">Admin Login</a>.
    </p>
  </div>
</body>
</html>
