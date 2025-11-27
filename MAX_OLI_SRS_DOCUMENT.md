# 📋 SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## Max-Oli.com - ADHD Blog Platform

**Version:** 1.0  
**Date:** December 2024  
**Project:** Max-Oli ADHD Blog Website  
**Based on:** MM4All Architecture & API Structure  

---

## 📖 TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Database Schema](#3-database-schema)
4. [API Specifications](#4-api-specifications)
5. [Frontend Components](#5-frontend-components)
6. [Content Management System](#6-content-management-system)
7. [User Authentication & Authorization](#7-user-authentication--authorization)
8. [Technical Requirements](#8-technical-requirements)
9. [Deployment Specifications](#9-deployment-specifications)
10. [Implementation Timeline](#10-implementation-timeline)

---

## 1. PROJECT OVERVIEW

### 1.1 Purpose
Max-Oli.com là một nền tảng blog chuyên biệt về ADHD (Attention Deficit Hyperactivity Disorder), cung cấp thông tin, tài nguyên và hỗ trợ cho phụ huynh, giáo viên và chuyên gia chăm sóc trẻ em bị rối loạn ADHD.

### 1.2 Scope
- **Public Website**: Blog posts, resources, guides về ADHD
- **Admin CMS**: Quản lý nội dung, người dùng, media
- **Content Categories**: Symptoms, Treatment, Education, Parenting Tips, Success Stories
- **Target Audience**: Parents, Teachers, Healthcare Professionals, Researchers

### 1.3 Key Features
- ✅ Professional blog platform with rich content editor
- ✅ ADHD-specific content categorization
- ✅ Resource library with downloadable materials
- ✅ Expert contributor system
- ✅ Comment system with moderation
- ✅ SEO-optimized content management
- ✅ Mobile-responsive design
- ✅ Multi-language support (English/Vietnamese)

---

## 2. SYSTEM ARCHITECTURE

### 2.1 Technology Stack
```
Frontend: React 19 + Vite + Styled Components + Framer Motion
Backend: PHP 8.1 + MySQL 8.0
Authentication: JWT with refresh tokens
File Storage: Local storage with CDN integration
Editor: TipTap rich text editor
State Management: React Context API + Hooks
```

### 2.2 Architecture Pattern
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│   PHP REST API  │◄──►│   MySQL DB      │
│   (Frontend)    │    │   (Backend)     │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Assets │    │   File Uploads  │    │   Backup System │
│   (Images/CSS)  │    │   (Media Lib)   │    │   (Automated)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2.3 Directory Structure
```
max-oli-website/
├── src/                          # React frontend source
│   ├── components/               # Reusable UI components
│   │   ├── common/              # Generic components
│   │   ├── blog/                # Blog-specific components
│   │   ├── adhd/                # ADHD-specific components
│   │   └── editor/              # Rich text editor components
│   ├── pages/                   # Route components
│   │   ├── public/              # Public pages
│   │   ├── admin/               # Admin dashboard
│   │   └── blog/                # Blog pages
│   ├── services/                # API communication
│   ├── contexts/                # React contexts
│   ├── hooks/                   # Custom hooks
│   ├── utils/                   # Helper functions
│   └── assets/                  # Static resources
├── api/                         # PHP backend
│   ├── admin/                   # Admin API endpoints
│   │   ├── auth/               # Authentication
│   │   ├── posts/              # Blog post management
│   │   ├── categories/         # Category management
│   │   ├── users/              # User management
│   │   ├── media/              # File upload/management
│   │   ├── comments/           # Comment system
│   │   └── analytics/          # Statistics
│   ├── public/                  # Public API endpoints
│   │   ├── blog/               # Public blog API
│   │   ├── resources/          # Resource downloads
│   │   └── contact/            # Contact forms
│   ├── utils/                   # Shared utilities
│   │   ├── db.php              # Database connection
│   │   ├── auth.php            # Auth helpers
│   │   └── helpers.php         # Common functions
│   └── vendor/                  # PHP dependencies
├── database/                    # Database files
│   ├── schema.sql              # Database structure
│   ├── migrations/             # Database migrations
│   └── seeds/                  # Sample data
├── uploads/                     # User uploaded files
├── public/                      # Static public files
└── docs/                        # Documentation
```

---

## 3. DATABASE SCHEMA

### 3.1 Core Tables

#### 3.1.1 Posts Table
```sql
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT,
    featured_image_url VARCHAR(500),
    category_id INT,
    author_id INT NOT NULL,
    status ENUM('draft', 'pending', 'published', 'archived') DEFAULT 'draft',
    content_type ENUM('article', 'guide', 'resource', 'case_study', 'research') DEFAULT 'article',
    adhd_focus ENUM('symptoms', 'treatment', 'education', 'parenting', 'adult_adhd', 'research') DEFAULT 'symptoms',
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    reading_time INT DEFAULT 0,
    view_count INT DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    published_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (author_id) REFERENCES admins(id),
    INDEX idx_status (status),
    INDEX idx_category (category_id),
    INDEX idx_adhd_focus (adhd_focus),
    INDEX idx_published_at (published_at)
);
```

#### 3.1.2 Categories Table
```sql
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50),
    parent_id INT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id),
    INDEX idx_parent (parent_id),
    INDEX idx_active (is_active)
);
```

#### 3.1.3 ADHD-Specific Tables
```sql
-- ADHD Resources Table
CREATE TABLE adhd_resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resource_type ENUM('checklist', 'worksheet', 'guide', 'template', 'assessment') NOT NULL,
    file_url VARCHAR(500),
    download_count INT DEFAULT 0,
    age_group ENUM('preschool', 'elementary', 'middle_school', 'high_school', 'adult', 'all_ages') DEFAULT 'all_ages',
    target_audience ENUM('parents', 'teachers', 'professionals', 'individuals', 'all') DEFAULT 'all',
    is_free BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ADHD Symptoms Tracker
CREATE TABLE adhd_symptoms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category ENUM('inattention', 'hyperactivity', 'impulsivity', 'combined') NOT NULL,
    description TEXT,
    age_specific TEXT,
    severity_scale JSON, -- JSON array for rating scales
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.1.4 User Management Tables
```sql
-- Admin Users (Content Creators, Editors, Moderators)
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('super_admin', 'admin', 'editor', 'contributor', 'moderator') DEFAULT 'contributor',
    bio TEXT,
    avatar_url VARCHAR(500),
    specialization VARCHAR(100), -- ADHD specialization area
    credentials TEXT, -- Professional credentials
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    INDEX idx_status (status)
);

-- Comments System
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    parent_id INT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'spam') DEFAULT 'pending',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_post (post_id),
    INDEX idx_status (status),
    INDEX idx_parent (parent_id)
);
```

#### 3.1.5 Media & SEO Tables
```sql
-- Media Library
CREATE TABLE media_library (
    id INT PRIMARY KEY AUTO_INCREMENT,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INT NOT NULL,
    alt_text VARCHAR(255),
    caption TEXT,
    uploaded_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES admins(id),
    INDEX idx_mime_type (mime_type),
    INDEX idx_uploaded_by (uploaded_by)
);

-- Tags System
CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6B7280',
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Post-Tag Relationships
CREATE TABLE post_tags (
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

---

## 4. API SPECIFICATIONS

### 4.1 Authentication Endpoints

#### 4.1.1 Admin Login
```php
POST /api/admin/auth/login.php
Content-Type: application/json

Request Body:
{
    "username": "string",
    "password": "string"
}

Response (Success):
{
    "success": true,
    "data": {
        "access_token": "jwt_token_here",
        "refresh_token": "refresh_token_here",
        "user": {
            "id": 1,
            "username": "admin",
            "full_name": "Dr. Sarah Johnson",
            "role": "admin",
            "specialization": "Child Psychology",
            "avatar_url": "https://example.com/avatar.jpg"
        }
    }
}

Response (Error):
{
    "success": false,
    "error": "Invalid credentials"
}
```

#### 4.1.2 Token Refresh
```php
POST /api/admin/auth/refresh_token.php
Content-Type: application/json

Request Body:
{
    "refresh_token": "refresh_token_here"
}

Response:
{
    "success": true,
    "data": {
        "access_token": "new_jwt_token_here",
        "refresh_token": "new_refresh_token_here"
    }
}
```

### 4.2 Blog Post Management

#### 4.2.1 Get Posts (Admin)
```php
GET /api/admin/posts/get_posts.php
Authorization: Bearer {jwt_token}

Query Parameters:
- page: int (default: 1)
- limit: int (default: 20)
- status: string (draft|pending|published|archived)
- category_id: int
- adhd_focus: string
- search: string

Response:
{
    "success": true,
    "data": {
        "posts": [
            {
                "id": 1,
                "title": "Understanding ADHD Symptoms in Children",
                "slug": "understanding-adhd-symptoms-children",
                "excerpt": "A comprehensive guide to recognizing ADHD symptoms...",
                "content": "Full HTML content here...",
                "featured_image_url": "https://example.com/image.jpg",
                "category_name": "Symptoms",
                "author_name": "Dr. Sarah Johnson",
                "status": "published",
                "adhd_focus": "symptoms",
                "difficulty_level": "beginner",
                "reading_time": 8,
                "view_count": 1250,
                "published_at": "2024-12-01 10:00:00",
                "created_at": "2024-11-28 15:30:00",
                "updated_at": "2024-12-01 09:45:00"
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 5,
            "total_posts": 87,
            "per_page": 20
        }
    }
}
```

#### 4.2.2 Create Post
```php
POST /api/admin/posts/create_post.php
Authorization: Bearer {jwt_token}
Content-Type: application/json

Request Body:
{
    "title": "New ADHD Article Title",
    "excerpt": "Brief description of the article",
    "content": "<p>Full HTML content here...</p>",
    "category_id": 2,
    "adhd_focus": "treatment",
    "difficulty_level": "intermediate",
    "status": "draft",
    "featured_image_url": "https://example.com/image.jpg",
    "meta_title": "SEO Title",
    "meta_description": "SEO Description",
    "meta_keywords": "adhd, treatment, children",
    "tags": ["adhd", "treatment", "medication"]
}

Response:
{
    "success": true,
    "data": {
        "post_id": 123,
        "slug": "new-adhd-article-title",
        "message": "Post created successfully"
    }
}
```

### 4.3 Public Blog API

#### 4.3.1 Get Public Posts
```php
GET /api/public/blog/get_posts.php

Query Parameters:
- page: int (default: 1)
- limit: int (default: 12)
- category: string (category slug)
- adhd_focus: string
- tag: string
- search: string

Response:
{
    "success": true,
    "data": {
        "posts": [
            {
                "id": 1,
                "title": "Understanding ADHD Symptoms in Children",
                "slug": "understanding-adhd-symptoms-children",
                "excerpt": "A comprehensive guide...",
                "featured_image_url": "https://example.com/image.jpg",
                "category": {
                    "name": "Symptoms",
                    "slug": "symptoms",
                    "color": "#3B82F6"
                },
                "author": {
                    "name": "Dr. Sarah Johnson",
                    "specialization": "Child Psychology",
                    "avatar_url": "https://example.com/avatar.jpg"
                },
                "adhd_focus": "symptoms",
                "difficulty_level": "beginner",
                "reading_time": 8,
                "view_count": 1250,
                "published_at": "2024-12-01 10:00:00",
                "tags": ["adhd", "symptoms", "children"]
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 8,
            "total_posts": 87,
            "per_page": 12
        }
    }
}
```

#### 4.3.2 Get Single Post
```php
GET /api/public/blog/get_post.php?slug={post_slug}

Response:
{
    "success": true,
    "data": {
        "post": {
            "id": 1,
            "title": "Understanding ADHD Symptoms in Children",
            "slug": "understanding-adhd-symptoms-children",
            "content": "<p>Full HTML content...</p>",
            "excerpt": "Brief description...",
            "featured_image_url": "https://example.com/image.jpg",
            "category": {
                "name": "Symptoms",
                "slug": "symptoms",
                "color": "#3B82F6"
            },
            "author": {
                "name": "Dr. Sarah Johnson",
                "bio": "Child psychologist specializing in ADHD...",
                "specialization": "Child Psychology",
                "credentials": "PhD in Psychology, Licensed Clinical Psychologist",
                "avatar_url": "https://example.com/avatar.jpg"
            },
            "adhd_focus": "symptoms",
            "difficulty_level": "beginner",
            "reading_time": 8,
            "view_count": 1251,
            "published_at": "2024-12-01 10:00:00",
            "tags": ["adhd", "symptoms", "children"],
            "meta_title": "Understanding ADHD Symptoms in Children - Max-Oli",
            "meta_description": "Learn to recognize ADHD symptoms in children...",
            "meta_keywords": "adhd, symptoms, children, diagnosis"
        },
        "related_posts": [
            {
                "id": 2,
                "title": "ADHD Diagnosis Process",
                "slug": "adhd-diagnosis-process",
                "excerpt": "Step-by-step guide...",
                "featured_image_url": "https://example.com/image2.jpg"
            }
        ]
    }
}
```

### 4.4 ADHD Resources API

#### 4.4.1 Get Resources
```php
GET /api/public/resources/get_resources.php

Query Parameters:
- type: string (checklist|worksheet|guide|template|assessment)
- age_group: string
- target_audience: string
- free_only: boolean

Response:
{
    "success": true,
    "data": {
        "resources": [
            {
                "id": 1,
                "title": "ADHD Symptoms Checklist for Parents",
                "description": "Comprehensive checklist to help parents identify...",
                "resource_type": "checklist",
                "file_url": "https://example.com/downloads/adhd-checklist.pdf",
                "download_count": 2847,
                "age_group": "elementary",
                "target_audience": "parents",
                "is_free": true,
                "created_at": "2024-11-15 14:20:00"
            }
        ]
    }
}
```

### 4.5 Media Upload API

#### 4.5.1 Upload File
```php
POST /api/admin/media/upload_media.php
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

Request Body:
- file: File (image/document)
- alt_text: string (optional)
- caption: string (optional)

Response:
{
    "success": true,
    "data": {
        "file_id": 45,
        "file_url": "https://max-oli.com/uploads/2024/12/adhd-infographic.jpg",
        "filename": "adhd-infographic.jpg",
        "file_size": 245760,
        "mime_type": "image/jpeg"
    }
}
```

---

## 5. FRONTEND COMPONENTS

### 5.1 Public Website Components

#### 5.1.1 Blog Components
```javascript
// BlogPostCard.jsx - Display blog post preview
const BlogPostCard = ({ post }) => {
  return (
    <CardContainer>
      <FeaturedImage src={post.featured_image_url} alt={post.title} />
      <CardContent>
        <CategoryBadge color={post.category.color}>
          {post.category.name}
        </CategoryBadge>
        <ADHDFocusBadge focus={post.adhd_focus} />
        <Title>{post.title}</Title>
        <Excerpt>{post.excerpt}</Excerpt>
        <AuthorInfo>
          <Avatar src={post.author.avatar_url} />
          <AuthorDetails>
            <AuthorName>{post.author.name}</AuthorName>
            <Specialization>{post.author.specialization}</Specialization>
          </AuthorDetails>
        </AuthorInfo>
        <PostMeta>
          <ReadingTime>{post.reading_time} min read</ReadingTime>
          <PublishDate>{formatDate(post.published_at)}</PublishDate>
        </PostMeta>
      </CardContent>
    </CardContainer>
  );
};

// BlogPostDetail.jsx - Full blog post view
const BlogPostDetail = ({ post }) => {
  return (
    <ArticleContainer>
      <ArticleHeader>
        <CategoryBreadcrumb>
          <Link to="/">Home</Link> /
          <Link to={`/category/${post.category.slug}`}>{post.category.name}</Link> /
          {post.title}
        </CategoryBreadcrumb>
        <ArticleTitle>{post.title}</ArticleTitle>
        <ArticleMeta>
          <AuthorCard>
            <Avatar src={post.author.avatar_url} />
            <AuthorInfo>
              <AuthorName>{post.author.name}</AuthorName>
              <Credentials>{post.author.credentials}</Credentials>
              <PublishDate>Published {formatDate(post.published_at)}</PublishDate>
            </AuthorInfo>
          </AuthorCard>
          <ArticleStats>
            <ReadingTime>{post.reading_time} min read</ReadingTime>
            <ViewCount>{post.view_count} views</ViewCount>
            <DifficultyLevel level={post.difficulty_level} />
          </ArticleStats>
        </ArticleMeta>
      </ArticleHeader>

      <FeaturedImage src={post.featured_image_url} alt={post.title} />

      <ArticleContent
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <ArticleFooter>
        <TagsList>
          {post.tags.map(tag => (
            <Tag key={tag} to={`/tag/${tag}`}>{tag}</Tag>
          ))}
        </TagsList>
        <ShareButtons post={post} />
      </ArticleFooter>

      <RelatedPosts posts={post.related_posts} />
      <CommentsSection postId={post.id} />
    </ArticleContainer>
  );
};
```

#### 5.1.2 ADHD-Specific Components
```javascript
// ADHDResourceCard.jsx - Resource download card
const ADHDResourceCard = ({ resource }) => {
  return (
    <ResourceCard>
      <ResourceIcon type={resource.resource_type} />
      <ResourceContent>
        <ResourceTitle>{resource.title}</ResourceTitle>
        <ResourceDescription>{resource.description}</ResourceDescription>
        <ResourceMeta>
          <AgeGroup>{resource.age_group}</AgeGroup>
          <TargetAudience>{resource.target_audience}</TargetAudience>
          <DownloadCount>{resource.download_count} downloads</DownloadCount>
        </ResourceMeta>
        <DownloadButton
          href={resource.file_url}
          download
          onClick={() => trackDownload(resource.id)}
        >
          Download {resource.is_free ? 'Free' : 'Premium'}
        </DownloadButton>
      </ResourceContent>
    </ResourceCard>
  );
};

// ADHDSymptomChecker.jsx - Interactive symptom assessment
const ADHDSymptomChecker = () => {
  const [responses, setResponses] = useState({});
  const [currentCategory, setCurrentCategory] = useState('inattention');

  return (
    <SymptomCheckerContainer>
      <CheckerHeader>
        <Title>ADHD Symptom Assessment Tool</Title>
        <Disclaimer>
          This tool is for educational purposes only and does not replace
          professional medical diagnosis.
        </Disclaimer>
      </CheckerHeader>

      <CategoryTabs>
        <Tab
          active={currentCategory === 'inattention'}
          onClick={() => setCurrentCategory('inattention')}
        >
          Inattention
        </Tab>
        <Tab
          active={currentCategory === 'hyperactivity'}
          onClick={() => setCurrentCategory('hyperactivity')}
        >
          Hyperactivity
        </Tab>
        <Tab
          active={currentCategory === 'impulsivity'}
          onClick={() => setCurrentCategory('impulsivity')}
        >
          Impulsivity
        </Tab>
      </CategoryTabs>

      <SymptomQuestions category={currentCategory} />
      <ResultsSummary responses={responses} />
    </SymptomCheckerContainer>
  );
};
```

### 5.2 Admin Dashboard Components

#### 5.2.1 Enhanced Content Editor
```javascript
// ADHDContentEditor.jsx - Specialized editor for ADHD content
const ADHDContentEditor = ({ post, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    adhd_focus: 'symptoms',
    difficulty_level: 'beginner',
    target_audience: 'parents',
    age_group: 'all_ages',
    ...post
  });

  return (
    <EditorContainer>
      <EditorHeader>
        <Title>Create ADHD Content</Title>
        <SaveActions>
          <AutoSaveStatus />
          <PreviewButton />
          <SaveDraftButton />
          <PublishButton />
        </SaveActions>
      </EditorHeader>

      <EditorContent>
        <MainEditor>
          <TitleInput
            value={formData.title}
            onChange={(title) => setFormData({...formData, title})}
            placeholder="Enter article title..."
          />

          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData({...formData, content})}
            plugins={['adhd-templates', 'symptom-highlighter', 'resource-linker']}
          />
        </MainEditor>

        <EditorSidebar>
          <ADHDSettingsPanel>
            <FormGroup>
              <Label>ADHD Focus Area</Label>
              <Select
                value={formData.adhd_focus}
                onChange={(adhd_focus) => setFormData({...formData, adhd_focus})}
              >
                <option value="symptoms">Symptoms</option>
                <option value="treatment">Treatment</option>
                <option value="education">Education</option>
                <option value="parenting">Parenting</option>
                <option value="adult_adhd">Adult ADHD</option>
                <option value="research">Research</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Difficulty Level</Label>
              <Select
                value={formData.difficulty_level}
                onChange={(difficulty_level) => setFormData({...formData, difficulty_level})}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Target Audience</Label>
              <MultiSelect
                value={formData.target_audience}
                onChange={(target_audience) => setFormData({...formData, target_audience})}
                options={['parents', 'teachers', 'professionals', 'individuals']}
              />
            </FormGroup>
          </ADHDSettingsPanel>

          <SEOPanel />
          <MediaPanel />
          <PublishingPanel />
        </EditorSidebar>
      </EditorContent>
    </EditorContainer>
  );
};
```

---

## 6. CONTENT MANAGEMENT SYSTEM

### 6.1 Editorial Workflow
```
Draft → Review → Fact-Check → Medical Review → Published
  ↓       ↓         ↓           ↓              ↓
Author  Editor   Fact-Checker  Medical Expert  Published
```

### 6.2 Content Templates
- **Symptom Guide Template**: Structured format for symptom descriptions
- **Treatment Article Template**: Evidence-based treatment information
- **Parenting Tips Template**: Practical advice for parents
- **Case Study Template**: Real-world examples and success stories
- **Research Summary Template**: Academic research made accessible

### 6.3 Quality Assurance
- **Medical Accuracy Review**: All medical content reviewed by qualified professionals
- **Fact-Checking Process**: Sources verification and citation requirements
- **Readability Analysis**: Content optimized for target audience reading level
- **SEO Optimization**: Search engine optimization for ADHD-related keywords

---

## 7. USER AUTHENTICATION & AUTHORIZATION

### 7.1 Role-Based Access Control
```javascript
// Permission Matrix
const PERMISSIONS = {
  super_admin: ['*'], // All permissions
  admin: [
    'posts.create', 'posts.edit', 'posts.delete', 'posts.publish',
    'users.create', 'users.edit', 'users.delete',
    'categories.manage', 'media.manage', 'comments.moderate'
  ],
  editor: [
    'posts.create', 'posts.edit', 'posts.publish',
    'media.upload', 'comments.moderate'
  ],
  contributor: [
    'posts.create', 'posts.edit_own', 'media.upload'
  ],
  moderator: [
    'comments.moderate', 'posts.review'
  ]
};
```

### 7.2 Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: API request throttling
- **CSRF Protection**: Cross-site request forgery prevention
- **Input Sanitization**: XSS and SQL injection prevention
- **File Upload Security**: Malware scanning and file type validation

---

## 8. TECHNICAL REQUIREMENTS

### 8.1 Performance Requirements
- **Page Load Time**: < 3 seconds for blog posts
- **API Response Time**: < 500ms for most endpoints
- **Image Optimization**: WebP format with fallbacks
- **Caching Strategy**: Redis for API responses, CDN for static assets
- **Database Optimization**: Proper indexing and query optimization

### 8.2 SEO Requirements
- **Meta Tags**: Dynamic meta titles, descriptions, and keywords
- **Schema Markup**: Article, Person, and Organization schemas
- **Sitemap**: Automated XML sitemap generation
- **Robots.txt**: Search engine crawling guidelines
- **Canonical URLs**: Duplicate content prevention

### 8.3 Accessibility Requirements
- **WCAG 2.1 AA Compliance**: Web accessibility standards
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: Minimum 4.5:1 contrast ratio
- **Alt Text**: Descriptive alternative text for all images

---

## 9. DEPLOYMENT SPECIFICATIONS

### 9.1 Server Requirements
```
Web Server: Apache 2.4+ or Nginx 1.18+
PHP: 8.1+ with extensions (PDO, JSON, GD, cURL)
Database: MySQL 8.0+ or MariaDB 10.6+
Memory: 4GB RAM minimum, 8GB recommended
Storage: 50GB SSD minimum
SSL Certificate: Required for HTTPS
```

### 9.2 Environment Configuration
```bash
# Production Environment Variables
ENVIRONMENT=production
DB_HOST=localhost
DB_NAME=maxoli_production
DB_USER=maxoli_user
DB_PASS=secure_password_here
JWT_SECRET=random_256_bit_secret
UPLOAD_MAX_SIZE=10M
CACHE_DRIVER=redis
MAIL_DRIVER=smtp
CDN_URL=https://cdn.max-oli.com
```

### 9.3 Backup Strategy
- **Database Backups**: Daily automated backups with 30-day retention
- **File Backups**: Weekly full backups of uploads and media
- **Code Backups**: Git repository with tagged releases
- **Disaster Recovery**: Offsite backup storage and recovery procedures

---

## 10. IMPLEMENTATION TIMELINE

### Phase 1: Foundation (Weeks 1-4)
- ✅ Database schema design and creation
- ✅ Basic API endpoints development
- ✅ Authentication system implementation
- ✅ Admin dashboard basic structure

### Phase 2: Core Features (Weeks 5-8)
- ✅ Rich text editor integration
- ✅ Content management system
- ✅ Media upload and management
- ✅ Category and tag system

### Phase 3: ADHD-Specific Features (Weeks 9-12)
- ✅ ADHD content templates
- ✅ Symptom checker tool
- ✅ Resource library system
- ✅ Specialized content fields

### Phase 4: Public Website (Weeks 13-16)
- ✅ Blog frontend development
- ✅ Responsive design implementation
- ✅ SEO optimization
- ✅ Performance optimization

### Phase 5: Testing & Launch (Weeks 17-20)
- ✅ Comprehensive testing
- ✅ Security audit
- ✅ Performance testing
- ✅ Production deployment

---

## 📋 CONCLUSION

Tài liệu SRS này cung cấp một blueprint chi tiết để phát triển Max-Oli.com dựa trên kiến trúc thành công của MM4All. Hệ thống được thiết kế để:

- **Chuyên biệt hóa**: Tập trung vào nội dung ADHD với các tính năng đặc thù
- **Chất lượng cao**: Quy trình biên tập nghiêm ngặt và kiểm tra y khoa
- **Dễ sử dụng**: Giao diện thân thiện cho cả người đọc và người tạo nội dung
- **Mở rộng được**: Kiến trúc linh hoạt cho phép phát triển tương lai
- **Bảo mật**: Tuân thủ các tiêu chuẩn bảo mật web hiện đại

**Kết quả mong đợi**: Một nền tảng blog chuyên nghiệp về ADHD, cung cấp thông tin đáng tin cậy và tài nguyên hữu ích cho cộng đồng ADHD Việt Nam và quốc tế.
