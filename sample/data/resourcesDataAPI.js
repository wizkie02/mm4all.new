import publicApiService from '../services/publicApiService';
import {
  PUBLISHING_STATES,
  CONTENT_TYPES,
  DIFFICULTY_LEVELS
} from '../services/apiService';
// Cache for API data
let cachedResources = null;
let cachedCategories = null;
let cachedAuthors = null;
let cachedConfig = null;
let isInitialized = false;
// Export constants from API service
export const publishingStates = PUBLISHING_STATES;
export const contentTypes = CONTENT_TYPES;
export const difficultyLevels = DIFFICULTY_LEVELS;
// Initialize data from API
export const initializeData = async () => {
  try {
    if (isInitialized) return true;
    // Load config first (if this method exists)
    if (!cachedConfig) {
      // cachedConfig = await apiService.getConfig(); // commented out if method doesn't exist
      }
    // Load categories
    if (!cachedCategories) {
      try {
        const categoriesResponse = await apiService.getCategories();
        if (categoriesResponse.success) {
          cachedCategories = categoriesResponse.data?.categories || {};
          } else {
          }
      } catch (error) {
        cachedCategories = {}; // Set empty fallback
      }
    }
    // Load authors (disabled - endpoint doesn't exist)  
    if (!cachedAuthors) {
      cachedAuthors = {}; // Use empty fallback
      /*
      try {
        const authorsResponse = await apiService.getAuthors();
        if (authorsResponse.success) {
          cachedAuthors = authorsResponse.data?.authors || {};
        } else {
          cachedAuthors = {};
        }
      } catch (error) {
        cachedAuthors = {}; // Set empty fallback
      }
      */
    }
    isInitialized = true;
    return true;
  } catch (error) {
    // Use fallback data if API fails
    isInitialized = true;
    return false;
  }
};
// Get categories (from API or cache)
export const categories = new Proxy({}, {
  get: function(target, prop) {
    if (cachedCategories && cachedCategories[prop]) {
      return cachedCategories[prop];
    }
    // Fallback data if API not available
    const fallback = {
      mindfulness: { id: "mindfulness", name: "Mindfulness", color: "#7a6bac" },
      sleep: { id: "sleep", name: "Sleep & Relaxation", color: "#4a90e2" },
      stress: { id: "stress", name: "Stress Management", color: "#f5a623" },
      breathing: { id: "breathing", name: "Breathing Exercises", color: "#7ed321" },
      workplace: { id: "workplace", name: "Workplace Wellness", color: "#d0021b" },
      beginner: { id: "beginner", name: "Beginner Guides", color: "#9013fe" }
    };
    return fallback[prop] || { id: prop, name: prop, color: "#7a6bac" };
  }
});
// Get authors (from API or cache)
export const authors = new Proxy({}, {
  get: function(target, prop) {
    if (cachedAuthors && cachedAuthors[prop]) {
      return cachedAuthors[prop];
    }
    // Fallback data
    const fallback = {
      1: { id: 1, name: "Dr. Sarah Chen", email: "sarah@mm4all.com" },
      2: { id: 2, name: "Michael Rodriguez", email: "michael@mm4all.com" },
      3: { id: 3, name: "Emma Thompson", email: "emma@mm4all.com" }
    };
    return fallback[prop] || { id: prop, name: "Unknown Author", email: "" };
  }
});
// Sample tags (can be extended to use API later)
export const tags = {
  meditation: { name: "Meditation", color: "#7a6bac" },
  anxiety: { name: "Anxiety Relief", color: "#f5a623" },
  focus: { name: "Focus & Concentration", color: "#4a90e2" },
  "sleep-aid": { name: "Sleep Aid", color: "#5b2c87" },
  quick: { name: "Quick Session", color: "#7ed321" },
  deep: { name: "Deep Practice", color: "#d0021b" },
  "beginner-friendly": { name: "Beginner Friendly", color: "#9013fe" },
  advanced: { name: "Advanced", color: "#b8e986" }
};
// API-based functions
export const getAllResources = async () => {
  try {
    // Disabled - endpoint doesn't exist
    return [];
    /*
    const response = await apiService.getResources({ status: 'published', limit: 100 });
    return response.data || [];
    */
  } catch (error) {
    return [];
  }
};

export const searchResources = async (query) => {
  try {
    // Disabled - endpoint doesn't exist
    return [];
    /*
    const response = await apiService.getResources({ search: query, limit: 50 });
    return response.data || [];
    */
  } catch (error) {
    return [];
  }
};

export const filterResourcesByStatus = async (status) => {
  try {
    // Disabled - endpoint doesn't exist
    return [];
    /*
    const response = await apiService.getResources({ status, limit: 100 });
    return response.data || [];
    */
  } catch (error) {
    return [];
  }
};

export const filterResourcesByCategory = async (category) => {
  try {
    // Disabled - endpoint doesn't exist
    return [];
    /*
    const response = await apiService.getResources({ category, limit: 100 });
    return response.data || [];
    */
  } catch (error) {
    return [];
  }
};

