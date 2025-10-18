<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
include '../config.php';

// Redirect if not logged in
if (!isset($_SESSION['parent_id'])) {
    header("Location: login.php");
    exit();
}

$parent_id = $_SESSION['parent_id'];
$message = "";

// Fetch current info
$query = "SELECT name, email, profile_pic FROM parents WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $parent_id);
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
        $file_name = $parent_id . "_" . basename($_FILES['profile_pic']['name']);
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
    $update_sql = "UPDATE parents SET name='$new_name', email='$new_email' $password_sql $profile_pic_sql WHERE id=$parent_id";
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
<title>parent Profile</title>
<style>
body { font-family: Arial; background:#222; color:#fff; text-align:center; padding-top:50px; }
form { background:#333; padding:20px; border-radius:10px; display:inline-block; text-align:left; }
input { margin:10px 0; padding:10px; width:100%; border-radius:5px; border:none; }
button { padding:10px 20px; border:none; border-radius:5px; background:#4CAF50; color:#fff; cursor:pointer; }
button:hover { background:#45a049; }
.message { color:#ff4c4c; margin-bottom:10px; text-align:center; }
img.profile { width:100px; height:100px; border-radius:50%; margin-bottom:10px; object-fit:cover; }
</style>
</head>
<body>

<h2>parent Profile</h2>
<?php if($message != "") echo "<div class='message'>$message</div>"; ?>
<form method="POST" enctype="multipart/form-data">
    <?php if(!empty($profile_pic)) echo "<img src='$profile_pic' class='profile'><br>"; ?>
    <label>Name:</label><br>
    <input type="text" name="name" value="<?php echo htmlspecialchars($name); ?>" required><br>
    <label>Email:</label><br>
    <input type="email" name="email" value="<?php echo htmlspecialchars($email); ?>" required><br>
    <label>Change Password (leave blank to keep current):</label><br>
    <input type="password" name="password" placeholder="New Password"><br>
    <label>Profile Picture (optional):</label><br>
    <input type="file" name="profile_pic" accept="image/*"><br>
    <button type="submit">Update Profile</button>
</form>

</body>
</html>
