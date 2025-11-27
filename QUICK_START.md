# MM4All Admin - Quick Start Guide

## 🚀 Getting Started

### 1. Database Setup
```bash
# Import the admin database schema
mysql -u your_user -p your_database < setup-admin.sql
```

### 2. Environment Configuration
1. Edit `.env` file with your settings
2. Update API URL if different from https://mm4all.com/api
3. Set a secure JWT secret key

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access Admin Panel
1. Open http://localhost:5173/admin/login
2. Login with default credentials:
   - Email: admin@mm4all.com
   - Password: admin123
3. **Important**: Change the password after first login!

### 5. Available Routes
- `/admin/login` - Login page
- `/admin/dashboard` - Main dashboard
- `/admin/create` - Create new post
- `/admin/edit/:id` - Edit existing post

## 🔧 Development

### API Endpoints
All API endpoints are located in the `/api/admin/` directory:
- Authentication: `/api/admin/auth/`
- Posts: `/api/admin/posts/`
- Users: `/api/admin/users/`
- Categories: `/api/admin/categories/`
- Tags: `/api/admin/tags/`
- Media: `/api/admin/media/`
- Comments: `/api/admin/comments/`

### Custom Hooks
- `useAuth()` - Authentication state
- `useApiData()` - API data fetching
- `usePaginatedData()` - Paginated data
- `useCrudOperations()` - CRUD operations

### Permission System
```javascript
const { hasPermission } = useAuth();

// Check permissions
if (hasPermission('posts.create')) {
  // Show create button
}
```

## 🐛 Troubleshooting

### Common Issues
1. **CORS errors**: Check server CORS configuration
2. **Login fails**: Verify database connection and admin user exists
3. **File uploads fail**: Check PHP upload limits and directory permissions

### Debug Mode
Set `VITE_DEBUG_MODE=true` in .env for detailed error logging.

## 📞 Support
Check the main README_ADMIN.md for detailed documentation.