export const getTopPerformingResources = async (limit = 5) => {
  try {
    // Disabled - endpoint doesn't exist
    return [];
    /*
    return await apiService.getTopResources(limit);
    */
  } catch (error) {
    return [];
  }
};
export const getCategoryStats = async () => {
  try {
    return await apiService.getCategoryStats();
  } catch (error) {
    return {};
  }
};
export const getAuthorById = (id) => {
  return authors[id] || { id, name: "Unknown Author", email: "" };
};
// SEO validation function
export const validateSEO = (resource) => {
  let score = 0;
  const issues = [];
  // Title check
  if (resource.seoTitle || resource.title) {
    const title = resource.seoTitle || resource.title;
    if (title.length >= 30 && title.length <= 60) {
      score += 25;
    } else {
      issues.push('Title should be 30-60 characters');
    }
  } else {
    issues.push('Missing title');
  }
  // Description check
  if (resource.seoDescription || resource.excerpt) {
    const desc = resource.seoDescription || resource.excerpt;
    if (desc.length >= 120 && desc.length <= 160) {
      score += 25;
    } else {
      issues.push('Description should be 120-160 characters');
    }
  } else {
    issues.push('Missing description');
  }
  // Keywords check
  if (resource.seoKeywords) {
    score += 20;
  } else {
    issues.push('Missing keywords');
  }
  // Content length check
  if (resource.content && resource.content.length > 300) {
    score += 15;
  } else {
    issues.push('Content too short');
  }
  // Featured image check
  if (resource.featuredImage) {
    score += 15;
  } else {
    issues.push('Missing featured image');
  }
  return { score, issues };
};
// Export fallback data for offline use
export const fallbackResources = [
  {
    id: 1,
    title: "Mindfulness for Beginners: A Complete Guide",
    content: "A comprehensive introduction to mindfulness meditation...",
    excerpt: "Learn the basics of mindfulness meditation with this comprehensive beginner guide.",
    category: "beginner",
    content_type: "guide",
    difficulty_level: "beginner",
    status: "published",
    author_name: "Dr. Sarah Chen",
    author_id: 1,
    featured_image: "/images/blog/mindfulness-beginners.jpg",
    reading_time: 8,
    seo_title: "Mindfulness for Beginners - Complete Guide | MM4All",
    seo_description: "Learn mindfulness meditation from scratch with our complete beginner guide.",
    seo_keywords: "mindfulness, meditation, beginners, guide",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    published_at: "2024-01-15T10:00:00Z",
    analytics: {
      views: 1547,
      downloads: 234,
      avg_rating: 4.8,
      total_ratings: 156
    }
  },
  {
    id: 2,
    title: "5-Minute Breathing Exercise for Stress Relief",
    content: "This simple breathing exercise can help you manage stress...",
    excerpt: "A quick and effective breathing technique to reduce stress and anxiety instantly.",
    category: "breathing",
    content_type: "exercise",
    difficulty_level: "beginner",
    status: "published",
    author_name: "Michael Rodriguez",
    author_id: 2,
    featured_image: "/images/blog/breathing-stress.jpg",
    reading_time: 3,
    seo_title: "5-Minute Breathing Exercise for Instant Stress Relief",
    seo_description: "Learn a powerful 5-minute breathing technique to reduce stress and anxiety.",
    seo_keywords: "breathing exercise, stress relief, anxiety",
    created_at: "2024-01-10T14:30:00Z",
    updated_at: "2024-01-10T14:30:00Z",
    published_at: "2024-01-10T14:30:00Z",
    analytics: {
      views: 892,
      downloads: 145,
      avg_rating: 4.6,
      total_ratings: 89
    }
  },
  {
    id: 3,
    title: "Sleep Meditation: Deep Rest for Better Sleep",
    content: "A soothing guided meditation to help you fall asleep...",
    excerpt: "A soothing sleep meditation to help you fall asleep faster and sleep more deeply.",
    category: "sleep",
    content_type: "meditation",
    difficulty_level: "beginner",
    status: "published",
    author_name: "Emma Thompson",
    author_id: 3,
    featured_image: "/images/blog/sleep-meditation.jpg",
    reading_time: 12,
    seo_title: "Sleep Meditation for Deep Rest and Better Sleep Quality",
    seo_description: "Improve your sleep quality with our guided sleep meditation.",
    seo_keywords: "sleep meditation, insomnia, deep sleep, relaxation",
    created_at: "2024-01-05T20:00:00Z",
    updated_at: "2024-01-05T20:00:00Z",
    published_at: "2024-01-05T20:00:00Z",
    analytics: {
      views: 1203,
      downloads: 198,
      avg_rating: 4.9,
      total_ratings: 134
    }
  }
];
// Initialize data when module is imported
// Commented out to prevent auto-initialization on import
// initializeData();
// Backward compatibility - sync functions that return cached or fallback data
export const resources = fallbackResources;
// Helper function to get all resources (sync version for compatibility)
export const getAllResourcesSync = () => {
  if (cachedResources) {
    return cachedResources;
  }
  return fallbackResources;
};
