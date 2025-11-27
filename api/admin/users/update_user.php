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

$id = intval($_GET['id'] ?? 0);
$input = json_decode(file_get_contents('php://input'), true);

if (!$id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing user id']);
    exit;
}

$stmt = $pdo->prepare("UPDATE admins SET full_name = :full_name, email = :email, role = :role, department = :dept, phone = :phone, updated_at = NOW(), updated_by = :updated_by WHERE id = :id");

$stmt->execute([
    ':full_name' => $input['full_name'] ?? '',
    ':email' => $input['email'] ?? '',
    ':role' => $input['role'] ?? 'editor',
    ':dept' => $input['department'] ?? '',
    ':phone' => $input['phone'] ?? '',
    ':updated_by' => $admin['id'],
    ':id' => $id
]);

echo json_encode(['success' => true, 'message' => 'User updated']);
