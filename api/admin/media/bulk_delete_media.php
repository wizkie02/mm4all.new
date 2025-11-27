<?php
require_once __DIR__ . '/../auth/verify_token.php';
require_once __DIR__ . '/../../utils/db.php';

// CORS …
error_reporting(E_ALL);
ini_set('display_errors', 1);
// … (như cũ)

$admin = verifyToken();

$input = json_decode(file_get_contents('php://input'), true);
$ids = $input['ids'] ?? [];

if (empty($ids) || !is_array($ids)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid ids']);
    exit;
}

$placeholders = implode(',', array_fill(0, count($ids), '?'));
$stmt = $pdo->prepare("DELETE FROM media_library WHERE id IN ($placeholders)");
$stmt->execute($ids);

echo json_encode(['success' => true, 'message' => 'Media files deleted']);
