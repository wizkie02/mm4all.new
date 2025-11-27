<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Dynamic CORS (same as verify_token.php)
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

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Get refresh token from request body
$input = json_decode(file_get_contents('php://input'), true);
$refreshToken = $input['refresh_token'] ?? '';

if (!$refreshToken) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing refresh token']);
    exit;
}

try {
    $secretKey = getenv('JWT_SECRET') ?: 'your_super_secret';

    // Decode refresh token
    $decoded = JWT::decode($refreshToken, new Key($secretKey, 'HS256'));
    $userId = $decoded->data->id;

    // Get user data from database to ensure user still exists and is active
    $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE id = ? AND is_active = 1");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'User not found or inactive']);
        exit;
    }

    // Create new access token
    $issuedAt = time();
    $accessExpiresAt = $issuedAt + 3600; // 1 hour
    $refreshExpiresAt = $issuedAt + 3600 * 24 * 30; // 30 days

    $accessPayload = [
        'iat' => $issuedAt,
        'exp' => $accessExpiresAt,
        'data' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'full_name' => $user['full_name']
        ]
    ];

    $refreshPayload = [
        'iat' => $issuedAt,
        'exp' => $refreshExpiresAt,
        'data' => [
            'id' => $user['id']
        ]
    ];

    $newAccessToken = JWT::encode($accessPayload, $secretKey, 'HS256');
    $newRefreshToken = JWT::encode($refreshPayload, $secretKey, 'HS256');

    echo json_encode([
        'success' => true,
        'access_token' => $newAccessToken,
        'refresh_token' => $newRefreshToken,
        'access_expires_in' => 3600,
        'refresh_expires_in' => 3600 * 24 * 30,
        'admin' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'username' => $user['username'],
            'full_name' => $user['full_name'],
            'role' => $user['role'],
            'avatar_url' => $user['avatar_url'],
            'last_login' => $user['last_login'],
            'created_at' => $user['created_at']
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}
