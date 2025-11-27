// Public API Service - No Authentication Required
// This service handles all public-facing API calls that don't require admin authentication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/mm4all_website_source/mm4all-react/api';

class PublicApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
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
        throw new Error(data.error || data.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  // ========== PUBLIC POSTS APIs ==========
  async getPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`admin/posts/get_posts.php?${queryString}`);
  }

  async getPost(id) {
    return this.request(`admin/posts/get_posts.php?id=${id}`);
  }

  async getPostBySlug(slug) {
    return this.request(`admin/posts/get_posts.php?slug=${slug}`);
  }

  async searchPosts(query, params = {}) {
    const searchParams = new URLSearchParams({ search: query, ...params }).toString();
    return this.request(`admin/posts/get_posts.php?${searchParams}`);
  }

  // ========== PUBLIC CATEGORIES APIs ==========
  async getCategories() {
    return this.request('admin/categories/get_categories.php');
  }

  async getCategory(id) {
    return this.request(`admin/categories/get_categories.php?id=${id}`);
  }

  async getCategoryPosts(categoryId, params = {}) {
    const queryString = new URLSearchParams({ category: categoryId, ...params }).toString();
    return this.request(`/admin/posts/get_posts.php?${queryString}`);
  }

  // ========== PUBLIC TAGS APIs ==========
  async getTags() {
    return this.request('tags.php');
  }

  async getTag(id) {
    return this.request(`tags.php?id=${id}`);
  }

  async getTagPosts(tagId, params = {}) {
    const queryString = new URLSearchParams({ tag: tagId, ...params }).toString();
    return this.request(`/admin/posts/get_posts.php?${queryString}`);
  }

  // ========== PUBLIC SITE CONFIG ==========
  async getSiteConfig() {
    return this.request('config.php');
  }

  // ========== PUBLIC CONTACT FORM ==========
  async submitContactForm(data) {
    return this.request('contact.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ========== PUBLIC NEWSLETTER ==========
  async subscribeNewsletter(email) {
    return this.request('newsletter.php', {
      method: 'POST',
      body: JSON.stringify({ email, action: 'subscribe' }),
    });
  }

  // ========== PUBLIC RESOURCES APIs ==========
  async getResources(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`resources.php?${queryString}`);
  }

  async getResource(id) {
    return this.request(`resources.php?id=${id}`);
  }

  async getResourceBySlug(slug) {
    return this.request(`resources.php?slug=${slug}`);
  }

  // ========== PUBLIC MEDITATION APIs ==========
  async getMeditations(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`meditations.php?${queryString}`);
  }

  async getMeditation(id) {
    return this.request(`meditations.php?id=${id}`);
  }

  // ========== PUBLIC SOUNDS APIs ==========
  async getSounds(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`sounds.php?${queryString}`);
  }

  async getSound(id) {
    return this.request(`sounds.php?id=${id}`);
  }
}

export default new PublicApiService();
