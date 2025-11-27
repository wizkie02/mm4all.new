<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Require database
require_once __DIR__ . '/../utils/db.php';

try {
    $slug = $_GET['slug'] ?? '';
    $id = $_GET['id'] ?? '';
    
    if (empty($slug) && empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Post slug or ID is required']);
        exit;
    }
    
    // Get post
    if ($slug) {
        $stmt = $pdo->prepare("
            SELECT p.*, a.name as author_name 
            FROM posts p
            LEFT JOIN admins a ON p.author_id = a.id
            WHERE p.slug = :slug AND p.status = 'published'
        ");
        $stmt->execute([':slug' => $slug]);
    } else {
        $stmt = $pdo->prepare("
            SELECT p.*, a.name as author_name 
            FROM posts p
            LEFT JOIN admins a ON p.author_id = a.id
            WHERE p.id = :id AND p.status = 'published'
        ");
        $stmt->execute([':id' => $id]);
    }
    
    $post = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$post) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Post not found']);
        exit;
    }
    
    // Track view
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
    
    // Simple bot detection
    $isBot = preg_match('/bot|crawl|spider|scraper/i', $userAgent);
    
    if (!$isBot) {
        // Check if same IP viewed this post in last hour to prevent spam
        $stmt = $pdo->prepare("
            SELECT COUNT(*) 
            FROM post_views 
            WHERE post_id = :post_id 
            AND ip_address = :ip 
            AND viewed_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
        ");
        $stmt->execute([
            ':post_id' => $post['id'],
            ':ip' => $ipAddress
        ]);
        
        $recentViews = $stmt->fetchColumn();
        
        if ($recentViews == 0) {
            // Record view
            $stmt = $pdo->prepare("
                INSERT INTO post_views (post_id, ip_address, user_agent, viewed_at)
                VALUES (:post_id, :ip, :user_agent, NOW())
            ");
            $stmt->execute([
                ':post_id' => $post['id'],
                ':ip' => $ipAddress,
                ':user_agent' => $userAgent
            ]);
            
            // Update post view count
            $stmt = $pdo->prepare("
                UPDATE posts 
                SET view_count = view_count + 1 
                WHERE id = :id
            ");
            $stmt->execute([':id' => $post['id']]);
            
            $post['view_count'] = (int)$post['view_count'] + 1;
        }
    }
    
    // Format response
    $post['id'] = (int)$post['id'];
    $post['author_id'] = (int)$post['author_id'];
    $post['view_count'] = (int)($post['view_count'] ?? 0);
    
    echo json_encode([
        'success' => true,
        'data' => [
            'post' => $post
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Get post error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch post: ' . $e->getMessage()
    ]);
}
?>