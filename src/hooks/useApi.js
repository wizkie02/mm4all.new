import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
// Custom hook for managing API data with loading states
export const useApiData = (endpoint, params = {}, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService[endpoint](params);
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(params), ...dependencies]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
};
// Custom hook for managing paginated data
export const usePaginatedData = (endpoint, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 20,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({ page: 1, limit: 20, ...initialParams });
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService[endpoint](params);
      if (response.success) {
        setData(response.data[endpoint] || response.data.items || []);
        setPagination(response.data.pagination || {});
      } else {
        setError(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(params)]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };
  const nextPage = () => {
    if (pagination.has_next) {
      updateParams({ page: pagination.current_page + 1 });
    }
  };
  const prevPage = () => {
    if (pagination.has_prev) {
      updateParams({ page: pagination.current_page - 1 });
    }
  };
  const goToPage = (page) => {
    updateParams({ page });
  };
  return {
    data,
    pagination,
    loading,
    error,
    params,
    updateParams,
    nextPage,
    prevPage,
    goToPage,
    refetch: fetchData
  };
};
// Custom hook for CRUD operations
export const useCrudOperations = (resourceType) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const create = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const methodName = `create${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`;
      const response = await apiService[methodName](data);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'Failed to create item');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = err.message || 'Network error';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };
  const update = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const methodName = `update${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`;
      const response = await apiService[methodName](id, data);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'Failed to update item');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = err.message || 'Network error';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };
  const remove = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const methodName = `delete${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`;
      const response = await apiService[methodName](id);
      if (response.success) {
        return { success: true };
      } else {
        setError(response.error || 'Failed to delete item');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = err.message || 'Network error';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };
  return {
    create,
    update,
    remove,
    loading,
    error,
    clearError: () => setError(null)
  };
};
// Hook for managing form state with validation
export const useFormState = (initialState, validationRules = {}) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const updateField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  const touchField = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };
  const validateForm = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach(field => {
      const rules = validationRules[field];
      const value = formData[field];
      if (rules.required && (!value || value.toString().trim() === '')) {
        newErrors[field] = `${field} is required`;
      } else if (rules.minLength && value && value.length < rules.minLength) {
        newErrors[field] = `${field} must be at least ${rules.minLength} characters`;
      } else if (rules.maxLength && value && value.length > rules.maxLength) {
        newErrors[field] = `${field} must be no more than ${rules.maxLength} characters`;
      } else if (rules.pattern && value && !rules.pattern.test(value)) {
        newErrors[field] = rules.patternMessage || `${field} format is invalid`;
      } else if (rules.custom && value) {
        const customError = rules.custom(value, formData);
        if (customError) {
          newErrors[field] = customError;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const resetForm = (newState = initialState) => {
    setFormData(newState);
    setErrors({});
    setTouched({});
  };
  return {
    formData,
    errors,
    touched,
    updateField,
    touchField,
    validateForm,
    resetForm,
    isValid: Object.keys(errors).length === 0,
    isDirty: JSON.stringify(formData) !== JSON.stringify(initialState)
  };
};
// Hook for managing local storage state
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      }
  };
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      }
  };
  return [storedValue, setValue, removeValue];
};
export default {
  useApiData,
  usePaginatedData,
  useCrudOperations,
  useFormState,
  useLocalStorage
};
