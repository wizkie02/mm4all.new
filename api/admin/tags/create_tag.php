<?php
require_once __DIR__ . '/../auth/verify_token.php';
require_once __DIR__ . '/../../utils/db.php';

// CORS …
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

$name = $input['name'] ?? '';
$slug = $input['slug'] ?? '';
$description = $input['description'] ?? '';
$color = $input['color'] ?? '';

if (!$name || !$slug) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name and slug are required']);
    exit;
}

$stmt = $pdo->prepare("
    INSERT INTO tags (name, slug, description, color, created_at, updated_at) 
    VALUES (:name, :slug, :description, :color, NOW(), NOW())
");

$stmt->execute([
    ':name' => $name,
    ':slug' => $slug,
    ':description' => $description,
    ':color' => $color
]);

echo json_encode(['success' => true, 'message' => 'Tag created']);
