<?php
require_once __DIR__ . '/../auth/verify_token.php';
require_once __DIR__ . '/../../utils/db.php';

// CORS
error_reporting(E_ALL);
ini_set('display_errors', 1);
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('#^http://localhost:\d+$#', $origin) || $origin === 'https://mm4all.com') {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$admin = verifyToken();

$input = json_decode(file_get_contents('php://input'), true);

$username = $input['username'] ?? '';
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';
$fullName = $input['full_name'] ?? '';
$role = $input['role'] ?? 'editor';

if (!$username || !$email || !$password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("INSERT INTO admins (username, email, password_hash, full_name, role, status, created_at, created_by) VALUES (:username, :email, :hash, :full_name, :role, 'active', NOW(), :created_by)");

$stmt->execute([
    ':username' => $username,
    ':email' => $email,
    ':hash' => $hash,
    ':full_name' => $fullName,
    ':role' => $role,
    ':created_by' => $admin['id']
]);

echo json_encode(['success' => true, 'message' => 'User created']);
