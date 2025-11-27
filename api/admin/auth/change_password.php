<?php
require_once __DIR__ . '/verify_token.php';
require_once __DIR__ . '/../../utils/db.php';

$admin = verifyToken();

$input = json_decode(file_get_contents('php://input'), true);
$current = $input['current_password'] ?? '';
$new = $input['new_password'] ?? '';

if (!$current || !$new) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing current or new password']);
    exit;
}

$stmt = $pdo->prepare("SELECT password_hash FROM admins WHERE id = :id");
$stmt->execute([':id' => $admin['id']]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row || !password_verify($current, $row['password_hash'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Current password incorrect']);
    exit;
}

$newHash = password_hash($new, PASSWORD_DEFAULT);
$pdo->prepare("UPDATE admins SET password_hash = :hash, updated_at = NOW() WHERE id = :id")
    ->execute([':hash' => $newHash, ':id' => $admin['id']]);

echo json_encode(['success' => true, 'message' => 'Password changed']);
