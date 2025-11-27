import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FaSpinner } from 'react-icons/fa';
const ProtectedRoute = ({ children, requiredPermission }) => {
  const { isAuthenticated, loading, hasPermission } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner>
          <FaSpinner className="spinner" />
          <LoadingText>Verifying authentication...</LoadingText>
        </LoadingSpinner>
      </LoadingContainer>
    );
  }
  if (!isAuthenticated) {
    // Redirect to login page with return path
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Redirect to unauthorized page or dashboard
    return <Navigate to="/admin/unauthorized" replace />;
  }
  return children;
};
const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;
const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
const LoadingText = styled.p`
  color: #4a5568;
  font-size: 1.1rem;
  margin: 0;
`;
export default ProtectedRoute;
