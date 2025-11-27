# 📝 MM4All Admin System - Integration & Enhancement Guide

## 📌 Tổng quan

Tài liệu này mô tả việc tích hợp và mở rộng hệ thống admin MM4All dựa trên API backend hiện tại. 
Hệ thống đã có sẵn các API cơ bản trong folder `/api/`, cần mở rộng thêm các module admin management và authentication.

**Base URL:** `https://mm4all.com/api/`

**Existing APIs:** Resources, Categories, Authors, Analytics
**Need to Add:** Admin Authentication, User Management, Media Library, Comments

## 1. Cấu trúc Database

### 1.1 Database Admin (admin_db)

#### Bảng `admins`
```sql
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('super_admin', 'admin', 'editor', 'moderator') DEFAULT 'editor',
    avatar_url VARCHAR(255),
    phone VARCHAR(20),
    department VARCHAR(50),
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    last_login TIMESTAMP NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (created_by) REFERENCES admins(id),
    FOREIGN KEY (updated_by) REFERENCES admins(id)
);
```

#### Bảng `admin_roles`
```sql
CREATE TABLE admin_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Bảng `admin_sessions`
```sql
CREATE TABLE admin_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);
```

#### Bảng `admin_activity_logs`
```sql
CREATE TABLE admin_activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id INT,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);
```

### 1.2 Database Bài viết (content_db)

#### Bảng `posts`
```sql
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content LONGTEXT NOT NULL,
    excerpt TEXT,
    featured_image_url VARCHAR(255),
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    author_id INT NOT NULL,
    category_id INT,
    status ENUM('draft', 'pending', 'published', 'archived') DEFAULT 'draft',
    visibility ENUM('public', 'private', 'password_protected') DEFAULT 'public',
    password VARCHAR(255),
    scheduled_at TIMESTAMP NULL,
    published_at TIMESTAMP NULL,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    reading_time INT, -- phút
    content_type ENUM('article', 'meditation', 'guide', 'news') DEFAULT 'article',
    difficulty_level ENUM('beginner', 'intermediate', 'advanced'),
    tags JSON,
    seo_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (author_id) REFERENCES admins(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_status (status),
    INDEX idx_published_at (published_at),
    INDEX idx_author_id (author_id),
    INDEX idx_category_id (category_id),
    FULLTEXT idx_search (title, content, excerpt)
);
```

#### Bảng `categories`
```sql
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id INT NULL,
    image_url VARCHAR(255),
    color VARCHAR(7), -- hex color
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);
```

#### Bảng `tags`
```sql
CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7),
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Bảng `post_tags`
```sql
CREATE TABLE post_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_post_tag (post_id, tag_id)
);
```

#### Bảng `media_library`
```sql
CREATE TABLE media_library (
    id INT PRIMARY KEY AUTO_INCREMENT,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INT NOT NULL, -- bytes
    mime_type VARCHAR(100) NOT NULL,
    file_type ENUM('image', 'video', 'audio', 'document', 'other') NOT NULL,
    width INT, -- cho hình ảnh
    height INT, -- cho hình ảnh
    duration INT, -- cho video/audio (seconds)
    alt_text VARCHAR(255),
    caption TEXT,
    uploaded_by INT NOT NULL,
    folder_path VARCHAR(255),
    is_public BOOLEAN DEFAULT TRUE,
    metadata JSON, -- EXIF, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES admins(id)
);
```

#### Bảng `post_revisions`
```sql
CREATE TABLE post_revisions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    excerpt TEXT,
    revision_number INT NOT NULL,
    change_summary TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES admins(id)
);
```

#### Bảng `comments`
```sql
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    parent_id INT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(100) NOT NULL,
    author_website VARCHAR(255),
    content TEXT NOT NULL,
    status ENUM('pending', 'approved', 'spam', 'rejected') DEFAULT 'pending',
    ip_address VARCHAR(45),
    user_agent TEXT,
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES admins(id)
);
```

## 2. API Endpoints

### 2.1 Authentication APIs

#### POST `/api/admin/auth/login`
```json
{
  "email": "admin@mm4all.com",
  "password": "password123",
  "remember_me": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "jwt_token_here",
    "refresh_token": "refresh_token_here",
    "expires_in": 3600,
    "admin": {
      "id": 1,
      "username": "admin",
      "email": "admin@mm4all.com",
      "full_name": "Admin User",
      "role": "super_admin",
      "avatar_url": "https://example.com/avatar.jpg",
      "permissions": ["all"]
    }
  }
}
```

