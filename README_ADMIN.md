# MM4All Admin System

## 📋 Overview

A comprehensive admin system for MM4All website that provides content management, user administration, and analytics through a modern React frontend integrated with PHP backend APIs.

## 🚀 Features

### ✅ Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Session management with refresh tokens
- Protected routes with permission checks

### ✅ Content Management
- Create, edit, delete blog posts/articles
- Rich content editor with preview
- Category and tag management
- Media library with file upload
- SEO optimization tools
- Content scheduling (future feature)

### ✅ User Management
- Admin user CRUD operations
- Role assignment (Super Admin, Admin, Editor, Moderator)
- User status management
- Activity logging

### ✅ Media Management
- File upload with validation
- Image optimization
- Bulk operations
- Organized file structure

### ✅ Comments System
- Comment moderation
- Approve/reject workflow
- Spam detection (future feature)

### ✅ Analytics Dashboard
- Content performance metrics
- User activity tracking
- System statistics
- Real-time data updates

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Custom Hooks** - State management

### Backend
- **PHP 8+** - Server-side language
- **MySQL** - Database
- **JWT** - Authentication tokens
- **PDO** - Database abstraction

### Infrastructure
- **Vite** - Build tool
- **ESLint** - Code linting
- **Production Server** - https://mm4all.com

## 📁 Project Structure

```
mm4all-react/
├── src/
│   ├── components/
│   │   ├── ProtectedRoute.jsx      # Route protection
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.jsx         # Authentication state
│   ├── hooks/
│   │   └── useApi.js              # API management hooks
│   ├── pages/
│   │   ├── AdminLogin.jsx         # Login page
│   │   ├── AdminDashboardMain.jsx # Main dashboard
│   │   ├── ContentEditor.jsx      # Post editor
│   │   └── ...
│   ├── services/
│   │   └── apiService.js          # API client
│   └── ...
├── api/
│   ├── admin/
│   │   ├── auth/                  # Authentication endpoints
│   │   ├── users/                 # User management
│   │   ├── posts/                 # Content management
│   │   ├── categories/            # Category management
│   │   ├── tags/                  # Tag management
│   │   ├── media/                 # Media management
│   │   └── comments/              # Comment management
│   └── utils/
│       └── db.php                 # Database connection
└── ...
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js 16+
- PHP 8+
- MySQL 8+
- Web server (Apache/Nginx)

### Frontend Setup
```bash
# Clone repository
git clone <repository-url>
cd mm4all-react

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Backend Setup
```bash
# Database setup
mysql -u root -p
CREATE DATABASE mm4all_db;

# Import database schema (from ADMIN_SYSTEM_PROPOSAL.md)
mysql -u root -p mm4all_db < schema.sql

# Configure database connection
# Edit api/utils/db.php with your credentials

# Upload API files to server
# Ensure proper file permissions
```

### Environment Variables
```env
# .env file
VITE_API_URL=https://mm4all.com/api
VITE_JWT_SECRET_KEY=your_super_secret_jwt_key_here
VITE_APP_NAME=MM4All Admin
VITE_MAX_FILE_SIZE=10485760
VITE_DEBUG_MODE=false
```

## 🌐 Frontend Routes

### Admin Interface Routes
- `/admin/login` - Admin login page
- `/admin/dashboard` - Main admin dashboard (primary admin interface)
- `/admin` - Automatically redirects to `/admin/dashboard` for backward compatibility
- `/admin/create` - Create new post interface
- `/admin/edit/:id` - Edit existing post interface

### Route Protection
All admin routes (except `/admin/login`) are protected and require:
- Valid JWT authentication token
- Appropriate user permissions based on the action
- Automatic redirect to login page if unauthorized

## 🔐 Authentication Flow

### Login Process
1. User enters credentials on `/admin/login`
2. Frontend sends POST to `/api/admin/auth/login.php`
3. Backend validates credentials and returns JWT
4. Frontend stores token and redirects to dashboard
5. Subsequent requests include `Authorization: Bearer <token>`

