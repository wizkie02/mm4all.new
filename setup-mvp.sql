-- MAX & OLI MVP Database Schema
-- Simple and minimal tables for blog functionality

DROP DATABASE IF EXISTS maxoli_mvp;
CREATE DATABASE maxoli_mvp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE maxoli_mvp;

-- 1. Admin users table (simplified)
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('super_admin', 'admin') DEFAULT 'admin',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Posts table (main content)
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content LONGTEXT NOT NULL,
    excerpt TEXT,
    featured_image_url TEXT,
    author_id INT NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES admins(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_published (published_at),
    INDEX idx_slug (slug)
);

-- 3. Post views tracking (simple analytics)
CREATE TABLE post_views (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    INDEX idx_post_date (post_id, viewed_at)
);

-- Insert default super admin
INSERT INTO admins (email, password, name, role) VALUES 
('admin@maxoli.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Max & Oli Admin', 'super_admin');

-- Sample post
INSERT INTO posts (title, slug, content, excerpt, author_id, status, published_at) VALUES 
('Welcome to Max & Oli', 'welcome-to-max-oli', '<h1>Welcome to Max & Oli</h1><p>This is our first blog post!</p>', 'Welcome to our brand new blog', 1, 'published', NOW());