#### POST `/api/admin/auth/logout`
#### POST `/api/admin/auth/refresh`
#### POST `/api/admin/auth/forgot-password`
#### POST `/api/admin/auth/reset-password`
#### POST `/api/admin/auth/verify-email`
#### POST `/api/admin/auth/enable-2fa`

### 2.2 Admin Management APIs

#### GET `/api/admin/users`
```
Query params: page, limit, search, role, status, sort
```

#### POST `/api/admin/users`
```json
{
  "username": "newadmin",
  "email": "newadmin@mm4all.com",
  "password": "securepassword",
  "full_name": "New Admin",
  "role": "editor",
  "department": "Content"
}
```

#### GET `/api/admin/users/{id}`
#### PUT `/api/admin/users/{id}`
#### DELETE `/api/admin/users/{id}`
#### PUT `/api/admin/users/{id}/status`
#### GET `/api/admin/users/{id}/activity-logs`

### 2.3 Posts Management APIs

#### GET `/api/admin/posts`
```
Query params: 
- page, limit
- search (title, content)
- status (draft, pending, published, archived)
- author_id
- category_id
- content_type
- date_from, date_to
- sort (created_at, updated_at, published_at, view_count)
- order (asc, desc)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "Meditation for Beginners",
        "slug": "meditation-for-beginners",
        "excerpt": "Learn the basics of meditation...",
        "status": "published",
        "author": {
          "id": 1,
          "full_name": "Admin User",
          "avatar_url": "..."
        },
        "category": {
          "id": 1,
          "name": "Meditation",
          "color": "#4F46E5"
        },
        "featured_image_url": "...",
        "published_at": "2024-01-15T10:00:00Z",
        "view_count": 1250,
        "like_count": 45,
        "comment_count": 12,
        "reading_time": 5,
        "tags": ["meditation", "beginner", "mindfulness"]
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 156,
      "total_pages": 8,
      "has_next": true,
      "has_prev": false
    },
    "filters": {
      "total_drafts": 12,
      "total_pending": 3,
      "total_published": 140,
      "total_archived": 1
    }
  }
}
```

#### POST `/api/admin/posts`
```json
{
  "title": "New Post Title",
  "content": "<p>Post content in HTML</p>",
  "excerpt": "Short description...",
  "category_id": 1,
  "tags": ["tag1", "tag2"],
  "status": "draft",
  "featured_image_url": "...",
  "meta_title": "SEO Title",
  "meta_description": "SEO Description",
  "content_type": "article",
  "difficulty_level": "beginner",
  "scheduled_at": "2024-01-20T10:00:00Z"
}
```

#### GET `/api/admin/posts/{id}`
#### PUT `/api/admin/posts/{id}`
#### DELETE `/api/admin/posts/{id}`
#### PUT `/api/admin/posts/{id}/status`
#### POST `/api/admin/posts/{id}/duplicate`
#### GET `/api/admin/posts/{id}/revisions`
#### POST `/api/admin/posts/{id}/restore-revision/{revision_id}`

### 2.4 Categories & Tags APIs

#### GET `/api/admin/categories`
#### POST `/api/admin/categories`
#### PUT `/api/admin/categories/{id}`
#### DELETE `/api/admin/categories/{id}`

#### GET `/api/admin/tags`
#### POST `/api/admin/tags`
#### PUT `/api/admin/tags/{id}`
#### DELETE `/api/admin/tags/{id}`

### 2.5 Media Library APIs

#### GET `/api/admin/media`
```
Query params: page, limit, type, folder, search, date_from, date_to
```

#### POST `/api/admin/media/upload`
```
Content-Type: multipart/form-data
- files: File[]
- folder: string (optional)
- alt_text: string (optional)
- caption: string (optional)
```

#### PUT `/api/admin/media/{id}`
#### DELETE `/api/admin/media/{id}`
#### POST `/api/admin/media/bulk-delete`

### 2.6 Comments Management APIs

#### GET `/api/admin/comments`
#### PUT `/api/admin/comments/{id}/approve`
#### PUT `/api/admin/comments/{id}/reject`
#### DELETE `/api/admin/comments/{id}`

### 2.7 Analytics & Dashboard APIs

#### GET `/api/admin/dashboard/stats`
```json
{
  "success": true,
  "data": {
    "posts": {
      "total": 156,
      "published": 140,
      "drafts": 12,
      "pending": 3,
      "this_month": 15
    },
    "comments": {
      "total": 1234,
      "pending": 23,
      "approved": 1180,
      "spam": 31
    },
    "media": {
      "total_files": 456,
      "total_size": "2.3 GB",
      "this_month": 45
    },
    "traffic": {
      "total_views": 125000,
      "this_month": 12500,
      "today": 450
    }
  }
}
```

