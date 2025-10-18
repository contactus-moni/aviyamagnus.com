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

$student_id = $_SESSION['student_id'];
$message = "";

// Fetch current info
$query = "SELECT name, email, profile_pic FROM students WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $student_id);
$stmt->execute();
$stmt->bind_result($name, $email, $profile_pic);
$stmt->fetch();
$stmt->close();

// Update profile on form submit
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $new_name = $_POST['name'];
    $new_email = $_POST['email'];

    // Password update (optional)
    if (!empty($_POST['password'])) {
        $new_password = password_hash($_POST['password'], PASSWORD_DEFAULT);
        $password_sql = ", password='$new_password'";
    } else {
        $password_sql = "";
    }

    // Profile picture upload (optional)
    if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['size'] > 0) {
        $target_dir = "uploads/";
        if (!file_exists($target_dir)) { mkdir($target_dir, 0755, true); }
        $file_name = $student_id . "_" . basename($_FILES['profile_pic']['name']);
        $target_file = $target_dir . $file_name;

        if (move_uploaded_file($_FILES['profile_pic']['tmp_name'], $target_file)) {
            $profile_pic_sql = ", profile_pic='$target_file'";
        } else {
            $profile_pic_sql = "";
            $message = "❌ Failed to upload profile picture.";
        }
    } else {
        $profile_pic_sql = "";
    }

    // Update query
    $update_sql = "UPDATE students SET name='$new_name', email='$new_email' $password_sql $profile_pic_sql WHERE id=$student_id";
    if ($conn->query($update_sql)) {
        $message = "✅ Profile updated successfully.";
    } else {
        $message = "❌ Error updating profile: " . $conn->error;
    }

    // Refresh variables
    $name = $new_name;
    $email = $new_email;
    if (isset($file_name)) $profile_pic = $target_file;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Student Profile</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif;
    }

    body {
        background: linear-gradient(135deg, #000000, #1a1a1a);
        color: #ffffff;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
    }

    h2 {
        font-size: 28px;
        margin-bottom: 25px;
        color: #00bcd4;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    form {
        background: rgba(30, 30, 30, 0.95);
        padding: 30px 40px;
        border-radius: 15px;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 0 15px rgba(0, 188, 212, 0.3);
        display: flex;
        flex-direction: column;
        gap: 15px;
        animation: fadeIn 0.8s ease;
    }

    label {
        font-weight: 500;
        color: #ccc;
        font-size: 14px;
    }

    input[type="text"],
    input[type="email"],
    input[type="password"],
    input[type="file"] {
        padding: 10px 15px;
        border-radius: 8px;
        border: 1px solid #444;
        background: #111;
        color: #fff;
        outline: none;
        transition: border 0.3s ease, background 0.3s ease;
    }

    input:focus {
        border: 1px solid #00bcd4;
        background: #1a1a1a;
    }

    button {
        padding: 12px;
        border: none;
        border-radius: 8px;
        background: linear-gradient(90deg, #00bcd4, #0097a7);
        color: #fff;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s ease, transform 0.2s ease;
    }

    button:hover {
        background: linear-gradient(90deg, #0097a7, #00bcd4);
        transform: scale(1.02);
    }

    .message {
        margin-bottom: 15px;
        text-align: center;
        font-weight: 500;
        color: #ff5252;
    }

    img.profile {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin: 0 auto 15px;
        object-fit: cover;
        display: block;
        border: 3px solid #00bcd4;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>
</head>
<body>

    <h2>Student Profile</h2>

    <?php if($message != "") echo "<div class='message'>$message</div>"; ?>

    <form method="POST" enctype="multipart/form-data">
        <?php if(!empty($profile_pic)) echo "<img src='$profile_pic' class='profile'>"; ?>

        <label>Name:</label>
        <input type="text" name="name" value="<?php echo htmlspecialchars($name); ?>" required>

        <label>Email:</label>
        <input type="email" name="email" value="<?php echo htmlspecialchars($email); ?>" required>

        <label>Change Password (optional):</label>
        <input type="password" name="password" placeholder="New Password">

        <label>Profile Picture (optional):</label>
        <input type="file" name="profile_pic" accept="image/*">

        <button type="submit">Update Profile</button>
    </form>

</body>
</html>
