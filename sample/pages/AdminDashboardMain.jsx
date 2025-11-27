import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import NotionEditor from '../components/editor/NotionEditor';
import AuthNotification from '../components/AuthNotification';
import { resolveThumbnail, resolveThumbnailSync } from '../utils/thumbnailResolver';
import {
  FaChartBar, FaFileAlt, FaUsers, FaTags,
  FaPlus, FaEdit, FaTrash, FaEye, FaHome, FaSignOutAlt,
  FaSpinner, FaSave, FaTimes, FaUpload, FaCheck, FaUser, FaImage, FaBars, FaKey
} from 'react-icons/fa';

// Utility function to generate slug from title
const generateSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
};

const AdminDashboardMain = () => {
  const { user, logout, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  // Data states
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  // Pagination states
  const [pagination, setPagination] = useState({
    posts: { page: 1, totalPages: 1, total: 0 },
    users: { page: 1, totalPages: 1, total: 0 }
  });
  // Cache states to avoid duplicate API calls
  const [dataLoaded, setDataLoaded] = useState({
    posts: false,
    users: false,
    categories: false,
    tags: false
  });

  // Loading states for individual tabs
  const [tabLoading, setTabLoading] = useState({
    posts: false,
    users: false,
    categories: false,
    tags: false
  });
  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishData, setPublishData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [previewThumbnail, setPreviewThumbnail] = useState(null);

  // Bulk selection states
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [forceRender, setForceRender] = useState(0);

  // Clear selection when posts change
  useEffect(() => {
    setSelectedPosts([]);
    setShowBulkActions(false);
  }, [posts]);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [modalType, setModalType] = useState(''); // 'post', 'user', 'category', 'tag'
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  
  // Notification system
  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    const newNotification = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Lazy loading function for individual tabs
  const loadTabData = async (tabName) => {
    // Don't load if already loaded or currently loading
    if (dataLoaded[tabName] || tabLoading[tabName]) {
      return;
    }

    setTabLoading(prev => ({ ...prev, [tabName]: true }));

    try {
      switch (tabName) {
        case 'posts':
          if (!dataLoaded.posts) {
            const response = await apiService.getPosts();
            if (response.success) {
              setPosts(response.data || []);
              setDataLoaded(prev => ({ ...prev, posts: true }));
            }
          }
          break;

        case 'users':
          if (!dataLoaded.users) {
            const response = await apiService.getAdminUsers();
            if (response.success) {
              setUsers(response.data || []);
              setDataLoaded(prev => ({ ...prev, users: true }));
            }
          }
          break;

        case 'categories':
          if (!dataLoaded.categories) {
            const response = await apiService.getCategories();
            if (response.success) {
              setCategories(response.data || []);
              setDataLoaded(prev => ({ ...prev, categories: true }));
            }
          }
          break;

        case 'tags':
          if (!dataLoaded.tags) {
            const response = await apiService.getTags();
            if (response.success) {
              setTags(response.data || []);
              setDataLoaded(prev => ({ ...prev, tags: true }));
            }
          }
          break;
      }
    } catch (error) {
      showNotification(`Failed to load ${tabName}: ${error.message}`, 'error');
    } finally {
      setTabLoading(prev => ({ ...prev, [tabName]: false }));
    }
  };

  // Confirmation dialog system
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null
  });

  const showConfirmDialog = (title, message, onConfirm, onCancel = null) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
      onCancel
    });
  };

  const hideConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
      onCancel: null
    });
  };

  useEffect(() => {
    // Only load dashboard data once on mount
    loadDashboardData();

    // Cleanup function to reset states when component unmounts
    return () => {
      setShowCreateModal(false);
      setShowEditModal(false);
      setShowPublishModal(false);
      setShowUserDropdown(false);
      setIsSubmitting(false);
      setLoading(false);
      setPublishData(null);
    };
  }, []);

  useEffect(() => {
    // Only load tab-specific data when switching tabs
    if (activeTab !== 'dashboard') {
      loadTabData(activeTab);
    }
  }, [activeTab]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('[data-dropdown]')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load essential data for dashboard stats: posts, categories, and tags
      const promises = [];

      // Load posts (needed for dashboard stats)
      if (!dataLoaded.posts) {
        promises.push(
          apiService.getPosts({ page: 1, limit: 20 }).then(response => {
            if (response.success) {
              setPosts(response.data || []);
              setDataLoaded(prev => ({ ...prev, posts: true }));
            }
          }).catch(err => {})
        );
      }

      // Load categories (lightweight, needed for stats)
      if (!dataLoaded.categories) {
        promises.push(
          apiService.getCategories().then(response => {
            if (response.success) {
              setCategories(response.data || []);
              setDataLoaded(prev => ({ ...prev, categories: true }));
            }
          }).catch(err => {})
        );
      }

      // Load tags (lightweight, needed for stats)
      if (!dataLoaded.tags) {
        promises.push(
          apiService.getTags().then(response => {
            if (response.success) {
              setTags(response.data || []);
              setDataLoaded(prev => ({ ...prev, tags: true }));
            }
          }).catch(err => {})
        );
      }

      // Load users (needed for dashboard stats)
      if (!dataLoaded.users) {
        promises.push(
          apiService.getAdminUsers().then(response => {
            if (response.success) {
              setUsers(response.data || []);
              setDataLoaded(prev => ({ ...prev, users: true }));
            }
          }).catch(err => {})
        );
      }

      // Wait for all dashboard data to load
      await Promise.all(promises);

    } catch (error) {
      setError('Failed to load dashboard data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    await logout();
  };

  // Debounce state to prevent rapid API calls
  const [lastRefreshTime, setLastRefreshTime] = useState({});
  const REFRESH_DEBOUNCE_MS = 1000; // 1 second debounce

  // Refresh functions for specific data types
  const refreshPosts = useCallback(async () => {
    const now = Date.now();
    if (tabLoading.posts || (lastRefreshTime.posts && now - lastRefreshTime.posts < REFRESH_DEBOUNCE_MS)) {
      return; // Prevent concurrent requests or rapid calls
    }

    setLastRefreshTime(prev => ({ ...prev, posts: now }));

    try {
      setTabLoading(prev => ({ ...prev, posts: true }));
      const postsResponse = await apiService.getPosts({ page: 1, limit: 20 });
      if (postsResponse.success) {
        const postsData = postsResponse.data || [];
        setPosts(postsData);
        setPagination(prev => ({
          ...prev,
          posts: {
            page: 1,
            totalPages: postsResponse.totalPages || 1,
            total: postsResponse.total || postsData.length
          }
        }));
        setDataLoaded(prev => ({ ...prev, posts: true }));
        showNotification('Posts refreshed successfully!');
      } else {
        showNotification('Failed to refresh posts: ' + (postsResponse.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      showNotification('Error refreshing posts: ' + error.message, 'error');
    } finally {
      setTabLoading(prev => ({ ...prev, posts: false }));
    }
  }, [tabLoading.posts, lastRefreshTime.posts, showNotification]);

  // Pagination function
  const loadPage = useCallback(async (type, page) => {
    if (loading) return;

    try {
      setLoading(true);
      let response;

      switch (type) {
        case 'posts':
          response = await apiService.getPosts({ page, limit: 20 });
          if (response.success) {
            setPosts(response.data || []);
            setPagination(prev => ({
              ...prev,
              posts: {
                page,
                totalPages: response.totalPages || 1,
                total: response.total || 0
              }
            }));
          }
          break;
        // Add other types as needed
      }
    } catch (error) {
      showNotification(`Error loading ${type}: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [loading, showNotification]);

  // Pagination component
  const renderPagination = (type) => {
    const paginationData = pagination[type];
    if (!paginationData || paginationData.totalPages <= 1) return null;

    const { page, totalPages, total } = paginationData;

    return (
      <PaginationContainer>
        <PaginationButton
          disabled={page <= 1}
          onClick={() => loadPage(type, page - 1)}
        >
          Previous
        </PaginationButton>

        <PaginationInfo>
          Page {page} of {totalPages} ({total} total)
        </PaginationInfo>

        <PaginationButton
          disabled={page >= totalPages}
          onClick={() => loadPage(type, page + 1)}
        >
          Next
        </PaginationButton>
      </PaginationContainer>
    );
  };

  // Handle publish request from NotionEditor
  const handlePublishRequest = async (data) => {
    // Store the data and open modal - no save required
    const publishDataToSet = {
      ...selectedItem,
      ...formData,
      content: data.content || formData.content || '',
      title: data.title || formData.title || '',
      // Ensure we have the latest data from editor
      ...data
    };

    setPublishData(publishDataToSet);

    // Generate preview thumbnail
    const previewThumb = resolveThumbnailSync({
      manualThumbnail: '',
      content: publishDataToSet.content,
      defaultThumbnail: '/images/default-post-thumbnail.svg'
    });
    setPreviewThumbnail(previewThumb);

    setShowPublishModal(true);
  };

  // Handle thumbnail input change for preview
  const handleThumbnailInputChange = async (e) => {
    const manualThumbnail = e.target.value;

    if (publishData) {
      const previewThumb = await resolveThumbnail({
        manualThumbnail: manualThumbnail,
        content: publishData.content,
        defaultThumbnail: '/images/default-post-thumbnail.svg'
      });
      setPreviewThumbnail(previewThumb);
    }
  };

  // Bulk selection functions
  const handleSelectPost = useCallback((postId) => {
    const postIdStr = String(postId);

    setSelectedPosts(prev => {
      const newSelected = prev.includes(postIdStr)
        ? prev.filter(id => id !== postIdStr)
        : [...prev, postIdStr];

      setShowBulkActions(newSelected.length > 0);
      setForceRender(current => current + 1);

      return newSelected;
    });
  }, []);

  const handleSelectAllPosts = useCallback((checked) => {
    if (checked) {
      const allPostIds = posts.map(post => String(post.id));
      setSelectedPosts(allPostIds);
      setShowBulkActions(true);
    } else {
      setSelectedPosts([]);
      setShowBulkActions(false);
    }
  }, [posts]);

  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return;

    const confirmMessage = `Are you sure you want to delete ${selectedPosts.length} post(s)? This action cannot be undone.`;
    if (!window.confirm(confirmMessage)) return;

    try {
      setIsSubmitting(true);

      const deletePromises = selectedPosts.map(postId =>
        apiService.deletePost(postId)
      );

      const results = await Promise.allSettled(deletePromises);
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.length - successful;

      if (successful > 0) {
        showNotification(`Successfully deleted ${successful} post(s)${failed > 0 ? `, ${failed} failed` : ''}`, 'success');
        await refreshPosts();
      }

      if (failed > 0) {
        showNotification(`Failed to delete ${failed} post(s)`, 'error');
      }

      setSelectedPosts([]);
      setShowBulkActions(false);

    } catch (error) {
      showNotification('Error during bulk delete: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle final publish with category and thumbnail
  const handleFinalPublish = async (publishFormData) => {
    try {
      setIsSubmitting(true);

      // Validate required data
      if (!publishData) {
        showNotification('Error: No publish data available', 'error');
        return;
      }

      // Validate required fields
      if (!publishData.title?.trim()) {
        showNotification('Error: Please enter a title', 'error');
        return;
      }

      if (!publishData.content?.trim()) {
        showNotification('Error: Please enter content', 'error');
        return;
      }

      if (!publishFormData.category_id) {
        showNotification('Error: Please select a category', 'error');
        return;
      }

      // Load categories if not already loaded (only when actually publishing)
      if (!dataLoaded.categories) {
        try {
          const categoriesResponse = await apiService.getCategories();
          if (categoriesResponse.success) {
            setCategories(categoriesResponse.data || []);
            setDataLoaded(prev => ({ ...prev, categories: true }));
          }
        } catch (error) {
          showNotification('Failed to load categories', 'error');
          return;
        }
      }

      // Resolve thumbnail using hierarchical logic
      const resolvedThumbnail = await resolveThumbnail({
        manualThumbnail: publishFormData.featured_image,
        content: publishData.content,
        defaultThumbnail: '/images/default-post-thumbnail.svg'
      });

      // Prepare post data
      const postData = {
        title: publishData.title.trim(),
        slug: publishData.slug || generateSlug(publishData.title),
        content: publishData.content.trim(),
        excerpt: (publishData.excerpt || '').trim(),
        status: 'published',
        category_id: publishFormData.category_id,
        featured_image_url: resolvedThumbnail,
        meta_title: (publishData.meta_title || '').trim(),
        meta_description: (publishData.meta_description || '').trim(),
        content_type: publishData.content_type || 'article',
        difficulty_level: publishData.difficulty_level || null
      };

      // Create new post or update existing one
      let response;
      if (selectedItem?.id) {
        response = await apiService.updatePost(selectedItem.id, postData);
      } else {
        response = await apiService.createPost(postData);
        // Set selectedItem for future operations
        if (response.success && response.data) {
          setSelectedItem(response.data);
        }
      }

      if (response.success) {
        await refreshPosts();

        // Close all modals
        setShowPublishModal(false);
        setShowCreateModal(false);
        setShowEditModal(false);
        setSelectedItem(null);
        setFormData({});
        setPublishData(null);
        setPreviewThumbnail(null);

        // Show appropriate message based on action
        const action = response.action || 'published';
        if (action === 'updated') {
          showNotification('Post updated and published successfully! (Slug already existed)', 'success');
        } else if (action === 'created_with_unique_slug') {
          showNotification(`Post published successfully! Slug was changed to "${response.final_slug}" (original slug existed)`, 'success');
        } else {
          showNotification('Post published successfully!', 'success');
        }
      } else {
        showNotification('Failed to publish post: ' + (response.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      showNotification('Error publishing post: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Post CRUD Functions
  const handleCreatePost = async () => {
    // Ensure categories are loaded for the dropdown
    if (!dataLoaded.categories) {
      try {
        const categoriesResponse = await apiService.getCategories();
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data || []);
          setDataLoaded(prev => ({ ...prev, categories: true }));
        }
      } catch (error) {
        showNotification('Failed to load categories', 'error');
      }
    }

    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      status: 'draft',
      category_id: '',
      featured_image: '',
      meta_title: '',
      meta_description: '',
      content_type: 'article',
      difficulty_level: '',
      tags: []
    });
    setSelectedItem(null);
    setModalType('post');
    setShowCreateModal(true);
  };
  const handleEditPost = (post) => {
    if (!post || !post.id) {
      showNotification('Invalid post data', 'error');
      return;
    }

    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      content: post.content || '',
      excerpt: post.excerpt || '',
      status: post.status || 'draft',
      category_id: post.category_id || '',
      featured_image: post.featured_image_url || post.featured_image || '',
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      content_type: post.content_type || 'article',
      difficulty_level: post.difficulty_level || '',
      tags: post.tags || []
    });
    setSelectedItem(post);
    setModalType('post');
    setShowEditModal(true);
  };
  const handleViewPost = (post) => {
    // Try to open the post in a new tab using the correct URL format
    if (post.slug) {
      // Open using slug in the resources section
      window.open(`/resources/${post.slug}`, '_blank');
      showNotification(`Opening post: "${post.title}"`, 'info');
    } else if (post.id) {
      // Fallback: if no slug but has ID, open using ID
      window.open(`/resources/${post.id}`, '_blank');
      showNotification(`Opening post: "${post.title}" (using ID as fallback)`, 'info');
    } else {
      // Fallback: show post info in notification
      showNotification(`Cannot open post: "${post.title}" - missing slug and ID`, 'error');
    }
  };
  const handleDeletePost = async (post) => {
    showConfirmDialog(
      'Delete Post',
      `Are you sure you want to delete "${post.title}"? This action cannot be undone.`,
      async () => {
        try {
          setLoading(true);
          const response = await apiService.deletePost(post.id);
          if (response.success) {
            // Remove post from local state
            setPosts(prevPosts => prevPosts.filter(p => p.id !== post.id));
            showNotification('Post deleted successfully!');
          } else {
            showNotification('Failed to delete post: ' + (response.message || 'Unknown error'), 'error');
          }
        } catch (error) {
          showNotification('Failed to delete post: ' + error.message, 'error');
        } finally {
          setLoading(false);
        }
        hideConfirmDialog();
      },
      () => {
        hideConfirmDialog();
      }
    );
  };

  const handleEditUser = (userToEdit) => {
    setFormData({
      id: userToEdit.id,
      username: userToEdit.username || '',
      email: userToEdit.email || '',
      full_name: userToEdit.full_name || '',
      role: userToEdit.role || 'editor',
    });
    setSelectedItem(userToEdit);
    setModalType('user');
    setShowEditModal(true);
  };



  const handleChangeOwnPassword = () => {
    setFormData({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
    setSelectedItem(null);
    setModalType('change_own_password');
    setShowEditModal(true);
  };

  const handleDeleteUser = async (userToDelete) => {
    showConfirmDialog(
      'Delete User',
      `Are you sure you want to delete user "${userToDelete.username}"? This action cannot be undone.`,
      async () => {
        try {
          setLoading(true);
          const response = await apiService.deleteAdminUser(userToDelete.id);
          if (response.success) {
            setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
            showNotification('User deleted successfully!');
          } else {
            showNotification('Failed to delete user: ' + (response.message || 'Unknown error'), 'error');
          }
        } catch (error) {
          showNotification('Failed to delete user: ' + error.message, 'error');
        } finally {
          setLoading(false);
        }
        hideConfirmDialog();
      },
      () => {
        hideConfirmDialog();
      }
    );
  };

  const handleEditCategory = (categoryToEdit) => {
    setFormData({
      id: categoryToEdit.id,
      name: categoryToEdit.name || '',
      slug: categoryToEdit.slug || '',
      description: categoryToEdit.description || '',
      color: categoryToEdit.color || '#667eea',
      is_active: categoryToEdit.is_active || '1',
      sort_order: categoryToEdit.sort_order || 0,
    });
    setSelectedItem(categoryToEdit);
    setModalType('category');
    setShowEditModal(true);
  };

  const handleDeleteCategory = async (categoryToDelete) => {
    showConfirmDialog(
      'Delete Category',
      `Are you sure you want to delete category "${categoryToDelete.name}"? This action cannot be undone.`,
      async () => {
        try {
          setLoading(true);
          const response = await apiService.deleteCategory(categoryToDelete.id);
          if (response.success) {
            setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
            showNotification('Category deleted successfully!');
          } else {
            showNotification('Failed to delete category: ' + (response.message || 'Unknown error'), 'error');
          }
        } catch (error) {
          showNotification('Failed to delete category: ' + error.message, 'error');
        } finally {
          setLoading(false);
        }
        hideConfirmDialog();
      },
      () => {
        hideConfirmDialog();
      }
    );
  };

  const handleEditTag = (tagToEdit) => {
    setFormData({
      id: tagToEdit.id,
      name: tagToEdit.name || '',
      slug: tagToEdit.slug || '',
      description: tagToEdit.description || '',
      color: tagToEdit.color || '#667eea',
    });
    setSelectedItem(tagToEdit);
    setModalType('tag');
    setShowEditModal(true);
  };

  const handleDeleteTag = async (tagToDelete) => {
    showConfirmDialog(
      'Delete Tag',
      `Are you sure you want to delete tag "${tagToDelete.name}"? This action cannot be undone.`,
      async () => {
        try {
          setLoading(true);
          const response = await apiService.deleteTag(tagToDelete.id);
          if (response.success) {
            setTags(prev => prev.filter(t => t.id !== tagToDelete.id));
            showNotification('Tag deleted successfully!');
          } else {
            showNotification('Failed to delete tag: ' + (response.message || 'Unknown error'), 'error');
          }
        } catch (error) {
          showNotification('Failed to delete tag: ' + error.message, 'error');
        } finally {
          setLoading(false);
        }
        hideConfirmDialog();
      },
      () => {
        hideConfirmDialog();
      }
    );
  };

  const handleEditMedia = (mediaItem) => {
    setFormData({
      id: mediaItem.id,
      filename: mediaItem.filename || '',
      is_public: mediaItem.is_public || '1',
      file_url: mediaItem.file_url || '',
    });
    setSelectedItem(mediaItem);
    setModalType('media');
    setShowEditModal(true);
  };

  const handleDeleteMedia = async (mediaToDelete) => {
    showConfirmDialog(
      'Delete Media',
      `Are you sure you want to delete media file "${mediaToDelete.filename}"? This action cannot be undone.`,
      async () => {
        try {
          setLoading(true);
          const response = await apiService.deleteMedia(mediaToDelete.id);
          if (response.success) {
            setMedia(prev => prev.filter(m => m.id !== mediaToDelete.id));
            showNotification('Media file deleted successfully!');
          } else {
            showNotification('Failed to delete media: ' + (response.message || 'Unknown error'), 'error');
          }
        } catch (error) {
          showNotification('Failed to delete media: ' + error.message, 'error');
        } finally {
          setLoading(false);
        }
        hideConfirmDialog();
      },
      () => {
        hideConfirmDialog();
      }
    );
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title?.trim()) {
      showNotification('Please enter a title', 'error');
      return;
    }
    if (!formData.content?.trim()) {
      showNotification('Please enter content', 'error');
      return;
    }
    try {
      setIsSubmitting(true);
      let response;
      // Prepare data for API
      const postData = {
        title: formData.title.trim(),
        slug: formData.slug || generateSlug(formData.title), // Auto-generate if empty
        content: formData.content.trim(),
        excerpt: formData.excerpt?.trim() || '',
        status: formData.status || 'draft',
        category_id: formData.category_id || null,
        featured_image_url: formData.featured_image?.trim() || '',
        meta_title: formData.meta_title?.trim() || '',
        meta_description: formData.meta_description?.trim() || '',
        content_type: formData.content_type || 'article',
        difficulty_level: formData.difficulty_level || null
      };

      if (selectedItem) {
        // Update existing post
        response = await apiService.updatePost(selectedItem.id, postData);
      } else {
        // Create new post
        response = await apiService.createPost(postData);
      }
      
      if (response.success) {
        // Force a small delay to ensure backend has committed the changes
        await new Promise(resolve => setTimeout(resolve, 500));

        // If creating new post, set selectedItem to the created post for future publish operations
        if (!selectedItem && response.data) {
          setSelectedItem(response.data);
        }

        // Refresh posts data to keep sidebar updated
        await refreshPosts();

        // DON'T close modal or reset data - keep user in edit mode
        // User can continue editing until they click Publish or Back

        // Show appropriate message based on action
        const action = response.action || (selectedItem ? 'updated' : 'created');
        let message = '';

        if (selectedItem) {
          message = 'Post saved successfully! You can continue editing. Click "X" or "Cancel" to exit.';
        } else if (action === 'updated') {
          message = 'Post updated successfully! (Slug already existed) You can continue editing. Click "X" or "Cancel" to exit.';
        } else if (action === 'created_with_unique_slug') {
          message = `Post created successfully! Slug was changed to "${response.final_slug}" (original slug existed). You can continue editing. Click "X" or "Cancel" to exit.`;
        } else {
          message = 'Post created successfully! You can continue editing. Click "X" or "Cancel" to exit.';
        }

        showNotification(message, 'success');
      } else {
        showNotification('Failed to save post: ' + (response.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      showNotification('Failed to save post: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    
    // User validation
    if (!formData.username?.trim()) {
      showNotification('Please enter a username', 'error');
      return;
    }
    if (!formData.email?.trim()) {
      showNotification('Please enter an email', 'error');
      return;
    }
    if (!selectedItem && !formData.password?.trim()) {
      showNotification('Please enter a password', 'error');
      return;
    }
    
    try {
      setIsSubmitting(true);
      let response;
      
      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        full_name: formData.full_name?.trim() || '',
        role: formData.role || 'editor'
      };

      if (!selectedItem) {
        userData.password = formData.password.trim();
      }

      if (selectedItem) {
        // Update existing user
        response = await apiService.updateAdminUser(selectedItem.id, userData);
      } else {
        // Create new user
        response = await apiService.createAdminUser(userData);
      }
      
      if (response.success) {
        // Reset cache and refresh users data
        setDataLoaded(prev => ({ ...prev, users: false }));
        await loadTabData();
        // Close modal
        setShowCreateModal(false);
        setShowEditModal(false);
        setSelectedItem(null);
        setFormData({});
        showNotification(selectedItem ? 'User updated successfully!' : 'User created successfully!');
      } else {
        showNotification('Failed to save user: ' + (response.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      showNotification('Failed to save user: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleSubmitChangeOwnPassword = async (e) => {
    e.preventDefault();

    // Password validation
    if (!formData.current_password?.trim()) {
      showNotification('Please enter your current password', 'error');
      return;
    }
    if (!formData.new_password?.trim()) {
      showNotification('Please enter a new password', 'error');
      return;
    }
    if (!formData.confirm_password?.trim()) {
      showNotification('Please confirm the new password', 'error');
      return;
    }
    if (formData.new_password !== formData.confirm_password) {
      showNotification('Passwords do not match', 'error');
      return;
    }
    if (formData.new_password.length < 6) {
      showNotification('Password must be at least 6 characters long', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      const passwordData = {
        current_password: formData.current_password,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password
      };

      const response = await apiService.changeOwnPassword(passwordData);

      if (response.success) {
        showNotification('Password changed successfully!');
        setShowEditModal(false);
        setFormData({});
        setSelectedItem(null);
      } else {
        showNotification('Failed to change password: ' + (response.error || response.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      showNotification('Failed to change password: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    
    // Category validation
    if (!formData.name?.trim()) {
      showNotification('Please enter a category name', 'error');
      return;
    }
    
    try {
      setIsSubmitting(true);
      let response;
      
      const categoryData = {
        name: formData.name.trim(),
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description?.trim() || '',
        color: formData.color || '#667eea',
        is_active: formData.is_active || '1',
        sort_order: parseInt(formData.sort_order) || 0
      };

      if (selectedItem) {
        // Update existing category
        response = await apiService.updateCategory(selectedItem.id, categoryData);
      } else {
        // Create new category
        response = await apiService.createCategory(categoryData);
      }
      
      if (response.success) {
        // Reset cache and refresh categories data
        setDataLoaded(prev => ({ ...prev, categories: false }));
        await loadTabData();
        // Close modal
        setShowCreateModal(false);
        setShowEditModal(false);
        setSelectedItem(null);
        setFormData({});
        showNotification(selectedItem ? 'Category updated successfully!' : 'Category created successfully!');
      } else {
        showNotification('Failed to save category: ' + (response.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      showNotification('Failed to save category: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitTag = async (e) => {
    e.preventDefault();
    
    // Tag validation
    if (!formData.name?.trim()) {
      showNotification('Please enter a tag name', 'error');
      return;
    }
    
    try {
      setIsSubmitting(true);
      let response;
      
      const tagData = {
        name: formData.name.trim(),
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description?.trim() || '',
        color: formData.color || '#667eea'
      };

      if (selectedItem) {
        // Update existing tag
        response = await apiService.updateTag(selectedItem.id, tagData);
      } else {
        // Create new tag
        response = await apiService.createTag(tagData);
      }
      
      if (response.success) {
        // Reset cache and refresh tags data
        setDataLoaded(prev => ({ ...prev, tags: false }));
        await loadTabData();
        // Close modal
        setShowCreateModal(false);
        setShowEditModal(false);
        setSelectedItem(null);
        setFormData({});
        showNotification(selectedItem ? 'Tag updated successfully!' : 'Tag created successfully!');
      } else {
        showNotification('Failed to save tag: ' + (response.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      showNotification('Failed to save tag: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitMedia = async (e) => {
    e.preventDefault();
    
    // Media validation
    if (!selectedItem && !formData.file) {
      showNotification('Please select a file to upload', 'error');
      return;
    }
    
    try {
      setIsSubmitting(true);
      let response;
      
      if (selectedItem) {
        // Update existing media metadata
        const mediaData = {
          filename: formData.filename?.trim() || selectedItem.filename,
          is_public: formData.is_public || '1'
        };
        response = await apiService.updateMedia(selectedItem.id, mediaData);
      } else {
        // Upload new media
        const formDataObj = new FormData();
        formDataObj.append('file', formData.file);
        if (formData.filename?.trim()) {
          formDataObj.append('filename', formData.filename.trim());
        }
        formDataObj.append('is_public', formData.is_public || '1');
        
        response = await apiService.uploadMedia(formDataObj);
      }
      
      if (response.success) {
        // Reset cache and refresh media data
        setDataLoaded(prev => ({ ...prev, media: false }));
        await loadTabData();
        // Close modal
        setShowCreateModal(false);
        setShowEditModal(false);
        setSelectedItem(null);
        setFormData({});
        showNotification(selectedItem ? 'Media updated successfully!' : 'Media uploaded successfully!');
      } else {
        showNotification('Failed to save media: ' + (response.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      showNotification('Failed to save media: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubmitHandler = () => {
    switch (modalType) {
      case 'post':
        return handleSubmitPost;
      case 'user':
        return handleSubmitUser;
      case 'change_own_password':
        return handleSubmitChangeOwnPassword;
      case 'category':
        return handleSubmitCategory;
      case 'tag':
        return handleSubmitTag;
      case 'media':
        return handleSubmitMedia;
      default:
        return handleSubmitPost;
    }
  };
  const handleFormChange = (field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };

      // Auto-generate slug when title changes
      if (field === 'title') {
        newData.slug = generateSlug(value);
      }

      return newData;
    });
  };

  // Manual save function - only called when user explicitly clicks Save
  const handleManualSave = async () => {
    if (!selectedItem || !selectedItem.id) {
      showNotification('Error: No post selected to save', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      const postData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title || '')
      };

      const response = await apiService.updatePost(selectedItem.id, postData);

      if (response.success) {
        showNotification('Post saved successfully! You can continue editing. Click "X" or "Cancel" to exit.', 'success');
        await refreshPosts();
        // DON'T close modal or reset data - keep user in edit mode
      } else {
        showNotification('Failed to save post: ' + (response.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      showNotification('Error saving post: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  // Memoized stats calculations to avoid re-computation on every render
  const dashboardStats = useMemo(() => {
    // Calculate real stats from loaded data
    const totalPosts = posts.length;
    const publishedPosts = posts.filter(p => p.status === 'published').length;
    const draftPosts = posts.filter(p => p.status === 'draft').length;
    const pendingPosts = posts.filter(p => p.status === 'pending').length;

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      pendingPosts
    };
  }, [posts]);

  const renderDashboardStats = () => {
    const {
      totalPosts,
      publishedPosts,
      draftPosts,
      pendingPosts
    } = dashboardStats;

    return (
      <StatsGrid>
        <StatCard>
          <StatIcon><FaFileAlt /></StatIcon>
          <StatContent>
            <StatNumber>{totalPosts}</StatNumber>
            <StatLabel>Total Posts</StatLabel>
            <StatChange $positive={publishedPosts > 0}>
              {publishedPosts} published, {draftPosts} drafts, {pendingPosts} pending
            </StatChange>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon><FaTags /></StatIcon>
          <StatContent>
            <StatNumber>{categories.length}</StatNumber>
            <StatLabel>Categories</StatLabel>
            <StatChange $positive={categories.filter(c => c.is_active === '1').length > 0}>
              {categories.filter(c => c.is_active === '1').length} active categories
            </StatChange>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon><FaTags /></StatIcon>
          <StatContent>
            <StatNumber>{tags.length}</StatNumber>
            <StatLabel>Tags</StatLabel>
            <StatChange $positive={tags.length > 0}>
              {tags.reduce((sum, t) => sum + parseInt(t.usage_count || 0), 0)} total usage
            </StatChange>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon><FaUsers /></StatIcon>
          <StatContent>
            <StatNumber>{users.length}</StatNumber>
            <StatLabel>Admin Users</StatLabel>
            <StatChange $positive={users.length > 0}>
              {users.length} registered users
            </StatChange>
          </StatContent>
        </StatCard>
      </StatsGrid>
    );
  };
  const renderTabContent = useCallback(() => {
    if (error) {
      return (
        <ErrorContainer>
          <ErrorMessage>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button onClick={() => setError(null)}>Try Again</button>
          </ErrorMessage>
        </ErrorContainer>
      );
    }

    // Show loading only for the specific tab being loaded
    if (tabLoading[activeTab] || (loading && activeTab === 'dashboard')) {
      return (
        <LoadingContainer>
          <FaSpinner className="spinner" />
          <span>Loading {activeTab}...</span>
        </LoadingContainer>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return renderDashboardStats();
      case 'posts':
        return renderPostsTab();
      case 'users':
        return renderUsersTab();
      case 'categories':
        return renderCategoriesTab();
      case 'tags':
        return renderTagsTab();
      default:
        return <div>Tab content for {activeTab}</div>;
    }
  }, [loading, tabLoading, activeTab, posts, users, categories, tags, dashboardStats, error]);
  const renderPostsTab = () => {
    
    return (
      <TabContainer>
        <TabHeader>
          <TabTitle>Posts Management ({posts.length} posts)</TabTitle>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <ActionButton
              onClick={refreshPosts}
              title="Refresh Posts"
            >
              <FaSpinner /> Refresh
            </ActionButton>
            {hasPermission('posts.create') && (
              <CreateButton onClick={handleCreatePost}>
                <FaPlus /> Create Post
              </CreateButton>
            )}
          </div>
        </TabHeader>
        {posts.length === 0 ? (
          <EmptyState>
            <FaFileAlt />
            <div>No posts found</div>
            <small>Click "Create Post" to add your first post</small>
          </EmptyState>
        ) : (
          <>
            {/* Bulk Actions Toolbar */}
            {showBulkActions && (
              <BulkActionsToolbar>
                <BulkActionsInfo>
                  {selectedPosts.length} post(s) selected
                </BulkActionsInfo>
                <BulkActionsButtons>
                  <BulkActionButton
                    onClick={handleBulkDelete}
                    disabled={isSubmitting}
                    danger
                  >
                    <FaTrash /> Delete Selected
                  </BulkActionButton>
                  <BulkActionButton
                    onClick={() => {
                      setSelectedPosts([]);
                      setShowBulkActions(false);
                    }}
                    secondary
                  >
                    Clear Selection
                  </BulkActionButton>
                </BulkActionsButtons>
              </BulkActionsToolbar>
            )}

            <TableContainer>
            <DataTable>
            <TableHeader>
              <tr>
                <CheckboxHeader>
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === posts.length && posts.length > 0}
                    onChange={(e) => handleSelectAllPosts(e.target.checked)}
                  />
                </CheckboxHeader>
                <th style={{ width: '35%' }}>Title</th>
                <th style={{ width: '80px' }}>Image</th>
                <th style={{ width: '120px' }}>Author</th>
                <th style={{ width: '150px' }}>Category</th>
                <th style={{ width: '100px' }}>Status</th>
                <th style={{ width: '120px' }}>Created</th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </TableHeader>
            <tbody>
              {posts.map(post => {
                if (!post || !post.id) {
                  return null;
                }

                const isSelected = selectedPosts.includes(String(post.id));

                return (
                  <TableRow
                    key={`${post.id}-${isSelected}-${forceRender}`}
                    style={{
                      backgroundColor: isSelected ? '#ebf8ff' : 'transparent',
                      borderLeft: isSelected ? '3px solid #3b82f6' : '3px solid transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <CheckboxCell>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectPost(String(post.id))}
                      />
                    </CheckboxCell>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div>
                          <PostTitle>{post.title || 'Untitled Post'}</PostTitle>
                          <PostExcerpt>
                            {post.excerpt || (post.content ? post.content.substring(0, 100) + '...' : 'No content')}
                          </PostExcerpt>
                        </div>
                        {isSelected && (
                          <span style={{
                            background: '#3b82f6',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 'bold'
                          }}>
                            SELECTED
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {post.featured_image_url ? (
                        <PostThumbnail 
                          src={post.featured_image_url} 
                          alt={post.title || 'Post image'}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <NoImagePlaceholder>
                          <FaImage />
                        </NoImagePlaceholder>
                      )}
                    </td>
                    <td>{post.author_name || 'Unknown'}</td>
                    <td>
                      <CategoryBadge>
                        {post.category_name || 'No Category'}
                      </CategoryBadge>
                    </td>
                    <td>
                      <StatusBadge status={post.status || 'draft'}>
                        {post.status || 'draft'}
                      </StatusBadge>
                    </td>
                    <td>
                      {post.created_at ?
                        new Date(post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : '-'
                      }
                    </td>
                    <td>
                      <ActionButtons>
                        <ActionButton 
                          onClick={() => handleViewPost(post)}
                          title="View Post"
                        >
                          <FaEye />
                        </ActionButton>
                        {hasPermission('posts.update') && (
                          <ActionButton 
                            onClick={() => handleEditPost(post)}
                            title="Edit Post"
                          >
                            <FaEdit />
                          </ActionButton>
                        )}
                        {hasPermission('posts.delete') && (
                          <ActionButton 
                            danger 
                            onClick={() => handleDeletePost(post)}
                            title="Delete Post"
                          >
                            <FaTrash />
                          </ActionButton>
                        )}
                      </ActionButtons>
                    </td>
                  </TableRow>
                );
              }).filter(Boolean)}
            </tbody>
          </DataTable>
          </TableContainer>
          </>
        )}
        {renderPagination('posts')}
      </TabContainer>
    );
  };
  const renderUsersTab = () => {
    return (
      <TabContainer>
        <TabHeader>
          <TabTitle>Admin Users ({users.length} users)</TabTitle>
          {hasPermission('admin.create') && (
            <CreateButton onClick={handleCreateUser}>
              <FaPlus /> Create User
            </CreateButton>
          )}
        </TabHeader>
        {users.length === 0 ? (
          <EmptyState>
            <FaUsers />
            <div>No users found</div>
          </EmptyState>
        ) : (
          <TableContainer>
            <DataTable>
            <TableHeader>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </TableHeader>
            <tbody>
              {users
                .sort((a, b) => parseInt(a.id) - parseInt(b.id))
                .map(userItem => (
                <TableRow key={userItem.id}>
                  <td>#{userItem.id}</td>
                  <td>
                    <UserInfo>
                      <UserAvatar>
                        <FaUser />
                      </UserAvatar>
                      <div>
                        <UserName>{userItem.username}</UserName>
                        <UserUsername>@{userItem.username}</UserUsername>
                      </div>
                    </UserInfo>
                  </td>
                  <td>{userItem.email}</td>
                  <td>{userItem.created_at ? new Date(userItem.created_at).toLocaleDateString() : '-'}</td>
                  <td>
                    <ActionButtons>
                      {hasPermission('admin.update') && (
                        <ActionButton onClick={() => handleEditUser(userItem)} title="Edit User">
                          <FaEdit />
                        </ActionButton>
                      )}
                      {hasPermission('admin.delete') && user.id !== userItem.id && (
                        <ActionButton danger onClick={() => handleDeleteUser(userItem)} title="Delete User">
                          <FaTrash />
                        </ActionButton>
                      )}
                    </ActionButtons>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </DataTable>
          </TableContainer>
        )}
      </TabContainer>
    );
  };
  const renderCategoriesTab = () => {
    return (
      <TabContainer>
        <TabHeader>
          <TabTitle>Categories ({categories.length} categories)</TabTitle>
          {hasPermission('categories.manage') && (
            <CreateButton onClick={handleCreateCategory}>
              <FaPlus /> Create Category
            </CreateButton>
          )}
        </TabHeader>
        {categories.length === 0 ? (
          <EmptyState>
            <FaTags />
            <div>No categories found</div>
          </EmptyState>
        ) : (
          <TableContainer>
            <DataTable>
            <TableHeader>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Sort Order</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </TableHeader>
            <tbody>
              {categories.map(category => (
                <TableRow key={category.id}>
                  <td>#{category.id}</td>
                  <td>
                    <CategoryInfo>
                      <CategoryColor color={category.color || '#667eea'} />
                      <div>
                        <CategoryName>{category.name}</CategoryName>
                        {category.description && (
                          <CategoryDescription>{category.description}</CategoryDescription>
                        )}
                      </div>
                    </CategoryInfo>
                  </td>
                  <td>
                    <CategorySlug>/{category.slug}</CategorySlug>
                  </td>
                  <td>
                    <StatusBadge status={category.is_active === '1' ? 'active' : 'inactive'}>
                      {category.is_active === '1' ? 'Active' : 'Inactive'}
                    </StatusBadge>
                  </td>
                  <td>{category.sort_order || 0}</td>
                  <td>{category.created_at ? new Date(category.created_at).toLocaleDateString() : '-'}</td>
                  <td>
                    <ActionButtons>
                      {hasPermission('categories.manage') && (
                        <ActionButton onClick={() => handleEditCategory(category)}>
                          <FaEdit />
                        </ActionButton>
                      )}
                      {hasPermission('categories.manage') && (
                        <ActionButton danger onClick={() => handleDeleteCategory(category)}>
                          <FaTrash />
                        </ActionButton>
                      )}
                    </ActionButtons>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </DataTable>
          </TableContainer>
        )}
      </TabContainer>
    );
  };
  const renderTagsTab = () => {
    return (
      <TabContainer>
        <TabHeader>
          <TabTitle>Tags ({tags.length} tags)</TabTitle>
          {hasPermission('tags.manage') && (
            <CreateButton onClick={handleCreateTag}>
              <FaPlus /> Create Tag
            </CreateButton>
          )}
        </TabHeader>
        {tags.length === 0 ? (
          <EmptyState>
            <FaTags />
            <div>No tags found</div>
          </EmptyState>
        ) : (
          <TagsGrid>
            {tags.map(tag => (
              <TagCard key={tag.id}>
                <TagHeader>
                  <TagColor color={tag.color || '#667eea'} />
                  <div>
                    <TagName>{tag.name}</TagName>
                    <TagSlug>/{tag.slug}</TagSlug>
                  </div>
                </TagHeader>
                <TagStats>
                  <TagUsage>{tag.usage_count || 0} posts</TagUsage>
                  <TagMeta>#{tag.id}</TagMeta>
                </TagStats>
                {tag.description && (
                  <TagDescription>{tag.description}</TagDescription>
                )}
                <TagDates>
                  <TagDate>Created: {tag.created_at ? new Date(tag.created_at).toLocaleDateString() : '-'}</TagDate>
                  {tag.updated_at !== tag.created_at && (
                    <TagDate>Updated: {new Date(tag.updated_at).toLocaleDateString()}</TagDate>
                  )}
                </TagDates>
                <TagActions>
                  {hasPermission('tags.manage') && (
                    <>
                      <ActionButton onClick={() => handleEditTag(tag)}>
                        <FaEdit />
                      </ActionButton>
                      <ActionButton danger onClick={() => handleDeleteTag(tag)}>
                        <FaTrash />
                      </ActionButton>
                    </>
                  )}
                </TagActions>
              </TagCard>
            ))}
          </TagsGrid>
        )}
      </TabContainer>
    );
  };
  const renderMediaTab = () => {
    return (
      <TabContainer>
        <TabHeader>
          <TabTitle>Media Library ({media.length} files)</TabTitle>
          {hasPermission('media.upload') && (
            <CreateButton onClick={handleCreateMedia}>
              <FaUpload /> Upload Media
            </CreateButton>
          )}
        </TabHeader>
        {media.length === 0 ? (
          <EmptyState>
            <FaFileAlt />
            <div>No media files found</div>
            <small>Upload some files to see them here</small>
          </EmptyState>
        ) : (
          <MediaGrid>
            {media.map(item => (
              <MediaCard key={item.id}>
                <MediaPreview>
                  {item.file_type === 'image' ? (
                    <MediaImage 
                      src={item.file_url} 
                      alt={item.filename}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <MediaIcon>
                      <FaFileAlt />
                    </MediaIcon>
                  )}
                  <div className="file-fallback" style={{display: 'none'}}>
                    <MediaIcon>
                      <FaFileAlt />
                    </MediaIcon>
                  </div>
                </MediaPreview>
                <MediaInfo>
                  <MediaName title={item.filename}>{item.filename}</MediaName>
                  <MediaMeta>
                    <MediaSize>{item.file_type || 'Unknown type'}</MediaSize>
                    {item.file_size && item.file_size !== '0' && (
                      <MediaSize>
                        {parseInt(item.file_size) > 1024 * 1024 
                          ? `${(parseInt(item.file_size) / 1024 / 1024).toFixed(2)} MB`
                          : `${(parseInt(item.file_size) / 1024).toFixed(1)} KB`
                        }
                      </MediaSize>
                    )}
                  </MediaMeta>
                  <MediaDetails>
                    <small>ID: {item.id}</small>
                    {item.created_at && (
                      <small>
                        Uploaded: {new Date(item.created_at).toLocaleDateString()}
                      </small>
                    )}
                    {item.uploaded_by && (
                      <small>By User ID: {item.uploaded_by}</small>
                    )}
                    {item.is_public === '1' && (
                      <small>🌍 Public</small>
                    )}
                  </MediaDetails>
                </MediaInfo>
                <MediaActions>
                  <ActionButton 
                    onClick={() => window.open(item.file_url, '_blank')}
                    title="View file"
                  >
                    <FaEye />
                  </ActionButton>
                  {hasPermission('media.manage') && (
                    <>
                      <ActionButton onClick={() => handleEditMedia(item)} title="Edit">
                        <FaEdit />
                      </ActionButton>
                      <ActionButton danger onClick={() => handleDeleteMedia(item)} title="Delete">
                        <FaTrash />
                      </ActionButton>
                    </>
                  )}
                </MediaActions>
              </MediaCard>
            ))}
          </MediaGrid>
        )}
      </TabContainer>
    );
  };
  const renderCommentsTab = () => {
    return (
      <TabContainer>
        <TabHeader>
          <TabTitle>Comments ({comments.length} comments)</TabTitle>
        </TabHeader>
        {comments.length === 0 ? (
          <EmptyState>
            <FaComments />
            <div>No comments found</div>
          </EmptyState>
        ) : (
          <TableContainer>
            <DataTable>
            <TableHeader>
              <tr>
                <th>ID</th>
                <th>Author</th>
                <th>Content</th>
                <th>Post</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </TableHeader>
            <tbody>
              {comments.map(comment => (
                <TableRow key={comment.id}>
                  <td>#{comment.id}</td>
                  <td>
                    <CommentAuthor>
                      <div>{comment.author_name || 'Anonymous'}</div>
                      {comment.author_email && (
                        <div>{comment.author_email}</div>
                      )}
                      {comment.author_website && (
                        <div>🌐 <a href={comment.author_website} target="_blank" rel="noopener noreferrer">
                          {comment.author_website}
                        </a></div>
                      )}
                    </CommentAuthor>
                  </td>
                  <td>
                    <CommentContent>{comment.content}</CommentContent>
                    {comment.parent_id && (
                      <small>Reply to comment #{comment.parent_id}</small>
                    )}
                  </td>
                  <td>
                    <div>
                      <strong>{comment.post_title || `Post #${comment.post_id}`}</strong>
                      <div><small>Post ID: {comment.post_id}</small></div>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={comment.status}>
                      {comment.status}
                    </StatusBadge>
                  </td>
                  <td>
                    <div>{comment.created_at ? new Date(comment.created_at).toLocaleDateString() : '-'}</div>
                    {comment.updated_at !== comment.created_at && (
                      <small>Updated: {new Date(comment.updated_at).toLocaleDateString()}</small>
                    )}
                  </td>
                  <td>
                    <ActionButtons>
                      {comment.status === 'pending' && hasPermission('comments.moderate') && (
                        <>
                          <ActionButton onClick={() => {/* Approve comment */}} title="Approve">
                            <FaCheck />
                          </ActionButton>
                          <ActionButton danger onClick={() => {/* Reject comment */}} title="Reject">
                            <FaTimes />
                          </ActionButton>
                        </>
                      )}
                      {hasPermission('comments.moderate') && (
                        <ActionButton onClick={() => {/* Edit comment */}} title="Edit">
                          <FaEdit />
                        </ActionButton>
                      )}
                      {hasPermission('comments.moderate') && (
                        <ActionButton danger onClick={() => {/* Delete comment */}} title="Delete">
                          <FaTrash />
                        </ActionButton>
                      )}
                    </ActionButtons>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </DataTable>
          </TableContainer>
        )}
      </TabContainer>
    );
  };
  // User CRUD Functions
  const handleCreateUser = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      full_name: '',
      role: 'editor'
    });
    setSelectedItem(null);
    setModalType('user');
    setShowCreateModal(true);
  };
  // Category CRUD Functions
  const handleCreateCategory = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#667eea',
      is_active: '1',
      sort_order: 0
    });
    setSelectedItem(null);
    setModalType('category');
    setShowCreateModal(true);
  };
  // Tag CRUD Functions
  const handleCreateTag = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#667eea'
    });
    setSelectedItem(null);
    setModalType('tag');
    setShowCreateModal(true);
  };
  // Media CRUD Functions
  const handleCreateMedia = () => {
    setFormData({
      file: null,
      filename: '',
      is_public: '1'
    });
    setSelectedItem(null);
    setModalType('media');
    setShowCreateModal(true);
  };
  const renderModalContent = () => {
    switch (modalType) {
      case 'post':
        return (
          <>
            <FormRow>
              <FormGroup>
                <FormLabel>
                  Slug *
                  <span style={{color: '#a0aec0', fontWeight: 'normal'}}>
                    (Auto-generated from title)
                  </span>
                </FormLabel>
                <FormInput
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => handleFormChange('slug', e.target.value)}
                  placeholder="URL slug (auto-generated)"
                  maxLength={200}
                />
                {formData.slug && (
                  <small style={{color: '#718096', marginTop: '0.25rem'}}>
                    URL will be: /posts/{formData.slug}
                  </small>
                )}
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>
                  Excerpt 
                  <span style={{color: '#a0aec0', fontWeight: 'normal'}}>
                    ({(formData.excerpt || '').length}/255)
                  </span>
                </FormLabel>
                <FormTextarea
                  value={formData.excerpt || ''}
                  onChange={(e) => handleFormChange('excerpt', e.target.value)}
                  placeholder="Enter post excerpt (optional)"
                  rows={3}
                  maxLength={255}
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>Content</FormLabel>
                <EditorContainer>
                  <NotionEditor
                    key={selectedItem?.id || 'new-post'}
                    initialContent={formData.content || ''}
                    title={formData.title || ''}
                    onChange={(content) => {
                      handleFormChange('content', content);
                    }}
                    onSave={({ content, title }) => {

                      // ONLY update form data, do NOT call API
                      handleFormChange('content', content);
                      if (title) handleFormChange('title', title);

                      // Show feedback that data was updated locally
                      if (showNotification) {
                        showNotification('Content updated locally. Click Save button to save to server.', 'info');
                      }
                    }}
                    onTitleChange={(title) => handleFormChange('title', title)}
                    onRequestPublish={handlePublishRequest}
                    showNotification={showNotification}
                    onBack={() => {
                      // Close edit modal and go back to dashboard
                      setShowEditModal(false);
                      setSelectedItem(null);
                      setFormData({});
                      setModalType('');
                      showNotification('Returned to dashboard', 'info');
                    }}
                  />
                </EditorContainer>
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup style={{flex: 1}}>
                <FormLabel>Status</FormLabel>
                <FormSelect
                  value={formData.status || 'draft'}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                  <option value="published">Published</option>
                </FormSelect>
              </FormGroup>
              <FormGroup style={{flex: 1}}>
                <FormLabel>Category</FormLabel>
                <FormSelect
                  value={formData.category_id || ''}
                  onChange={(e) => handleFormChange('category_id', e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </FormSelect>
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup style={{flex: 1}}>
                <FormLabel>Content Type</FormLabel>
                <FormSelect
                  value={formData.content_type || 'article'}
                  onChange={(e) => handleFormChange('content_type', e.target.value)}
                >
                  <option value="article">Article</option>
                  <option value="guide">Guide</option>
                  <option value="exercise">Exercise</option>
                  <option value="meditation">Meditation</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                </FormSelect>
              </FormGroup>
              <FormGroup style={{flex: 1}}>
                <FormLabel>Difficulty Level</FormLabel>
                <FormSelect
                  value={formData.difficulty_level || ''}
                  onChange={(e) => handleFormChange('difficulty_level', e.target.value)}
                >
                  <option value="">Select Difficulty</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </FormSelect>
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>Thumbnail Image</FormLabel>
                <ImageUploadContainer>
                  {formData.featured_image && (
                    <ImagePreview>
                      <img
                        src={formData.featured_image}
                        alt="Thumbnail image preview"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div style={{ display: 'none', padding: '2rem', textAlign: 'center', color: '#e53e3e' }}>
                        Failed to load image
                      </div>
                      <RemoveImageButton 
                        onClick={() => handleFormChange('featured_image', '')}
                        title="Remove image"
                      >
                        <FaTimes />
                      </RemoveImageButton>
                    </ImagePreview>
                  )}
                  <ImageUploadOptions>
                    <ImageUploadButton as="label">
                      <FaUpload />
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            try {
                              setIsSubmitting(true);
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                handleFormChange('featured_image', event.target.result);
                              };
                              reader.readAsDataURL(file);
                            } catch (error) {
                              showNotification('Error uploading image: ' + error.message, 'error');
                            } finally {
                              setIsSubmitting(false);
                            }
                          }
                        }}
                      />
                    </ImageUploadButton>
                    <FormInput
                      type="text"
                      value={formData.featured_image || ''}
                      onChange={(e) => handleFormChange('featured_image', e.target.value)}
                      placeholder="Or enter thumbnail image URL"
                      style={{ marginTop: '0.5rem' }}
                    />
                  </ImageUploadOptions>
                </ImageUploadContainer>
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>Meta Title (SEO)</FormLabel>
                <FormInput
                  type="text"
                  value={formData.meta_title || ''}
                  onChange={(e) => handleFormChange('meta_title', e.target.value)}
                  placeholder="Enter meta title for SEO"
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>Meta Description (SEO)</FormLabel>
                <FormTextarea
                  value={formData.meta_description || ''}
                  onChange={(e) => handleFormChange('meta_description', e.target.value)}
                  placeholder="Enter meta description for SEO"
                  rows={3}
                />
              </FormGroup>
            </FormRow>
          </>
        );
      
      case 'user':
        return (
          <>
            <FormRow>
              <FormGroup>
                <FormLabel>Username *</FormLabel>
                <FormInput
                  type="text"
                  value={formData.username || ''}
                  onChange={(e) => handleFormChange('username', e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>Email *</FormLabel>
                <FormInput
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>Full Name</FormLabel>
                <FormInput
                  type="text"
                  value={formData.full_name || ''}
                  onChange={(e) => handleFormChange('full_name', e.target.value)}
                  placeholder="Enter full name"
                />
              </FormGroup>
            </FormRow>
            {!selectedItem && (
              <FormRow>
                <FormGroup>
                  <FormLabel>Password *</FormLabel>
                  <FormInput
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => handleFormChange('password', e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </FormGroup>
              </FormRow>
            )}
            <FormRow>
              <FormGroup>
                <FormLabel>Role</FormLabel>
                <FormSelect
                  value={formData.role || 'editor'}
                  onChange={(e) => handleFormChange('role', e.target.value)}
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </FormSelect>
              </FormGroup>
            </FormRow>
          </>
        );
      
      case 'category':
        return (
          <>
            <FormRow>
              <FormGroup>
                <FormLabel>Name *</FormLabel>
                <FormInput
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => {
                    handleFormChange('name', e.target.value);
                    // Auto-generate slug
                    if (!selectedItem) {
                      handleFormChange('slug', generateSlug(e.target.value));
                    }
                  }}
                  placeholder="Enter category name"
                  required
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>Slug *</FormLabel>
                <FormInput
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => handleFormChange('slug', e.target.value)}
                  placeholder="URL slug (auto-generated)"
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>Description</FormLabel>
                <FormTextarea
                  value={formData.description || ''}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Enter category description"
                  rows={3}
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup style={{flex: 1}}>
                <FormLabel>Color</FormLabel>
                <FormInput
                  type="color"
                  value={formData.color || '#667eea'}
                  onChange={(e) => handleFormChange('color', e.target.value)}
                />
              </FormGroup>
              <FormGroup style={{flex: 1}}>
                <FormLabel>Sort Order</FormLabel>
                <FormInput
                  type="number"
                  value={formData.sort_order || 0}
                  onChange={(e) => handleFormChange('sort_order', e.target.value)}
                  placeholder="0"
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>Status</FormLabel>
                <FormSelect
                  value={formData.is_active || '1'}
                  onChange={(e) => handleFormChange('is_active', e.target.value)}
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </FormSelect>
              </FormGroup>
            </FormRow>
          </>
        );
      
      case 'tag':
        return (
          <>
            <FormRow>
              <FormGroup>
                <FormLabel>Name *</FormLabel>
                <FormInput
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => {
                    handleFormChange('name', e.target.value);
                    // Auto-generate slug
                    if (!selectedItem) {
                      handleFormChange('slug', generateSlug(e.target.value));
                    }
                  }}
                  placeholder="Enter tag name"
                  required
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>Slug *</FormLabel>
                <FormInput
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => handleFormChange('slug', e.target.value)}
                  placeholder="URL slug (auto-generated)"
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>Description</FormLabel>
                <FormTextarea
                  value={formData.description || ''}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Enter tag description"
                  rows={3}
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>Color</FormLabel>
                <FormInput
                  type="color"
                  value={formData.color || '#667eea'}
                  onChange={(e) => handleFormChange('color', e.target.value)}
                />
              </FormGroup>
            </FormRow>
          </>
        );
      
      case 'media':
        return (
          <>
            {selectedItem && formData.file_url && (
              <FormRow>
                <FormGroup>
                  <FormLabel>Preview</FormLabel>
                  <ImagePreview>
                    <img 
                      src={formData.file_url} 
                      alt="Media preview"
                      style={{maxWidth: '200px', maxHeight: '150px', objectFit: 'contain'}}
                    />
                  </ImagePreview>
                </FormGroup>
              </FormRow>
            )}
            {!selectedItem && (
              <FormRow>
                <FormGroup>
                  <FormLabel>Upload File *</FormLabel>
                  <FormInput
                    type="file"
                    onChange={(e) => handleFormChange('file', e.target.files[0])}
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  />
                </FormGroup>
              </FormRow>
            )}
            <FormRow>
              <FormGroup>
                <FormLabel>Filename</FormLabel>
                <FormInput
                  type="text"
                  value={formData.filename || ''}
                  onChange={(e) => handleFormChange('filename', e.target.value)}
                  placeholder="Custom filename (optional)"
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>Visibility</FormLabel>
                <FormSelect
                  value={formData.is_public || '1'}
                  onChange={(e) => handleFormChange('is_public', e.target.value)}
                >
                  <option value="1">Public</option>
                  <option value="0">Private</option>
                </FormSelect>
              </FormGroup>
            </FormRow>
          </>
        );


      case 'change_own_password':
        return (
          <>
            <FormRow>
              <FormGroup>
                <FormLabel>Current Password *</FormLabel>
                <FormInput
                  type="password"
                  value={formData.current_password || ''}
                  onChange={(e) => handleFormChange('current_password', e.target.value)}
                  placeholder="Enter your current password"
                  required
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>New Password *</FormLabel>
                <FormInput
                  type="password"
                  value={formData.new_password || ''}
                  onChange={(e) => handleFormChange('new_password', e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>Confirm New Password *</FormLabel>
                <FormInput
                  type="password"
                  value={formData.confirm_password || ''}
                  onChange={(e) => handleFormChange('confirm_password', e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
                {formData.new_password && formData.confirm_password &&
                 formData.new_password !== formData.confirm_password && (
                  <div style={{ color: '#c53030', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Passwords do not match
                  </div>
                )}
              </FormGroup>
            </FormRow>
          </>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    const isEdit = selectedItem;
    switch (modalType) {
      case 'post':
        return isEdit ? 'Edit Post' : 'Create New Post';
      case 'user':
        return isEdit ? 'Edit User' : 'Create New User';
      case 'change_own_password':
        return 'Change My Password';
      case 'category':
        return isEdit ? 'Edit Category' : 'Create New Category';
      case 'tag':
        return isEdit ? 'Edit Tag' : 'Create New Tag';
      case 'media':
        return isEdit ? 'Edit Media' : 'Upload New Media';
      default:
        return 'Create New Item';
    }
  };

  return (
    <AdminContainer>
      <AuthNotification />
      {sidebarOpen && <SidebarOverlay onClick={() => setSidebarOpen(false)} />}
      <Sidebar $isOpen={sidebarOpen}>
        <SidebarHeader>
          <SidebarLogo>
            <img src="/src/assets/mm_horizontal.png" alt="MM4All" />
          </SidebarLogo>
          <SidebarTitle>Admin Portal</SidebarTitle>
        </SidebarHeader>
        <SidebarNav>
          <NavItem
            $active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaChartBar /> Dashboard
          </NavItem>
          {hasPermission('posts.read') && (
            <NavItem
              $active={activeTab === 'posts'}
              onClick={() => setActiveTab('posts')}
            >
              <FaFileAlt /> Posts
            </NavItem>
          )}
          {hasPermission('admin.read') && (
            <NavItem
              $active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
            >
              <FaUsers /> Users
            </NavItem>
          )}
          {hasPermission('categories.manage') && (
            <NavItem
              $active={activeTab === 'categories'}
              onClick={() => setActiveTab('categories')}
            >
              <FaTags /> Categories
            </NavItem>
          )}
          {hasPermission('tags.manage') && (
            <NavItem
              $active={activeTab === 'tags'}
              onClick={() => setActiveTab('tags')}
            >
              <FaTags /> Tags
            </NavItem>
          )}

        </SidebarNav>
      </Sidebar>
      <MainContent>
        <ContentHeader>
          <HeaderLeft>
            <MobileMenuButton
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FaBars />
            </MobileMenuButton>
            <HeaderContent>
              <PageTitle>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </PageTitle>
              <PageSubtitle>
                {activeTab === 'dashboard' && 'Overview & Analytics'}
                {activeTab === 'posts' && 'Content Management'}
                {activeTab === 'users' && 'User Administration'}
                {activeTab === 'categories' && 'Content Organization'}
                {activeTab === 'tags' && 'Tag Management'}
              </PageSubtitle>
            </HeaderContent>
          </HeaderLeft>
          <HeaderActions>
            <SearchInput
              type="text"
              placeholder="Search across all content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <UserDropdown data-dropdown>
              <UserInfo onClick={() => setShowUserDropdown(!showUserDropdown)}>
                <UserAvatar src={user?.avatar_url} alt={user?.full_name} />
                <UserDetails>
                  <UserName>{user?.full_name}</UserName>
                  <UserRole>{user?.role?.replace('_', ' ')}</UserRole>
                </UserDetails>
              </UserInfo>
              {showUserDropdown && (
                <DropdownMenu>
                  <DropdownItem onClick={() => window.open('/', '_blank')}>
                    <FaHome /> View Site
                  </DropdownItem>
                  <DropdownItem onClick={handleChangeOwnPassword}>
                    <FaKey /> Change Password
                  </DropdownItem>
                  <DropdownItem onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </DropdownItem>
                </DropdownMenu>
              )}
            </UserDropdown>
          </HeaderActions>
        </ContentHeader>
        <ContentBody>
          {renderTabContent()}
        </ContentBody>
      </MainContent>
      {/* Post Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <ModalOverlay>
          <ModalContainer>
            <ModalHeader>
              <ModalTitle>
                {getModalTitle()}
              </ModalTitle>
              <ModalCloseButton 
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setSelectedItem(null);
                  setFormData({});
                  setModalType('');
                }}
              >
                <FaTimes />
              </ModalCloseButton>
            </ModalHeader>
            <ModalForm onSubmit={getSubmitHandler()}>
              {renderModalContent()}
              <ModalActions>
                <CancelButton 
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setSelectedItem(null);
                    setFormData({});
                    setModalType('');
                  }}
                >
                  Cancel
                </CancelButton>
                <SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="spinner" />
                      {selectedItem ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <FaSave />
                      {selectedItem ? `Update ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}` : `Create ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}
                    </>
                  )}
                </SubmitButton>
              </ModalActions>
            </ModalForm>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* Publish Modal */}
      {showPublishModal && (
        <ModalOverlay>
          <ModalContainer style={{ maxWidth: '600px' }}>
            <ModalHeader>
              <h2>Publish Post</h2>
              <p style={{ margin: '0.5rem 0 0 0', color: '#718096', fontSize: '0.9rem' }}>
                Please select a category. Thumbnail will be automatically resolved if not provided.
              </p>
              <ModalCloseButton
                onClick={() => {
                  setShowPublishModal(false);
                  setPublishData(null);
                  setPreviewThumbnail(null);
                }}
              >
                <FaTimes />
              </ModalCloseButton>
            </ModalHeader>
            <PublishModalForm onSubmit={(e) => {
              e.preventDefault();

              try {
                const formData = new FormData(e.target);
                const publishFormData = {
                  category_id: formData.get('category_id'),
                  featured_image: formData.get('featured_image')
                };

                handleFinalPublish(publishFormData);
              } catch (error) {
                showNotification('Error submitting publish form: ' + error.message, 'error');
              }
            }}>
              <FormGroup>
                <FormLabel>Post Title</FormLabel>
                <FormInput
                  type="text"
                  value={publishData?.title || ''}
                  disabled
                  style={{ background: '#f7fafc', color: '#4a5568' }}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Category *</FormLabel>
                <FormSelect
                  name="category_id"
                  required
                  defaultValue=""
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Thumbnail Image (Optional)</FormLabel>
                <FormInput
                  type="url"
                  name="featured_image"
                  placeholder="Enter thumbnail image URL (optional)"
                  onChange={handleThumbnailInputChange}
                />
                <small style={{ color: '#718096', marginTop: '0.25rem' }}>
                  If not provided, thumbnail will be automatically resolved from video or first image in content
                </small>

                {/* Thumbnail Preview */}
                {previewThumbnail && (
                  <div style={{ marginTop: '1rem' }}>
                    <small style={{ color: '#4a5568', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>
                      Preview:
                    </small>
                    <div style={{
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '8px',
                      backgroundColor: '#f8fafc',
                      maxWidth: '200px'
                    }}>
                      <img
                        src={previewThumbnail}
                        alt="Thumbnail preview"
                        style={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: '4px',
                          display: 'block'
                        }}
                        onError={(e) => {
                          e.target.src = '/images/default-post-thumbnail.svg';
                        }}
                      />
                    </div>
                  </div>
                )}
              </FormGroup>

              <ModalActions>
                <CancelButton
                  type="button"
                  onClick={() => {
                    setShowPublishModal(false);
                    setPublishData(null);
                    setPreviewThumbnail(null);
                  }}
                >
                  Cancel
                </CancelButton>
                <SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="spinner" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Publish Post
                    </>
                  )}
                </SubmitButton>
              </ModalActions>
            </PublishModalForm>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* Notifications */}
      <NotificationContainer>
        {notifications.map(notification => (
          <NotificationItem 
            key={notification.id} 
            type={notification.type}
            onClick={() => removeNotification(notification.id)}
            title="Click to dismiss"
          >
            {notification.message}
          </NotificationItem>
        ))}
      </NotificationContainer>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <ConfirmDialogOverlay
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                if (confirmDialog.onCancel) {
                  confirmDialog.onCancel();
                } else {
                  hideConfirmDialog();
                }
              }
            }}
          >
            <ConfirmDialogContent
              as={motion.div}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ConfirmDialogTitle>{confirmDialog.title}</ConfirmDialogTitle>
              <ConfirmDialogMessage>{confirmDialog.message}</ConfirmDialogMessage>
              <ConfirmDialogActions>
                <ConfirmDialogButton
                  className="cancel"
                  onClick={() => {
                    if (confirmDialog.onCancel) {
                      confirmDialog.onCancel();
                    } else {
                      hideConfirmDialog();
                    }
                  }}
                >
                  Cancel
                </ConfirmDialogButton>
                <ConfirmDialogButton
                  className="confirm"
                  onClick={() => {
                    if (confirmDialog.onConfirm) {
                      confirmDialog.onConfirm();
                    }
                  }}
                >
                  Delete
                </ConfirmDialogButton>
              </ConfirmDialogActions>
            </ConfirmDialogContent>
          </ConfirmDialogOverlay>
        )}
      </AnimatePresence>
    </AdminContainer>
  );
};
// Styled Components (continued in next part due to length)
const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--background-light);
  font-family: 'Noto Sans', 'Roboto', sans-serif;
