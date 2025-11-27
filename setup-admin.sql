-- MM4All Admin System Database Setup
-- Run this SQL on your MySQL database

-- Create admin user (default credentials)
-- Email: admin@mm4all.com
-- Password: admin123 (change after first login)

INSERT INTO admins (
  username, 
  email, 
  password_hash, 
  full_name, 
  role, 
  status, 
  email_verified,
  created_at
) VALUES (
  'admin',
  'admin@mm4all.com',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash of 'admin123'
  'System Administrator',
  'super_admin',
  'active',
  1,
  NOW()
) ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  status = VALUES(status);

-- Create default categories
INSERT INTO categories (name, slug, description, color, is_active, created_at) VALUES
('Mindfulness', 'mindfulness', 'Mindfulness and meditation content', '#4F46E5', 1, NOW()),
('Wellness', 'wellness', 'Health and wellness articles', '#059669', 1, NOW()),
('Guides', 'guides', 'How-to guides and tutorials', '#DC2626', 1, NOW()),
('News', 'news', 'Latest news and updates', '#7C2D12', 1, NOW())
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  color = VALUES(color);

-- Create default tags
INSERT INTO tags (name, slug, description, color, created_at) VALUES
('meditation', 'meditation', 'Meditation practices', '#8B5CF6', NOW()),
('breathing', 'breathing', 'Breathing exercises', '#06B6D4', NOW()),
('stress-relief', 'stress-relief', 'Stress management', '#10B981', NOW()),
('sleep', 'sleep', 'Sleep improvement', '#F59E0B', NOW()),
('beginner', 'beginner', 'Beginner-friendly content', '#6B7280', NOW()),
('advanced', 'advanced', 'Advanced techniques', '#EF4444', NOW())
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  color = VALUES(color);

-- Create sample post
INSERT INTO posts (
  title,
  slug, 
  content,
  excerpt,
  author_id,
  category_id,
  status,
  content_type,
  difficulty_level,
  featured_image_url,
  meta_title,
  meta_description,
  tags,
  created_at,
  updated_at
) VALUES (
  'Welcome to MM4All Admin',
  'welcome-to-mm4all-admin',
  '<h1>Welcome to the MM4All Admin System</h1><p>This is your first post created by the setup script. You can edit or delete this post from the admin dashboard.</p><p>Key features of the admin system:</p><ul><li>Content management with rich editor</li><li>User and role management</li><li>Media library</li><li>Comment moderation</li><li>Analytics dashboard</li></ul>',
  'Welcome post for the MM4All admin system with key features overview.',
  (SELECT id FROM admins WHERE email = 'admin@mm4all.com' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'news' LIMIT 1),
  'published',
  'article',
  'beginner',
  'https://via.placeholder.com/800x400/4F46E5/ffffff?text=MM4All+Admin',
  'Welcome to MM4All Admin System',
  'Getting started with the MM4All admin system for content management.',
  '["welcome", "admin", "getting-started"]',
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  content = VALUES(content),
  updated_at = NOW();

-- Update usage counts for tags
UPDATE tags SET usage_count = (
  SELECT COUNT(*) FROM posts WHERE JSON_CONTAINS(tags, CONCAT('"', tags.name, '"'))
);

SELECT 'Admin setup completed successfully!' as message;
