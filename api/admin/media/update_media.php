<?php
require_once __DIR__ . '/../auth/verify_token.php';
require_once __DIR__ . '/../../utils/db.php';

// CORS …
error_reporting(E_ALL);
ini_set('display_errors', 1);
// … (như cũ)

$admin = verifyToken();

$id = intval($_GET['id'] ?? 0);
$input = json_decode(file_get_contents('php://input'), true);

if (!$id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing media id']);
    exit;
}

$stmt = $pdo->prepare("UPDATE media_library SET alt_text = :alt, caption = :caption, updated_at = NOW() WHERE id = :id");
$stmt->execute([
    ':alt' => $input['alt_text'] ?? '',
    ':caption' => $input['caption'] ?? '',
    ':id' => $id
]);

echo json_encode(['success' => true, 'message' => 'Media updated']);