`;

const SidebarOverlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(var(--lavender-rgb), 0.1);
    backdrop-filter: blur(8px);
    z-index: 999;
    transition: var(--transition);
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
`;

const PaginationButton = styled.button`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.active ? 'var(--lavender)' : 'var(--tertiary-color)'};
  background: ${props => props.active ? 'var(--lavender)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--lavender-darker)'};
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: var(--transition);

  &:hover:not(:disabled) {
    background: ${props => props.active ? 'var(--lavender-dark)' : 'rgba(var(--lavender-rgb), 0.05)'};
    border-color: var(--lavender);
    color: ${props => props.active ? 'white' : 'var(--lavender)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationInfo = styled.span`
  font-size: 0.9rem;
  color: var(--lavender-dark);
  margin: 0 1.5rem;
  font-weight: 500;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  min-height: 200px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  background: #fef5e7;

  h3 {
    color: #c53030;
    margin-bottom: 1rem;
  }

  p {
    color: #744210;
    margin-bottom: 1rem;
  }

  button {
    background: #3182ce;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #2c5aa0;
    }
  }
`;
const Sidebar = styled.div`
  width: 250px;
  background: white;
  border-right: 1px solid var(--tertiary-color);
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px rgba(var(--lavender-rgb), 0.08);

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: ${props => props.$isOpen ? '0' : '-250px'};
    height: 100vh;
    z-index: 1000;
    transition: left 0.3s ease;
  }
