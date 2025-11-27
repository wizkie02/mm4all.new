<?php
$host = 'localhost';
$dbname = 'forgvixf_mm4all_db';
$username = 'forgvixf_dirk';
$password = 'YyqqU!#cy$Ng3&D@'; // Thay đúng vào đây

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500); // 👈 thêm status code cho API
    header("Content-Type: application/json");
    echo json_encode(['error' => 'DB Connection failed', 'details' => $e->getMessage()]);
    exit;
}
