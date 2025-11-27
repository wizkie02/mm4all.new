// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/mm4all_website_source/mm4all-react/api';
// Constants for API data
export const PUBLISHING_STATES = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};
export const CONTENT_TYPES = {
  ARTICLE: 'article',
  MEDITATION: 'meditation',
  GUIDE: 'guide',
  NEWS: 'news'
};
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EDITOR: 'editor',
  MODERATOR: 'moderator'
};
export const STATUS_TYPES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};
// API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('admin_token');
  }
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('admin_token', token);
    } else {
      localStorage.removeItem('admin_token');
    }
  }

  setRefreshToken(refreshToken) {
    if (refreshToken) {
      localStorage.setItem('admin_refresh_token', refreshToken);
    } else {
      localStorage.removeItem('admin_refresh_token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('admin_token');
  }

  getRefreshToken() {
    return localStorage.getItem('admin_refresh_token');
  }
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/${endpoint}`;
    const config = {
      headers: {},
      ...options,
    };

    // Only add Content-Type for POST/PUT/PATCH requests to avoid preflight
    if (options.method && ['POST', 'PUT', 'PATCH'].includes(options.method.toUpperCase())) {
      config.headers['Content-Type'] = 'application/json';
    }

    // Add JWT token if available
    const token = this.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    try {
      const response = await fetch(url, config);
      
      // Check if response is empty or has no content
      const responseText = await response.text();
      let data;
      
      try {
        // Try to parse as JSON if there's content
        data = responseText ? JSON.parse(responseText) : {};
      } catch (jsonError) {
        // If JSON parsing fails, create a basic error response
        data = {
          success: false,
          error: 'Invalid response format',
          raw_response: responseText
        };
      }
      
      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401) {
          this.setToken(null);
          // Don't force redirect here, let React handle routing
          // window.location.href = '/admin/login';
          throw new Error('Authentication expired');
        }
        throw new Error(data.error || data.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  // ========== AUTH APIs ==========
  async login(email, password, rememberMe = false) {
    const response = await this.request('admin/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ email, password, remember_me: rememberMe }),
    });
    if (response.success && response.access_token) {
      this.setToken(response.access_token);
      // Also save refresh token if provided
      if (response.refresh_token) {
        this.setRefreshToken(response.refresh_token);
      }
    }
    return response;
  }
  async logout() {
    try {
      await this.request('admin/auth/logout.php', {
        method: 'POST',
      });
    } finally {
      this.setToken(null);
      this.setRefreshToken(null);
    }
  }
  
  async changePassword(currentPassword, newPassword) {
    return this.request('admin/auth/change_password.php', {
      method: 'POST',
      body: JSON.stringify({ 
        current_password: currentPassword, 
        new_password: newPassword 
      }),
    });
  }
  async verifyToken() {
    return this.request('admin/auth/verify_token.php', {
      method: 'POST',
    });
  }

  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.request('admin/auth/refresh_token.php', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.success && response.access_token) {
        this.setToken(response.access_token);
        // Update refresh token if new one is provided
        if (response.refresh_token) {
          this.setRefreshToken(response.refresh_token);
        }
        return response;
      }

      return response;
    } catch (error) {
      throw error;
    }
  }
  // Resources API (disabled - endpoints don't exist)
  /*
  async getResources(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`resources.php?${queryString}`);
  }
  async getResource(id) {
    return this.request(`resources.php?id=${id}`);
  }
  async createResource(data) {
    return this.request('resources.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  async updateResource(data) {
    return this.request('resources.php', {
      method: 'POST',
      body: JSON.stringify({ ...data, action: 'update' }),
    });
  }
  async deleteResource(id) {
    return this.request(`resources.php?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete' }),
    });
  }
  async searchResources(query, page = 1, limit = 10) {
    return this.getResources({ search: query, page, limit });
  }
  */
  // Categories API
  async getCategories() {
    return this.request('admin/categories/get_categories.php');
  }
  async getCategoryStats() {
    return this.request('admin/categories/get_categories.php?stats=1');
  }
  async createCategory(data) {
    return this.request('admin/categories/get_categories.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  async updateCategory(data) {
    return this.request('admin/categories/get_categories.php', {
      method: 'POST',
      body: JSON.stringify({ ...data, action: 'update' }),
    });
  }
  async deleteCategory(id) {
    return this.request(`admin/categories/get_categories.php?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete' }),
    });
  }
  // Authors API (disabled - endpoints don't exist)
  /*
  async getAuthors() {
    return this.request('authors.php');
  }
  async getAuthor(id) {
    return this.request(`authors.php?id=${id}`);
  }
  async createAuthor(data) {
    return this.request('authors.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  async updateAuthor(data) {
    return this.request('authors.php', {
      method: 'POST',
      body: JSON.stringify({ ...data, action: 'update' }),
    });
  }
  async deleteAuthor(id) {
    return this.request(`authors.php?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete' }),
    });
  }
  */
  // Analytics API (disabled - endpoints don't exist)
  /*
  async getStats() {
    return this.request('analytics.php');
  }
  async getTopResources(limit = 5) {
    return this.request(`analytics.php?top=1&limit=${limit}`);
  }
  */
  // Config API
  async getConfig() {
    return this.request('config.php');
  }
  // ========== ADMIN USERS APIs ==========
  async getAdminUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`admin/users/get_users.php?${queryString}`);
  }
  async getAdminUser(id) {
    return this.request(`admin/users/get_user.php?id=${id}`);
  }
  async createAdminUser(data) {
    return this.request('admin/users/create_user.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  async updateAdminUser(id, data) {
    return this.request('admin/users/update_user.php', {
      method: 'POST',
      body: JSON.stringify({ id, ...data, action: 'update' }),
    });
  }
  // Change own password (self password change) - uses current_password verification
  async changeOwnPassword(data) {
    return this.request('admin/users/change_password.php', {
      method: 'POST',
      body: JSON.stringify({
        current_password: data.current_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password
      }),
    });
  }
  async deleteAdminUser(id) {
    return this.request(`admin/users/delete_user.php?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete' }),
    });
  }
  async updateAdminUserStatus(id, status) {
    return this.request('admin/users/update_user_status.php', {
      method: 'POST',
      body: JSON.stringify({ id, status, action: 'update_status' }),
    });
  }
  // ========== POSTS APIs ==========
  async getPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`admin/posts/get_posts.php?${queryString}`);
  }
  async getPost(id) {
    return this.request(`admin/posts/get_post.php?id=${id}`);
  }
  async getPostBySlug(slug) {
    return this.request(`admin/posts/get_post.php?slug=${slug}`);
  }
  async createPost(data) {
    return this.request('admin/posts/create_post.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  async updatePost(id, data) {
    return this.request(`admin/posts/update_post.php?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ ...data, action: 'update' }),
    });
  }
  async deletePost(id) {
    return this.request(`admin/posts/delete_post.php?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete' }),
    });
  }
  async updatePostStatus(id, status) {
    return this.request('admin/posts/update_post_status.php', {
      method: 'POST',
      body: JSON.stringify({ id, status, action: 'update_status' }),
    });
  }
  // ========== CATEGORIES APIs ==========
  async getCategories(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`admin/categories/get_categories.php?${queryString}`);
  }
  async createCategory(data) {
    return this.request('admin/categories/create_category.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  async updateCategory(id, data) {
    return this.request('admin/categories/update_category.php', {
      method: 'POST',
      body: JSON.stringify({ id, ...data, action: 'update' }),
    });
  }
  async deleteCategory(id) {
    return this.request(`admin/categories/delete_category.php?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete' }),
    });
  }
  // ========== TAGS APIs ==========
  async getTags(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`admin/tags/get_tags.php?${queryString}`);
  }
  async createTag(data) {
    return this.request('admin/tags/create_tag.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  async updateTag(id, data) {
    return this.request('admin/tags/update_tag.php', {
      method: 'POST',
      body: JSON.stringify({ id, ...data, action: 'update' }),
    });
  }
  async deleteTag(id) {
    return this.request(`admin/tags/delete_tag.php?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete' }),
    });
  }
  // ========== MEDIA APIs (DISABLED) ==========
  /*
  async getMedia(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`admin/media/get_media.php?${queryString}`);
  }
  async uploadMedia(formData) {
    const token = this.getToken();
    const response = await fetch(`${this.baseURL}/admin/media/upload_media.php`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData, // FormData for file upload
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }
    return data;
  }
  async updateMedia(id, data) {
    return this.request('admin/media/update_media.php', {
      method: 'POST',
      body: JSON.stringify({ id, ...data, action: 'update' }),
    });
  }
  async deleteMedia(id) {
    return this.request(`admin/media/delete_media.php?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete' }),
    });
  }
  async bulkDeleteMedia(ids) {
    return this.request('admin/media/bulk_delete_media.php', {
      method: 'POST',
      body: JSON.stringify({ ids, action: 'bulk_delete' }),
    });
  }
  */
  // ========== COMMENTS APIs (DISABLED) ==========
  /*
  async getComments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`admin/comments/get_comments.php?${queryString}`);
  }
  async approveComment(id) {
    return this.request('admin/comments/approve_comment.php', {
      method: 'POST',
      body: JSON.stringify({ id, action: 'approve' }),
    });
  }
  async rejectComment(id) {
    return this.request('admin/comments/reject_comment.php', {
      method: 'POST',
      body: JSON.stringify({ id, action: 'reject' }),
    });
  }
  async deleteComment(id) {
    return this.request(`admin/comments/delete_comment.php?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete' }),
    });
  }
  */
  // ========== DASHBOARD & ANALYTICS APIs ==========
  async getDashboardStats() {
    return this.request('admin/dashboard/get_stats.php');
  }
  async getAnalytics(type, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`admin/analytics/${type}.php?${queryString}`);
  }
  // ========== LEGACY RESOURCES APIs (disabled - endpoints don't exist) ==========
  /*
  async getResources(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`resources.php?${queryString}`);
  }
  async getResource(id) {
    return this.request(`resources.php?id=${id}`);
  }
  async createResource(data) {
    return this.request('resources.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  async updateResource(id, data) {
    return this.request('resources.php', {
      method: 'POST', 
      body: JSON.stringify({ id, ...data, action: 'update' }),
    });
  }
  async deleteResource(id) {
    return this.request('resources.php', {
      method: 'POST',
      body: JSON.stringify({ id, action: 'delete' }),
    });
  }
  */
}
export default new ApiService();
