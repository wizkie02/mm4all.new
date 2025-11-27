import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext(null);

// Global flag to prevent multiple auth initializations
let isAuthInitializing = false;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Check if we're on an admin page
  const isAdminPage = () => {
    return window.location.pathname === '/admin' ||
           window.location.pathname.startsWith('/admin/');
  };

  useEffect(() => {
    if (!isInitialized && !isInitializing) {
      setIsInitialized(true);
      setIsInitializing(true);

      // Only initialize auth for admin pages
      if (isAdminPage()) {
        initializeAuth().finally(() => setIsInitializing(false));
      } else {
        // For public pages, just set loading to false without auth
        setLoading(false);
        setIsInitializing(false);
      }
    }
  }, [isInitialized, isInitializing]);

  // Initialize auth state with automatic token refresh on page load (admin pages only)
  const initializeAuth = async () => {
    // Prevent multiple simultaneous initializations
    if (isAuthInitializing) {
      return;
    }

    // Double-check we're on an admin page before initializing auth
    if (!isAdminPage()) {
      setLoading(false);
      return;
    }

    isAuthInitializing = true;

    const token = apiService.getToken();
    const savedUser = localStorage.getItem('admin_user');
    const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);

        // Only attempt refresh if we have a valid token format and refresh token
        const refreshToken = apiService.getRefreshToken();
        if (token.split('.').length === 3 && refreshToken) {
          // Automatically refresh token on page load (silent)
          try {
            const refreshResponse = await apiService.refreshToken();

          if (refreshResponse && refreshResponse.success) {
            // Use admin data from refresh response if available
            if (refreshResponse.admin) {
              setUser(refreshResponse.admin);
              localStorage.setItem('admin_user', JSON.stringify(refreshResponse.admin));
            } else {
              // Fallback to verification if no admin data in refresh response
              const verifyResponse = await apiService.verifyToken();
              if (verifyResponse && verifyResponse.success && verifyResponse.admin) {
                setUser(verifyResponse.admin);
                localStorage.setItem('admin_user', JSON.stringify(verifyResponse.admin));
              }
            }
          } else {
            // If refresh fails, try verification as fallback
            const verifyResponse = await apiService.verifyToken();
            if (verifyResponse && verifyResponse.success && verifyResponse.admin) {
              setUser(verifyResponse.admin);
              localStorage.setItem('admin_user', JSON.stringify(verifyResponse.admin));
            } else {
              // Don't logout immediately, let user continue with cached data
              // They'll be logged out when they try to make an authenticated request
            }
          }
          } catch (error) {
            // Check if it's a CORS or network error (development environment)
            if (error.message.includes('CORS') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
              if (isDevelopment) {
                // In development, continue with cached data
              } else {
                logout();
                return;
              }
            } else {
              logout();
              return;
            }
          }
        }
      } catch (error) {
        logout();
        return;
      }
    }

    setLoading(false);
    isAuthInitializing = false;
  };

  const login = async (email, password, rememberMe = false) => {
    // Only allow login on admin pages
    if (!isAdminPage()) {
      return { success: false, error: 'Admin login not available on public pages' };
    }

    try {
      const response = await apiService.login(email, password, rememberMe);
      if (response.success && response.admin) {
        setUser(response.admin);
        setIsAuthenticated(true);
        // Save user data to localStorage for persistence
        localStorage.setItem('admin_user', JSON.stringify(response.admin));
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  const logout = useCallback(async () => {
    try {
      await apiService.logout();
    } catch (error) {
      // Silent error handling
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      // Clear saved user data
      localStorage.removeItem('admin_user');
    }
  }, []);
  const hasPermission = useCallback((permission) => {
    if (!user || !user.role) return false;
    // Super admin has all permissions
    if (user.role === 'super_admin') return true;
    // Define role-based permissions
    const rolePermissions = {
      admin: [
        'posts.create', 'posts.read', 'posts.update', 'posts.delete', 'posts.publish',
        'categories.manage', 'tags.manage', 'media.upload', 'media.manage',
        'comments.moderate', 'analytics.view', 'admin.create', 'admin.read', 'admin.update'
      ],
      editor: [
        'posts.create', 'posts.read', 'posts.update', 'posts.delete', 'posts.publish',
        'categories.manage', 'tags.manage', 'media.upload', 'media.manage',
        'comments.moderate', 'analytics.view'
      ],
      moderator: [
        'posts.create', 'posts.read', 'posts.update',
        'tags.manage', 'media.upload', 'comments.moderate'
      ]
    };
    return rolePermissions[user.role]?.includes(permission) || false;
  }, [user]);
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasPermission
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