`;

const SidebarHeader = styled.div`
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid var(--tertiary-color);
  text-align: center;
  background: linear-gradient(135deg, var(--tertiary-color) 0%, rgba(var(--lavender-rgb), 0.05) 100%);
`;

const SidebarLogo = styled.div`
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: center;
  img {
    height: 45px;
    width: auto;
    max-width: 180px;
    object-fit: contain;
    filter: drop-shadow(0 2px 8px rgba(var(--lavender-rgb), 0.2));
  }
`;

const SidebarTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--lavender-darker);
  margin: 0;
  letter-spacing: -0.01em;
`;

const SidebarNav = styled.nav`
  flex: 1;
  padding: 1.5rem 0;
`;
const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  cursor: pointer;
  transition: var(--transition);
  color: ${props => props.$active ? 'var(--lavender)' : 'var(--lavender-darker)'};
  background: ${props => props.$active ? 'rgba(var(--lavender-rgb), 0.1)' : 'transparent'};
  border-right: ${props => props.$active ? '4px solid var(--lavender)' : '4px solid transparent'};
  font-weight: ${props => props.$active ? '600' : '500'};
  font-size: 0.95rem;

  &:hover {
    background: rgba(var(--lavender-rgb), 0.08);
    color: var(--lavender);
    transform: translateX(4px);
  }

  svg {
    font-size: 1.1rem;
    opacity: ${props => props.$active ? '1' : '0.7'};
  }