### Permission System
```javascript
// Role hierarchy
const roles = {
  super_admin: ['all permissions'],
  admin: ['posts.*', 'categories.*', 'tags.*', 'media.*', 'comments.*', 'admin.*'],
  editor: ['posts.*', 'categories.*', 'tags.*', 'media.upload', 'comments.*'],
  moderator: ['posts.create', 'posts.read', 'tags.*', 'media.upload', 'comments.*']
};

// Usage in components
const { hasPermission } = useAuth();
if (hasPermission('posts.create')) {
  // Show create button
}
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/auth/login.php` | User login |
| POST | `/api/admin/auth/logout.php` | User logout |
| POST | `/api/admin/auth/refresh_token.php` | Refresh JWT |
| POST | `/api/admin/auth/change_password.php` | Change password |
| POST | `/api/admin/auth/verify_token.php` | Verify JWT |

### Posts Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/posts/get_posts.php` | List posts |
| GET | `/api/admin/posts/get_post.php?id={id}` | Get single post |
| POST | `/api/admin/posts/create_post.php` | Create new post |
| PUT | `/api/admin/posts/update_post.php` | Update post |
| DELETE | `/api/admin/posts/delete_post.php` | Delete post |

### Standard Response Format
```json
{
  "success": true|false,
  "message": "Operation result",
  "data": {
    // Response data
  },
  "error": "Error message (if success=false)"
}
```

## 🎨 UI Components

### Admin Dashboard Features
- **Responsive Design** - Works on desktop and mobile
- **Dark/Light Theme** - User preference support
- **Real-time Updates** - Live data refresh
- **Batch Operations** - Bulk actions for efficiency
- **Search & Filter** - Advanced content discovery
- **Drag & Drop** - Intuitive file uploads

### Key Components
```jsx
// Protected route wrapper
<ProtectedRoute requiredPermission="posts.create">
  <ContentEditor />
</ProtectedRoute>

// API data hook
const { data, loading, error } = useApiData('getPosts', { status: 'published' });

// CRUD operations
const { create, update, remove } = useCrudOperations('post');
```

## 🔒 Security Features

### Input Validation
- Client-side form validation
- Server-side sanitization
- SQL injection prevention
- XSS protection

### File Upload Security
- File type validation
- Size limits
- Malware scanning (planned)
- Secure file storage

### Access Control
- JWT token validation
- Permission-based UI rendering
- Route-level protection
- Activity logging

## 📊 Performance Optimizations

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Caching strategies
- Bundle size optimization

### Backend
- Database query optimization
- Response compression
- CDN integration (planned)
- Caching headers

## 🧪 Testing

### Frontend Tests
```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### API Testing
- Manual testing with Postman
- Automated API tests (planned)
- Load testing (planned)

## 🚀 Deployment

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Server Configuration
```apache
# .htaccess for React Router
RewriteEngine On
RewriteRule ^(?!api/).*$ /index.html [QSA,L]

# API CORS headers
Header set Access-Control-Allow-Origin "https://mm4all.com"
Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
```

## 📈 Future Enhancements

### Phase 2 Features
- [ ] Advanced content scheduling
- [ ] Email notifications
- [ ] Backup & restore system
- [ ] Advanced analytics
- [ ] Multi-language support

### Phase 3 Features
- [ ] Workflow approval system
- [ ] Advanced SEO tools
- [ ] A/B testing framework
- [ ] Integration with external services

## 🐛 Troubleshooting

### Common Issues

**Login fails with 401**
- Check database credentials in `api/utils/db.php`
- Verify JWT secret key matches between frontend/backend
- Ensure admin user exists and is active

**CORS errors**
- Configure server CORS headers
- Check API base URL in environment variables
- Verify request methods are allowed

**File upload fails**
- Check PHP upload limits (`upload_max_filesize`, `post_max_size`)
- Verify directory permissions
- Check file type validation

## 📞 Support

For technical support or questions:
- Check existing documentation
- Review error logs in browser console
- Check PHP error logs on server
- Contact development team

## 📄 License

This project is proprietary software for MM4All platform.

---

**Last Updated:** January 2025
**Version:** 1.0.0
**Maintained by:** MM4All Development Team
