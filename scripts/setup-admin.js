#!/usr/bin/env node

/**
 * MM4All Admin System Setup Script
 * This script helps initialize the admin system with default data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🚀 MM4All Admin System Setup');
console.log('=====================================\n');

// Check if running in correct directory
const packageJsonPath = path.join(projectRoot, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: Please run this script from the project root directory');
  process.exit(1);
}

// Create necessary directories
const directories = [
  'src/contexts',
  'src/hooks',
  'src/services',
  'uploads/media',
  'uploads/avatars',
  'logs'
];

console.log('📁 Creating directories...');
directories.forEach(dir => {
  const fullPath = path.join(projectRoot, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created: ${dir}`);
  } else {
    console.log(`ℹ️  Exists: ${dir}`);
  }
});

// Create environment file if it doesn't exist
const envPath = path.join(projectRoot, '.env');
if (!fs.existsSync(envPath)) {
  console.log('\n📄 Creating .env file...');
  const envContent = `# MM4All Admin Environment Configuration

# API Configuration
VITE_API_URL=https://mm4all.com/api

# JWT Configuration  
VITE_JWT_SECRET_KEY=your_super_secret_jwt_key_here_${Date.now()}

# App Configuration
VITE_APP_NAME=MM4All Admin
VITE_APP_VERSION=1.0.0

# Upload Configuration
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx,mp3,mp4

# Debug Mode
VITE_DEBUG_MODE=true

# Database Configuration (for reference)
# DB_HOST=localhost
# DB_NAME=forgvixf_mm4all_db
# DB_USER=forgvixf_dirk
# DB_PASS=your_password_here
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
} else {
  console.log('ℹ️  .env file already exists');
}

// Generate admin setup SQL
const sqlPath = path.join(projectRoot, 'setup-admin.sql');
if (!fs.existsSync(sqlPath)) {
  console.log('\n🗄️  Creating admin setup SQL...');
  const sqlContent = `-- MM4All Admin System Database Setup
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
`;

  fs.writeFileSync(sqlPath, sqlContent);
  console.log('✅ Created setup-admin.sql');
} else {
  console.log('ℹ️  setup-admin.sql already exists');
}

// Create a quick start guide
const guidePath = path.join(projectRoot, 'QUICK_START.md');
if (!fs.existsSync(guidePath)) {
  console.log('\n📚 Creating quick start guide...');
  const guideContent = `# MM4All Admin - Quick Start Guide

## 🚀 Getting Started

### 1. Database Setup
\`\`\`bash
# Import the admin database schema
mysql -u your_user -p your_database < setup-admin.sql
\`\`\`

### 2. Environment Configuration
1. Edit \`.env\` file with your settings
2. Update API URL if different from https://mm4all.com/api
3. Set a secure JWT secret key

### 3. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

### 4. Access Admin Panel
1. Open http://localhost:5173/admin/login
2. Login with default credentials:
   - Email: admin@mm4all.com
   - Password: admin123
3. **Important**: Change the password after first login!

### 5. Available Routes
- \`/admin/login\` - Login page
- \`/admin/dashboard\` - Main admin dashboard (primary admin interface)
- \`/admin\` - Automatically redirects to \`/admin/dashboard\`
- \`/admin/create\` - Create new post
- \`/admin/edit/:id\` - Edit existing post

## 🔧 Development

### API Endpoints
All API endpoints are located in the \`/api/admin/\` directory:
- Authentication: \`/api/admin/auth/\`
- Posts: \`/api/admin/posts/\`
- Users: \`/api/admin/users/\`
- Categories: \`/api/admin/categories/\`
- Tags: \`/api/admin/tags/\`
- Media: \`/api/admin/media/\`
- Comments: \`/api/admin/comments/\`

### Custom Hooks
- \`useAuth()\` - Authentication state
- \`useApiData()\` - API data fetching
- \`usePaginatedData()\` - Paginated data
- \`useCrudOperations()\` - CRUD operations

### Permission System
\`\`\`javascript
const { hasPermission } = useAuth();

// Check permissions
if (hasPermission('posts.create')) {
  // Show create button
}
\`\`\`

## 🐛 Troubleshooting

### Common Issues
1. **CORS errors**: Check server CORS configuration
2. **Login fails**: Verify database connection and admin user exists
3. **File uploads fail**: Check PHP upload limits and directory permissions

### Debug Mode
Set \`VITE_DEBUG_MODE=true\` in .env for detailed error logging.

## 📞 Support
Check the main README_ADMIN.md for detailed documentation.
`;

  fs.writeFileSync(guidePath, guideContent);
  console.log('✅ Created QUICK_START.md');
} else {
  console.log('ℹ️  QUICK_START.md already exists');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\nNext steps:');
console.log('1. Run the setup-admin.sql on your database');
console.log('2. Update .env with your configuration');
console.log('3. Run: npm install');
console.log('4. Run: npm run dev');
console.log('5. Open: http://localhost:5173/admin/login');
console.log('\n📖 Read QUICK_START.md for detailed instructions');