`;
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--background-light);

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2.5rem;
  background: white;
  border-bottom: 1px solid var(--tertiary-color);
  box-shadow: 0 2px 8px rgba(var(--lavender-rgb), 0.06);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--lavender-darker);
  cursor: pointer;
  padding: 0.75rem;
  border-radius: var(--border-radius);
  transition: var(--transition);

  &:hover {
    background: rgba(var(--lavender-rgb), 0.1);
    color: var(--lavender);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--lavender-darker);
  margin: 0;
  letter-spacing: -0.02em;
`;

const PageSubtitle = styled.p`
  font-size: 0.95rem;
  color: var(--lavender-dark);
  margin: 0;
  font-weight: 400;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1.25rem;
  border: 2px solid var(--tertiary-color);
  border-radius: var(--border-radius);
  width: 300px;
  font-size: 0.95rem;
  transition: var(--transition);
  background: rgba(255, 255, 255, 0.8);

  &:focus {
    outline: none;
    border-color: var(--lavender);
    box-shadow: 0 0 0 3px rgba(var(--lavender-rgb), 0.1);
    background: white;
  }

  &::placeholder {
    color: var(--lavender-dark);
  }

  @media (max-width: 768px) {
    width: 200px;
  }
`;
const ContentBody = styled.div`
  flex: 1;
  padding: 2.5rem;
  overflow-y: auto;
  background: var(--background-light);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 1px solid var(--tertiary-color);
  transition: var(--transition);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(var(--lavender-rgb), 0.15);
  }
`;

