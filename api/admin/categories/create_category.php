<?php
require_once __DIR__ . '/../auth/verify_token.php';
require_once __DIR__ . '/../../utils/db.php';

// CORS …
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
$parent_id = $input['parent_id'] ?? null;
$image_url = $input['image_url'] ?? '';
$color = $input['color'] ?? '';
$icon = $input['icon'] ?? '';
$sort_order = $input['sort_order'] ?? 0;

if (!$name || !$slug) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name and slug are required']);
    exit;
}

$stmt = $pdo->prepare("
    INSERT INTO categories (name, slug, description, parent_id, image_url, color, icon, sort_order, created_at, updated_at) 
    VALUES (:name, :slug, :description, :parent_id, :image_url, :color, :icon, :sort_order, NOW(), NOW())
");

$stmt->execute([
    ':name' => $name,
    ':slug' => $slug,
    ':description' => $description,
    ':parent_id' => $parent_id,
    ':image_url' => $image_url,
    ':color' => $color,
    ':icon' => $icon,
    ':sort_order' => $sort_order
]);

echo json_encode(['success' => true, 'message' => 'Category created']);
