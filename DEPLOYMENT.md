# Hướng dẫn Deploy MM4All lên cPanel

## Bước 1: Chuẩn bị Database

### 1.1 Tạo Database trên cPanel
1. Đăng nhập cPanel → **MySQL Databases**
2. Tạo database mới: `mm4all_db` (sẽ có prefix theo username)
3. Tạo user mới cho database với password mạnh
4. Gán quyền **ALL PRIVILEGES** cho user này với database

### 1.2 Import Schema
1. Vào **phpMyAdmin**
2. Chọn database vừa tạo
3. Vào tab **Import**
4. Upload file `api/database/schema.sql`
5. Click **Go** để import

## Bước 2: Upload API Files

### 2.1 Cấu trúc thư mục trên hosting
```
public_html/
├── api/
│   ├── config/
│   │   └── database.php
│   ├── models/
│   │   ├── Resource.php
│   │   ├── Category.php
│   │   └── Author.php
│   ├── endpoints/
│   │   ├── resources.php
│   │   ├── categories.php
│   │   ├── authors.php
│   │   ├── analytics.php
│   │   └── config.php
│   └── database/
│       └── schema.sql
├── index.html (React build files)
├── static/
└── assets/
```

### 2.2 Upload Files
1. Sử dụng **File Manager** hoặc **FTP**
2. Upload toàn bộ thư mục `api` vào `public_html/`
3. Đảm bảo quyền file: 644 cho files, 755 cho folders

## Bước 3: Cấu hình Database Connection

### 3.1 Sửa file api/config/database.php
```php
<?php
class Database {
    private $host = "localhost"; 
    private $db_name = "your_cpanel_username_mm4all_db"; // Thay đổi
    private $username = "your_cpanel_username_dbuser";   // Thay đổi
    private $password = "your_database_password";        // Thay đổi
    public $conn;
    // ... rest of the code
}
```

**Lưu ý:** Thay đổi các giá trị sau:
- `your_cpanel_username_mm4all_db`: Tên database đầy đủ
- `your_cpanel_username_dbuser`: Username database
- `your_database_password`: Password database

## Bước 4: Test API

### 4.1 Kiểm tra endpoints
Truy cập các URL sau để test:

1. **Test database connection:**
   ```
   https://yourdomain.com/api/endpoints/categories.php
   ```

2. **Test resources API:**
   ```
   https://yourdomain.com/api/endpoints/resources.php
   ```

3. **Test analytics:**
   ```
   https://yourdomain.com/api/endpoints/analytics.php
   ```

### 4.2 Expected Response
Nếu thành công, bạn sẽ thấy JSON response như:
```json
{
  "mindfulness": {
    "id": "mindfulness",
    "name": "Mindfulness",
    "color": "#7a6bac"
  }
}
```

## Bước 5: Deploy React App

### 5.1 Cấu hình API URL
1. Copy `.env.example` thành `.env`
2. Sửa API URL:
   ```
   REACT_APP_API_URL=https://yourdomain.com/api/endpoints
   ```

### 5.2 Build và Deploy
```bash
# Build production
npm run build

# Upload dist files
# Upload tất cả files trong thư mục dist/ vào public_html/
```

### 5.3 Cấu trúc cuối cùng
```
public_html/
├── api/           (API files)
├── index.html     (React app)
├── static/        (React assets)
├── assets/        (Images, etc.)
└── .htaccess      (URL rewriting)
```

## Bước 6: Cấu hình .htaccess (cho React Router)

Tạo file `.htaccess` trong `public_html/`:
```apache
RewriteEngine On
RewriteBase /

# API routes - không rewrite
RewriteCond %{REQUEST_URI} ^/api/ [NC]
RewriteRule ^ - [L]

# React Router - rewrite all other routes to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

## Bước 7: Kiểm tra hoạt động

### 7.1 Test trang web
1. Truy cập `https://yourdomain.com`
2. Kiểm tra trang Resources
3. Thử truy cập Admin Dashboard: `https://yourdomain.com/admin`

### 7.2 Debug nếu có lỗi
1. **Kiểm tra Console:** Mở F12 → Console để xem lỗi JavaScript
2. **Kiểm tra Network:** Xem API calls có thành công không
3. **Kiểm tra cPanel Error Logs:** cPanel → Error Logs

## Bước 8: Bảo mật (Tuỳ chọn)

### 8.1 Bảo vệ Admin Dashboard
Tạo file `.htaccess` trong thư mục `admin/`:
```apache
AuthType Basic
AuthName "Admin Area"
AuthUserFile /home/username/.htpasswd
Require valid-user
```

### 8.2 Hạn chế CORS
Sửa header CORS trong API files:
```php
header("Access-Control-Allow-Origin: https://yourdomain.com");
```

## Troubleshooting

### Lỗi thường gặp:

1. **Database connection failed**
   - Kiểm tra thông tin database trong `database.php`
   - Đảm bảo user có quyền truy cập database

2. **404 Not Found cho API**
   - Kiểm tra đường dẫn files API
   - Đảm bảo quyền file đúng (644)

3. **CORS Error**
   - Kiểm tra header CORS trong API files
   - Đảm bảo domain được phép truy cập

4. **React Router không hoạt động**
   - Kiểm tra file `.htaccess`
   - Đảm bảo mod_rewrite được enable

5. **Admin Dashboard trắng**
   - Kiểm tra Console errors
   - Đảm bảo API endpoints hoạt động
   - Kiểm tra file `resourcesData.js` import đúng

## Liên hệ Support

Nếu gặp vấn đề, hãy kiểm tra:
1. cPanel Error Logs
2. Browser Console (F12)
3. Network tab trong DevTools
4. API response bằng cách truy cập trực tiếp endpoint