const StatIcon = styled.div`
  width: 70px;
  height: 70px;
  background: var(--gradient-primary);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.75rem;
  box-shadow: 0 4px 12px rgba(var(--lavender-rgb), 0.3);
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatNumber = styled.div`
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--lavender-darker);
  margin-bottom: 0.25rem;
  letter-spacing: -0.02em;
`;

const StatLabel = styled.div`
  color: var(--lavender-dark);
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const StatChange = styled.div`
  font-size: 0.9rem;
  color: ${props => props.$positive ? '#38a169' : 'var(--lavender-dark)'};
  font-weight: 500;
`;
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
  .spinner {
    font-size: 2rem;
    color: #667eea;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
const TabContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;
const TabHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`;
const TabTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
`;
const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 700;
  font-size: 0.95rem;
  transition: var(--transition);
  box-shadow: 0 4px 12px rgba(var(--lavender-rgb), 0.3);
  letter-spacing: -0.01em;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(var(--lavender-rgb), 0.4);
  }

  svg {
    font-size: 1.1rem;
  }
`;
const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  border: 1px solid var(--tertiary-color);

  @media (max-width: 768px) {
    margin: 0 -1rem;
  }
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, var(--tertiary-color) 0%, rgba(var(--lavender-rgb), 0.05) 100%);

  th {
    padding: 1.25rem 1.75rem;
    text-align: left;
    font-weight: 700;
    color: var(--lavender-darker);
    border-bottom: 1px solid var(--tertiary-color);
    font-size: 0.95rem;
    letter-spacing: -0.01em;
  }
`;

