<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

echo json_encode([
  "method" => $_SERVER['REQUEST_METHOD'],
  "post"   => $_POST,
  "raw"    => file_get_contents("php://input")
]);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method Not Allowed"]);
    exit;
}

$servername = "dpg-d3rm7q95pdvs73fql7s0-a"; 
$username = "aviyamagnus1"; 
$password = "k6zXVRlotvtVRJzgRXKM0Z01CkQPz6dl"; 
$dbname = "aviyamagnus";


$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database failed"]);
    exit;
}

// Detect JSON or form data
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

if (!$data) {
    $data = $_POST;
}

$name = $conn->real_escape_string($data['name'] ?? '');
$email = $conn->real_escape_string($data['email'] ?? '');
$password = $conn->real_escape_string($data['password'] ?? '');

if (empty($name) || empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Missing fields"]);
    exit;
}

// Insert into users table
$sql = "INSERT INTO users (name, email, password) VALUES ('$name', '$email', '$password')";
if ($conn->query($sql)) {
    echo json_encode(["status" => "success", "message" => "User registered successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}
$conn->close();
?>
