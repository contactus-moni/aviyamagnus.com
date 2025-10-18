<?php
// admin_login.php
session_start();
// If already logged in, go to dashboard
if (isset($_SESSION['admin'])) {
    header("Location: admin_dashboard.php");
    exit;
}
// Optional message via GET
$msg = isset($_GET['msg']) ? htmlspecialchars($_GET['msg']) : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Admin Login - Aviya Magnus</title>
<style>
  body{font-family: Arial; background:#121212; color:#fff; display:flex; align-items:center; justify-content:center; height:100vh;}
  .card{background:#1e1e1e;padding:24px;border-radius:8px;width:360px;box-shadow:0 6px 18px rgba(0,0,0,.6)}
  input{width:100%;padding:10px;margin:8px 0;border-radius:4px;border:1px solid #444;background:#0f0f0f;color:#fff}
  button{width:100%;padding:10px;border-radius:4px;border:0;background:#4CAF50;color:#fff;font-weight:600}
  .note{font-size:13px;color:#bbb;margin-top:8px}
  .error{color:#ff6868;margin-bottom:8px}
</style>
</head>
<body>
  <div class="card">
    <h2 style="margin:0 0 12px 0">Admin Login</h2>
    <?php if($msg): ?><div class="error"><?php echo $msg; ?></div><?php endif; ?>
    <form action="login.php" method="post" autocomplete="off">
      <label for="username">Username / Email</label>
      <input id="username" name="username" type="text" required>
      <label for="password">Password</label>
      <input id="password" name="password" type="password" required>
      <button type="submit" name="login">Sign in</button>
    </form>

    <div class="note">
      If you need to create a new admin account (one-time) use the <strong>Admin Register</strong> page:
      <a href="signin.php" style="color:#82c0ff">Create Admin</a> — remove or protect this file after use.
    </div>
  </div>
</body>
</html>
