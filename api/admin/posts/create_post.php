<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('#^http://localhost:\d+$#', $origin) || $origin === 'https://maxoli.com') {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Require auth and database
require_once __DIR__ . '/../../utils/db.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// JWT secret key (should match login.php)
$jwt_secret = 'maxoli_jwt_secret_2024_secure_key_change_in_production';

// Verify JWT token
function verifyToken() {
    global $jwt_secret;
    
    $headers = getallheaders();
    $authorization = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
    if (empty($authorization) || !preg_match('/Bearer\s+(.*)$/i', $authorization, $matches)) {
        return null;
    }
    
    try {
        $decoded = JWT::decode($matches[1], new Key($jwt_secret, 'HS256'));
        return (array) $decoded;
    } catch (Exception $e) {
        return null;
    }
}

// Verify admin authentication
$admin = verifyToken();
if (!$admin) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

// Get input data
$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['title']) || empty($input['content'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Title and content are required']);
    exit;
}

// Generate slug from title if not provided
function generateSlug($text) {
    if (empty($text)) return '';
    
    return strtolower(trim(preg_replace('/[^a-zA-Z0-9\s-]/', '', 
        preg_replace('/[\s_-]+/', '-', 
        preg_replace('/^-+|-+$/', '', $text)))));
}

try {
    // Prepare post data
    $title = trim($input['title']);
    $content = $input['content'];
    $excerpt = $input['excerpt'] ?? '';
    $slug = !empty($input['slug']) ? $input['slug'] : generateSlug($title);
    $status = $input['status'] ?? 'draft';
    $featured_image_url = $input['featured_image_url'] ?? '';
    $author_id = $admin['id'];
    
    // Validate status
    if (!in_array($status, ['draft', 'published', 'archived'])) {
        $status = 'draft';
    }
    
    // Check if slug already exists and make it unique
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM posts WHERE slug = :slug");
    $stmt->execute([':slug' => $slug]);
    $slugCount = $stmt->fetchColumn();
    
    if ($slugCount > 0) {
        $slug = $slug . '-' . time();
    }
    
    // Insert post
    $stmt = $pdo->prepare("
        INSERT INTO posts (
            title, slug, content, excerpt, featured_image_url, 
            author_id, status, published_at, created_at, updated_at
        ) VALUES (
            :title, :slug, :content, :excerpt, :featured_image_url, 
            :author_id, :status, :published_at, NOW(), NOW()
        )
    ");
    
    $published_at = ($status === 'published') ? date('Y-m-d H:i:s') : null;
    
    $success = $stmt->execute([
        ':title' => $title,
        ':slug' => $slug,
        ':content' => $content,
        ':excerpt' => $excerpt,
        ':featured_image_url' => $featured_image_url,
        ':author_id' => $author_id,
        ':status' => $status,
        ':published_at' => $published_at
    ]);
    
    if ($success) {
        $postId = $pdo->lastInsertId();
        
        // Get the created post
        $stmt = $pdo->prepare("
            SELECT p.*, a.name as author_name 
            FROM posts p 
            LEFT JOIN admins a ON p.author_id = a.id 
            WHERE p.id = :id
        ");
        $stmt->execute([':id' => $postId]);
        $post = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'message' => 'Post created successfully',
            'data' => [
                'post' => $post
            ]
        ]);
    } else {
        throw new Exception('Failed to create post');
    }
    
} catch (Exception $e) {
    error_log("Create post error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Failed to create post: ' . $e->getMessage()
    ]);
}
?>