const TableRow = styled.tr`
  transition: var(--transition);

  &:hover {
    background: rgba(var(--lavender-rgb), 0.03);
  }

  &.selected {
    background: rgba(var(--lavender-rgb), 0.08);
    border-left: 4px solid var(--lavender);
  }

  &.selected:hover {
    background: rgba(var(--lavender-rgb), 0.12);
  }

  td {
    padding: 1.25rem 1.75rem;
    border-bottom: 1px solid var(--tertiary-color);
    color: var(--lavender-darker);
    font-weight: 500;
    vertical-align: top;
  }
`;
const PostTitle = styled.div`
  font-weight: 700;
  color: var(--lavender-darker);
  margin-bottom: 0.5rem;
  font-size: 1rem;
  line-height: 1.4;
`;

const PostExcerpt = styled.div`
  color: var(--lavender-dark);
  font-size: 0.9rem;
  max-width: 350px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  white-space: nowrap;
`;

const PostThumbnail = styled.img`
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
`;

const NoImagePlaceholder = styled.div`
  width: 60px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  color: #a0aec0;
`;

const CategoryBadge = styled.span`
  background: var(--gradient-primary);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: var(--border-radius);
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  display: inline-block;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 2px 4px rgba(var(--lavender-rgb), 0.2);
`;
const StatusBadge = styled.span`
  padding: 0.4rem 0.9rem;
  border-radius: var(--border-radius);
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  text-transform: capitalize;
  background: ${props => {
    switch (props.status) {
      case 'published': case 'active': case 'approved': return 'linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%)';
      case 'draft': case 'inactive': return 'linear-gradient(135deg, #fed7cc 0%, #feb2b2 100%)';
      case 'pending': return 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
      case 'rejected': case 'spam': return 'linear-gradient(135deg, #fecaca 0%, #f87171 100%)';
      default: return 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'published': case 'active': case 'approved': return '#22543d';
      case 'draft': case 'inactive': return '#c53030';
      case 'pending': return '#d69e2e';
      case 'rejected': case 'spam': return '#c53030';
      default: return '#4a5568';
    }
  }};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  padding: 0.75rem;
  background: ${props => props.danger ? 'linear-gradient(135deg, #fed7d7 0%, #fbb6ce 100%)' : 'rgba(var(--lavender-rgb), 0.1)'};
  color: ${props => props.danger ? '#c53030' : 'var(--lavender)'};
  border: 1px solid ${props => props.danger ? '#f687b3' : 'var(--lavender)'};
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-weight: 600;

  &:hover {
    background: ${props => props.danger ? 'linear-gradient(135deg, #fbb6ce 0%, #f687b3 100%)' : 'rgba(var(--lavender-rgb), 0.2)'};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.danger ? 'rgba(197, 48, 48, 0.2)' : 'rgba(var(--lavender-rgb), 0.3)'};
  }

  svg {
    font-size: 1rem;
  }
`;
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  border: 1px solid var(--tertiary-color);
  background: white;

  &:hover {
    background: rgba(var(--lavender-rgb), 0.05);
    border-color: var(--lavender);
  }
