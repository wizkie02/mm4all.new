<?php
require_once __DIR__ . '/../auth/verify_token.php';
require_once __DIR__ . '/../../utils/db.php';

// CORS …
error_reporting(E_ALL);
ini_set('display_errors', 1);
// … (như cũ)

$admin = verifyToken();

$id = intval($_GET['id'] ?? 0);
if (!$id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing media id']);
    exit;
}

$stmt = $pdo->prepare("DELETE FROM media_library WHERE id = :id");
$stmt->execute([':id' => $id]);

echo json_encode(['success' => true, 'message' => 'Media deleted']);
