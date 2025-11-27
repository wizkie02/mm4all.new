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

$id = intval($_GET['id'] ?? 0);
$input = json_decode(file_get_contents('php://input'), true);

if (!$id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing post id']);
    exit;
}

$stmt = $pdo->prepare("
    UPDATE posts SET 
        title = :title,
        slug = :slug,
        content = :content,
        excerpt = :excerpt,
        featured_image_url = :featured_image_url,
        meta_title = :meta_title,
        meta_description = :meta_description,
        category_id = :category_id,
        status = :status,
        content_type = :content_type,
        difficulty_level = :difficulty_level,
        updated_at = NOW()
    WHERE id = :id
");

$stmt->execute([
    ':title' => $input['title'] ?? '',
    ':slug' => $input['slug'] ?? '',
    ':content' => $input['content'] ?? '',
    ':excerpt' => $input['excerpt'] ?? '',
    ':featured_image_url' => $input['featured_image_url'] ?? '',
    ':meta_title' => $input['meta_title'] ?? '',
    ':meta_description' => $input['meta_description'] ?? '',
    ':category_id' => $input['category_id'] ?? null,
    ':status' => $input['status'] ?? 'draft',
    ':content_type' => $input['content_type'] ?? 'article',
    ':difficulty_level' => $input['difficulty_level'] ?? null,
    ':id' => $id
]);

echo json_encode(['success' => true, 'message' => 'Post updated']);