`;

const UserAvatar = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(var(--lavender-rgb), 0.2);

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const UserName = styled.div`
  font-weight: 700;
  color: var(--lavender-darker);
  font-size: 0.95rem;
`;

const UserUsername = styled.div`
  font-size: 0.85rem;
  color: var(--lavender-dark);
  font-weight: 500;
`;

const UserRole = styled.div`
  font-size: 0.85rem;
  color: var(--lavender-dark);
  font-weight: 500;
  text-transform: capitalize;
`;
const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
const CategoryColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => props.color || '#e2e8f0'};
  flex-shrink: 0;
`;
const CategoryName = styled.div`
  font-weight: 600;
  color: #2d3748;
`;
const CategoryDescription = styled.div`
  font-size: 0.8rem;
  color: #718096;
  margin-top: 0.25rem;
`;
const CategorySlug = styled.code`
  background: #f7fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #4a5568;
  font-family: 'Courier New', monospace;
`;
const TagsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
`;
const TagCard = styled.div`
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  transition: all 0.2s ease;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;
const TagHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
const TagColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.color || '#667eea'};
  flex-shrink: 0;
`;
const TagName = styled.div`
  font-weight: 600;
  color: #2d3748;
  font-size: 1.1rem;
`;
const TagSlug = styled.code`
  background: #f7fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #4a5568;
  font-family: 'Courier New', monospace;
  margin-top: 0.25rem;
