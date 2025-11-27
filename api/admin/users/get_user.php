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
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$admin = verifyToken();

$id = intval($_GET['id'] ?? 0);

if (!$id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing user id']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, username, email, full_name, role, status, department, phone, avatar_url, created_at, updated_at FROM admins WHERE id = :id");
$stmt->execute([':id' => $id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'User not found']);
    exit;
}

echo json_encode(['success' => true, 'data' => $user]);
