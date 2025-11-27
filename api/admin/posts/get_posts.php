<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('#^http://localhost:\d+$#', $origin) || $origin === 'https://maxoli.com') {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Require database
require_once __DIR__ . '/../../utils/db.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// JWT secret key
$jwt_secret = 'maxoli_jwt_secret_2024_secure_key_change_in_production';

// Verify JWT token (optional for public posts, required for drafts)
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

try {
    $admin = verifyToken();
    $page = (int)($_GET['page'] ?? 1);
    $limit = min((int)($_GET['limit'] ?? 20), 50); // Max 50 posts per page
    $offset = ($page - 1) * $limit;
    $search = $_GET['search'] ?? '';
    $status = $_GET['status'] ?? '';
    
    // Build WHERE clause
    $whereConditions = [];
    $params = [];
    
    // If not admin, only show published posts
    if (!$admin) {
        $whereConditions[] = "p.status = 'published'";
    } elseif ($status && in_array($status, ['draft', 'published', 'archived'])) {
        $whereConditions[] = "p.status = :status";
        $params[':status'] = $status;
    }
    
    // Search functionality
    if ($search) {
        $whereConditions[] = "(p.title LIKE :search OR p.content LIKE :search OR p.excerpt LIKE :search)";
        $params[':search'] = "%{$search}%";
    }
    
    $whereClause = $whereConditions ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
    
    // Get total count
    $countStmt = $pdo->prepare("
        SELECT COUNT(*) 
        FROM posts p 
        {$whereClause}
    ");
    $countStmt->execute($params);
    $totalPosts = $countStmt->fetchColumn();
    
    // Get posts with author info
    $stmt = $pdo->prepare("
        SELECT 
            p.id, p.title, p.slug, p.excerpt, p.content, p.featured_image_url,
            p.status, p.view_count, p.published_at, p.created_at, p.updated_at,
            a.name as author_name, a.id as author_id
        FROM posts p
        LEFT JOIN admins a ON p.author_id = a.id
        {$whereClause}
        ORDER BY p.created_at DESC
        LIMIT :limit OFFSET :offset
    ");
    
    // Bind all parameters
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
    $stmt->execute();
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format posts
    foreach ($posts as &$post) {
        $post['id'] = (int)$post['id'];
        $post['author_id'] = (int)$post['author_id'];
        $post['view_count'] = (int)($post['view_count'] ?? 0);
        
        // For public view, don't include full content in list
        if (!$admin) {
            unset($post['content']);
        }
    }
    
    $totalPages = ceil($totalPosts / $limit);
    
    echo json_encode([
        'success' => true,
        'data' => [
            'posts' => $posts,
            'pagination' => [
                'current_page' => $page,
                'total_pages' => $totalPages,
                'total_posts' => (int)$totalPosts,
                'per_page' => $limit,
                'has_next' => $page < $totalPages,
                'has_prev' => $page > 1
            ]
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Get posts error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch posts: ' . $e->getMessage()
    ]);
}
?>