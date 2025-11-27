<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('#^http://localhost:\d+$#', $origin) || $origin === 'https://mm4all.com') {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// DB & JWT
require_once __DIR__ . '/../utils/db.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Lấy input
$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['email']) || empty($input['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email & password required']);
    exit;
}

$email = trim($input['email']);
$password = $input['password'];

try {
    // Tìm admin
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE email = :email AND status = 'active'");
    $stmt->execute([':email' => $email]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$admin) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Email not found or inactive']);
    exit;
}

if (!password_verify($password, $admin['password_hash'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => 'Wrong password',
        'debug' => [
            'input_password' => $password,
            'db_hash' => $admin['password_hash']
        ]
    ]);
    exit;
}


    // Update last_login
    $pdo->prepare("UPDATE admins SET last_login = NOW() WHERE id = :id")
        ->execute([':id' => $admin['id']]);

    // JWT
    $secretKey = getenv('JWT_SECRET') ?: 'your_super_secret';
    $issuedAt = time();
    $expiresAt = $issuedAt + 3600 * 24; // 1 ngày

    $payload = [
        'iat' => $issuedAt,
        'exp' => $expiresAt,
        'data' => [
            'id' => $admin['id'],
            'email' => $admin['email'],
            'role' => $admin['role'],
            'full_name' => $admin['full_name']
        ]
    ];

    $jwt = JWT::encode($payload, $secretKey, 'HS256');

    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'access_token' => $jwt,
        'expires_in' => 3600 * 24,
        'admin' => [
            'id' => $admin['id'],
            'email' => $admin['email'],
            'full_name' => $admin['full_name'],
            'role' => $admin['role'],
            'avatar_url' => $admin['avatar_url']
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error',
        'details' => $e->getMessage()
    ]);
}