`;
const TagStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const TagUsage = styled.div`
  font-size: 0.9rem;
  color: #667eea;
  font-weight: 500;
`;
const TagMeta = styled.div`
  font-size: 0.8rem;
  color: #a0aec0;
  font-family: monospace;
`;
const TagDescription = styled.div`
  font-size: 0.9rem;
  color: #718096;
  line-height: 1.4;
`;
const TagDates = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;
const TagDate = styled.div`
  font-size: 0.75rem;
  color: #a0aec0;
`;
const TagActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 1px solid #f1f3f4;
`;
const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    padding: 1rem;
    gap: 0.75rem;
  }
`;
const MediaCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
`;
const MediaPreview = styled.div`
  height: 150px;
  background: #f7fafc;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const MediaImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const MediaIcon = styled.div`
  font-size: 2rem;
  color: #a0aec0;
`;
const MediaInfo = styled.div`
  padding: 1rem;
`;
const MediaName = styled.div`
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const MediaSize = styled.div`
  font-size: 0.8rem;
  color: #718096;
`;
const MediaMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: #718096;
`;
const MediaDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
  small {
    font-size: 0.75rem;
    color: #a0aec0;
  }
`;
const MediaActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: #f7fafc;
`;
const CommentAuthor = styled.div`
  div:first-child {
    font-weight: 500;
    color: #2d3748;
  }
  div:last-child {
    font-size: 0.8rem;
    color: #718096;
  }
`;
const CommentContent = styled.div`
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #718096;
  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  div {
    font-size: 1.1rem;
  }
`;

// Modal Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(var(--lavender-rgb), 0.1);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: var(--border-radius);
  width: 95%;
  max-width: 1200px;
  max-height: 95vh;
  overflow-y: auto;
  box-shadow: var(--shadow);
  border: 1px solid var(--tertiary-color);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    margin: 0;
  }
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2.5rem;
  border-bottom: 1px solid var(--tertiary-color);
  background: linear-gradient(135deg, var(--tertiary-color) 0%, rgba(var(--lavender-rgb), 0.05) 100%);
`;

const ModalTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--lavender-darker);
  margin: 0;
  letter-spacing: -0.02em;
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--lavender-dark);
  cursor: pointer;
  padding: 0.75rem;
  border-radius: var(--border-radius);
  transition: var(--transition);

  &:hover {
    background: rgba(var(--lavender-rgb), 0.1);
    color: var(--lavender);
  }
`;
const ModalForm = styled.form`
  padding: 2rem;
`;

const PublishModalForm = styled.form`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;
const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 700;
  color: var(--lavender-darker);
  font-size: 0.95rem;
  letter-spacing: -0.01em;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--tertiary-color);
  border-radius: var(--border-radius);
  font-family: inherit;
  font-size: 0.95rem;
  transition: var(--transition);
  background: rgba(255, 255, 255, 0.8);

  &:focus {
    outline: none;
    border-color: var(--lavender);
    box-shadow: 0 0 0 3px rgba(var(--lavender-rgb), 0.1);
    background: white;
  }

  &::placeholder {
    color: var(--lavender-dark);
  }
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
`;
const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
`;
const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
`;
const ModalActions = styled.div`
  display: flex;
  gap: 1.25rem;
  justify-content: flex-end;
  padding: 2rem 2.5rem;
  border-top: 1px solid var(--tertiary-color);
  background: rgba(var(--lavender-rgb), 0.02);
`;

const CancelButton = styled.button`
  padding: 1rem 2rem;
  border: 2px solid var(--tertiary-color);
  background: white;
  color: var(--lavender-darker);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: var(--transition);

  &:hover {
    background: rgba(var(--lavender-rgb), 0.05);
    border-color: var(--lavender);
    color: var(--lavender);
  }
`;
const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 700;
  font-size: 0.95rem;
  transition: var(--transition);
  box-shadow: 0 4px 12px rgba(var(--lavender-rgb), 0.3);
  letter-spacing: -0.01em;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(var(--lavender-rgb), 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 4px 12px rgba(var(--lavender-rgb), 0.2);
  }

  svg {
    font-size: 1.1rem;
  }
  .spinner {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Image Upload Styled Components
const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ImagePreview = styled.div`
  position: relative;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  max-width: 400px;
  
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(229, 62, 62, 0.9);
    transform: scale(1.1);
  }
`;

const ImageUploadOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ImageUploadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px dashed #cbd5e0;
  background: #f7fafc;
  color: #4a5568;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
    background: #edf2f7;
    color: #667eea;
  }
`;

const UserDropdown = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid var(--tertiary-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  min-width: 180px;
  z-index: 1000;
  margin-top: 0.75rem;
  overflow: hidden;
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: var(--transition);
  color: var(--lavender-darker);
  font-weight: 500;

  &:hover {
    background: rgba(var(--lavender-rgb), 0.08);
    color: var(--lavender);
  }

  svg {
    font-size: 1.1rem;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  &:only-child {
    border-radius: 8px;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NotificationItem = styled.div`
  background: ${props => {
    switch (props.type) {
      case 'success':
        return 'linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%)';
      case 'error':
        return 'linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #fef5e7 0%, #fbd38d 100%)';
      case 'info':
        return 'linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%)';
      default:
        return 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'success':
        return '#22543d';
      case 'error':
        return '#c53030';
      case 'warning':
        return '#c05621';
      case 'info':
        return '#0f4c75';
      default:
        return '#4a5568';
    }
  }};
  padding: 1rem 1.25rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: slideIn 0.3s ease-out, fadeOut 0.3s ease-out 4.7s forwards;
  position: relative;
  border: 1px solid ${props => {
    switch (props.type) {
      case 'success':
        return '#68d391';
      case 'error':
        return '#fc8181';
      case 'warning':
        return '#f6ad55';
      case 'info':
        return '#63b3ed';
      default:
        return '#cbd5e0';
    }
  }};
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &::before {
    content: ${props => {
      switch (props.type) {
        case 'success':
          return "'✓'";
        case 'error':
          return "'✗'";
        case 'warning':
          return "'⚠'";
        case 'info':
          return "'ℹ'";
        default:
          return "'•'";
      }
    }};
    font-weight: bold;
    font-size: 1.1rem;
    margin-right: 0.5rem;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;

// Confirmation Dialog Styles
const ConfirmDialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  animation: fadeIn 0.2s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ConfirmDialogContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease-out;
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ConfirmDialogTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
`;

const ConfirmDialogMessage = styled.p`
  margin: 0 0 2rem 0;
  color: #4a5568;
  line-height: 1.6;
`;

const ConfirmDialogActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const ConfirmDialogButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.cancel {
    background: #f7fafc;
    color: #4a5568;
    
    &:hover {
      background: #edf2f7;
    }
  }
  
  &.confirm {
    background: #e53e3e;
    color: white;
    
    &:hover {
      background: #c53030;
    }
  }
`;

// Add EditorContainer styled component for modal editor usage
const EditorContainer = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  min-height: 400px;
  padding: 24px 16px;
`;

// Bulk Actions Styled Components
const BulkActionsToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const BulkActionsInfo = styled.div`
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
`;

const BulkActionsButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const BulkActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.danger && `
    background: #fed7d7;
    border-color: #fc8181;
    color: #c53030;

    &:hover:not(:disabled) {
      background: #feb2b2;
      border-color: #f56565;
    }
  `}

  ${props => props.secondary && `
    background: white;
    border-color: #e2e8f0;
    color: #4a5568;

    &:hover:not(:disabled) {
      background: #f7fafc;
      border-color: #cbd5e0;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

// Checkbox styling
const CheckboxCell = styled.td`
  text-align: center;
  width: 50px;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #3b82f6;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

const CheckboxHeader = styled.th`
  width: 50px;
  text-align: center;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #3b82f6;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

export default AdminDashboardMain;
