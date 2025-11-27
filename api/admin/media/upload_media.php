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

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No file uploaded']);
    exit;
}

$file = $_FILES['file'];
$targetDir = __DIR__ . '/../../uploads/';
if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);

$filename = uniqid() . '_' . basename($file['name']);
$filepath = $targetDir . $filename;
$fileurl = '/uploads/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $filepath)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to move uploaded file']);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO media_library (filename, original_filename, file_path, file_url, mime_type, file_size, uploaded_by, created_at, updated_at) VALUES (:fn, :ofn, :fp, :fu, :mt, :fs, :uid, NOW(), NOW())");

$stmt->execute([
    ':fn' => $filename,
    ':ofn' => $file['name'],
    ':fp' => realpath($filepath),
    ':fu' => $fileurl,
    ':mt' => $file['type'],
    ':fs' => $file['size'],
    ':uid' => $admin['id']
]);

echo json_encode(['success' => true, 'message' => 'File uploaded', 'file_url' => $fileurl]);
