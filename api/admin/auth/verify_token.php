<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Dynamic CORS
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

require_once __DIR__ . '/../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;

function verifyToken()
{
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Missing or invalid Authorization header']);
        exit;
    }

    $token = substr($authHeader, 7);

    try {
        $secretKey = getenv('JWT_SECRET') ?: 'your_super_secret';
        $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));

        return (array)$decoded->data;

    } catch (Exception $e) {
        // Check if it's an expired token error
        if (strpos($e->getMessage(), 'Expired token') !== false) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Token expired']);
            exit;
        }

        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid token', 'details' => $e->getMessage()]);
        exit;
    }
}

// Check if this is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $adminData = verifyToken();
    
    // If we get here, token is valid
    echo json_encode([
        'success' => true,
        'admin' => $adminData,
        'message' => 'Token is valid'
    ]);
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
?>