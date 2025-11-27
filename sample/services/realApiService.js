// Real API Service for testing actual endpoints
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mm4all.com/api';
class RealApiService {
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
  getToken() {
    return this.token || localStorage.getItem('admin_token');
  }
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for CORS with credentials
      ...options,
    };
    // Add JWT token if available
    const token = this.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null);
          throw new Error('Authentication expired');
        }
        throw new Error(data.error || data.message || 'API request failed');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  // Test Authentication
  async testLogin(email = 'admin@mm4all.com', password = 'admin123') {
    try {
      const response = await this.request('admin/auth/login.php', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (response.success && response.access_token) {
        this.setToken(response.access_token);
        }
      return response;
    } catch (error) {
      throw error;
    }
  }
  // Posts API
  async getPosts() {
    return this.request('/admin/posts/get_posts.php');
  }
  // Categories API  
  async getCategories() {
    return this.request('admin/categories/get_categories.php');
  }
  // Tags API
  async getTags() {
    return this.request('admin/tags/get_tags.php');
  }
  // Comments API
  async getComments() {
    return this.request('admin/comments/get_comments.php');
  }
  // Media API
  async getMedia() {
    return this.request('admin/media/get_media.php');
  }
  // Users API (might be empty)
  async getUsers() {
    try {
      return await this.request('admin/users/get_users.php');
    } catch (error) {
      // Alternative: try to get admin users from a different endpoint
      // For now, return empty result
      return { success: false, error: error.message };
    }
  }
  // Test all endpoints
  async testAllEndpoints() {
    const results = {
      posts: null,
      categories: null,
      tags: null,
      comments: null,
      media: null,
      users: null,
      errors: []
    };
    try {
      results.posts = await this.getPosts();
    } catch (error) {
      results.errors.push({ endpoint: 'posts', error: error.message });
    }
    try {
      results.categories = await this.getCategories();
    } catch (error) {
      results.errors.push({ endpoint: 'categories', error: error.message });
    }
    try {
      results.tags = await this.getTags();
    } catch (error) {
      results.errors.push({ endpoint: 'tags', error: error.message });
    }
    try {
      results.comments = await this.getComments();
    } catch (error) {
      results.errors.push({ endpoint: 'comments', error: error.message });
    }
    try {
      results.media = await this.getMedia();
    } catch (error) {
      results.errors.push({ endpoint: 'media', error: error.message });
    }
    try {
      results.users = await this.getUsers();
    } catch (error) {
      results.errors.push({ endpoint: 'users', error: error.message });
    }
    return results;
  }
  // Generate dashboard stats from real data
  generateStats(posts = [], categories = [], tags = [], comments = [], media = []) {
    const totalPosts = posts.length;
    const publishedPosts = posts.filter(p => p.status === 'published').length;
    const draftPosts = posts.filter(p => p.status === 'draft').length;
    const pendingPosts = posts.filter(p => p.status === 'pending').length;
    const totalViews = posts.reduce((sum, post) => {
      return sum + (parseInt(post.views) || 0);
    }, 0);
    const totalComments = comments.length;
    const approvedComments = comments.filter(c => c.status === 'approved').length;
    const pendingComments = comments.filter(c => c.status === 'pending').length;
    return {
      posts: {
        total: totalPosts,
        published: publishedPosts,
        draft: draftPosts,
        pending: pendingPosts,
        totalViews
      },
      categories: {
        total: categories.length
      },
      tags: {
        total: tags.length
      },
      comments: {
        total: totalComments,
        approved: approvedComments,
        pending: pendingComments
      },
      media: {
        total: media.length
      }
    };
  }
}
export default new RealApiService();
