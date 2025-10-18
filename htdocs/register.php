<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include database connection
include_once('db_connection.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Your registration code here
} else {
    echo json_encode(['message' => 'Invalid request method.']);
}
?>
error_reporting(E_ALL);
ini_set('display_errors', 1);
<?php
// Include the database connection
include_once('db_connection.php');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Get form inputs
    $email = $_POST['email'];
    $password = $_POST['password'];
    $role = $_POST['role'];  // For student, tutor, or parent

    // Validate inputs (you can expand this validation if needed)
    if (empty($email) || empty($password) || empty($role)) {
        echo json_encode(['message' => 'All fields are required.']);
        exit();
    }

    // Hash the password before saving it to the database
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Prepare SQL query to insert the user into the database
    $sql = "INSERT INTO users (email, password, role) VALUES ('$email', '$hashedPassword', '$role')";

    // Execute the query
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['message' => 'Registration successful!']);
    } else {
        echo json_encode(['message' => 'Error: ' . $conn->error]);
    }
} else {
    // If not a POST request, show an error message
    echo json_encode(['message' => 'Invalid request method.']);
}
?>