#### GET `/api/admin/analytics/posts`
#### GET `/api/admin/analytics/traffic`
#### GET `/api/admin/analytics/popular-content`

## 3. Permissions & Role System

### 3.1 Permissions Matrix

| Permission | Super Admin | Admin | Editor | Moderator |
|------------|-------------|-------|--------|-----------|
| Manage Admins | ✅ | ✅ | ❌ | ❌ |
| Create Posts | ✅ | ✅ | ✅ | ✅ |
| Edit Own Posts | ✅ | ✅ | ✅ | ✅ |
| Edit All Posts | ✅ | ✅ | ✅ | ❌ |
| Delete Posts | ✅ | ✅ | ✅ | ❌ |
| Publish Posts | ✅ | ✅ | ✅ | ❌ |
| Manage Categories | ✅ | ✅ | ✅ | ❌ |
| Manage Tags | ✅ | ✅ | ✅ | ✅ |
| Upload Media | ✅ | ✅ | ✅ | ✅ |
| Manage Media | ✅ | ✅ | ✅ | ❌ |
| Moderate Comments | ✅ | ✅ | ✅ | ✅ |
| View Analytics | ✅ | ✅ | ✅ | ❌ |
| System Settings | ✅ | ❌ | ❌ | ❌ |

### 3.2 Permission Codes
```json
{
  "permissions": [
    "admin.create",
    "admin.read",
    "admin.update",
    "admin.delete",
    "posts.create",
    "posts.read",
    "posts.update",
    "posts.delete",
    "posts.publish",
    "posts.moderate",
    "categories.manage",
    "tags.manage",
    "media.upload",
    "media.manage",
    "comments.moderate",
    "analytics.view",
    "settings.manage"
  ]
}
```

## 4. Security Measures

### 4.1 Authentication
- JWT tokens với refresh token
- Password hashing với bcrypt
- Rate limiting cho login attempts
- 2FA support
- Session management

### 4.2 Authorization
- Role-based access control (RBAC)
- Permission-based actions
- Resource ownership validation
- IP whitelist cho super admin

### 4.3 Data Protection
- Input validation và sanitization
- SQL injection protection
- XSS protection
- CSRF protection
- File upload validation
- Audit logging

## 5. Implementation Recommendations

### 5.1 Backend Framework
- **PHP**: Laravel hoặc Symfony
- **Node.js**: Express.js với TypeScript
- **Python**: Django hoặc FastAPI

### 5.2 Database
- **Primary**: MySQL 8.0+ hoặc PostgreSQL 13+
- **Cache**: Redis cho sessions và caching
- **Search**: Elasticsearch cho full-text search (optional)

### 5.3 File Storage
- **Local**: Cho development
- **Cloud**: AWS S3, Google Cloud Storage, hoặc Cloudinary
- **CDN**: CloudFlare hoặc AWS CloudFront

### 5.4 Additional Features
- **Email Service**: SendGrid, Mailgun, hoặc SES
- **Image Processing**: ImageMagick hoặc Sharp.js
- **Backup**: Automated database backups
- **Monitoring**: Application performance monitoring
- **Logging**: Structured logging với log rotation

## 6. Migration Plan

### Phase 1: Core Admin System
1. Admin authentication và authorization
2. Basic user management
3. Role và permission system

### Phase 2: Content Management
1. Posts CRUD operations
2. Categories và tags management
3. Media library basic functionality

### Phase 3: Advanced Features
1. Comments moderation
2. SEO optimization tools
3. Analytics dashboard
4. Advanced media management

### Phase 4: Enhancement
1. Workflow approval system
2. Content scheduling
3. Advanced search và filtering
4. Performance optimization

## 7. API Documentation

Sử dụng **OpenAPI/Swagger** để document tất cả API endpoints với:
- Request/Response schemas
- Authentication requirements
- Error codes và messages
- Examples và use cases

## 8. Testing Strategy

### 8.1 Unit Tests
- Model validation
- Business logic
- Utility functions

### 8.2 Integration Tests
- API endpoints
- Database operations
- Authentication flow

### 8.3 E2E Tests
- Complete user workflows
- Admin panel functionality
- Content publishing flow

---

**Tài liệu này cung cấp framework hoàn chỉnh cho việc phát triển hệ thống admin. Có thể điều chỉnh theo yêu cầu cụ thể của dự án MM4All.**
