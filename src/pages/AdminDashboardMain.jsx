import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import {
  FaPlus, FaEdit, FaTrash, FaEye, FaSignOutAlt,
  FaSpinner, FaUser, FaBars, FaTimes, FaFileAlt, FaUsers
} from 'react-icons/fa';

const AdminDashboardMain = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Simplified state management
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState('');
  
  // Data states
  const [posts, setPosts] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0
  });

  // Load data on mount and tab change
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (activeTab === 'posts') {
        await loadPosts();
        await loadStats();
      } else if (activeTab === 'admins' && user.role === 'super_admin') {
        await loadAdmins();
      }
    } catch (error) {
      setError('Failed to load data: ' + error.message);
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const response = await apiService.getPosts();
      if (response.success) {
        setPosts(response.data.posts || []);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const loadStats = async () => {
    try {
      // Calculate stats from posts data
      const totalPosts = posts.length;
      const publishedPosts = posts.filter(p => p.status === 'published').length;
      const draftPosts = posts.filter(p => p.status === 'draft').length;
      const totalViews = posts.reduce((sum, post) => sum + (post.view_count || 0), 0);
      
      setStats({
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews
      });
    } catch (error) {
      console.error('Failed to calculate stats:', error);
    }
  };

  const loadAdmins = async () => {
    try {
      const response = await apiService.getUsers();
      if (response.success) {
        setAdmins(response.data.users || []);
      }
    } catch (error) {
      console.error('Failed to load admins:', error);
    }
  };

  // Post actions
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await apiService.deletePost(postId);
      if (response.success) {
        setPosts(posts.filter(p => p.id !== postId));
        showNotification('Post deleted successfully');
      } else {
        setError(response.error || 'Failed to delete post');
      }
    } catch (error) {
      setError('Failed to delete post: ' + error.message);
    }
  };

  const handleTogglePostStatus = async (postId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      const response = await apiService.updatePost(postId, { status: newStatus });
      if (response.success) {
        setPosts(posts.map(p => 
          p.id === postId ? { ...p, status: newStatus } : p
        ));
        showNotification(`Post ${newStatus} successfully`);
      } else {
        setError(response.error || 'Failed to update post status');
      }
    } catch (error) {
      setError('Failed to update post status: ' + error.message);
    }
  };

  // Simple notification system
  const showNotification = (message) => {
    // Simple alert for now - can be enhanced later
    alert(message);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
      navigate('/admin/login');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      published: '#10b981',
      draft: '#f59e0b',
      archived: '#6b7280'
    };
    
    return (
      <StatusBadge $color={colors[status] || '#6b7280'}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </StatusBadge>
    );
  };

  return (
    <DashboardContainer>
      {/* Mobile Menu Button */}
      <MobileMenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FaBars />
      </MobileMenuButton>

      {/* Sidebar */}
      <Sidebar $open={sidebarOpen}>
        <SidebarHeader>
          <h2>Max & Oli Admin</h2>
          <CloseButton onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </CloseButton>
        </SidebarHeader>

        <UserInfo>
          <FaUser />
          <div>
            <strong>{user?.name}</strong>
            <small>{user?.role}</small>
          </div>
        </UserInfo>

        <Navigation>
          <NavItem 
            $active={activeTab === 'posts'} 
            onClick={() => setActiveTab('posts')}
          >
            <FaFileAlt /> Posts
          </NavItem>
          
          {user?.role === 'super_admin' && (
            <NavItem 
              $active={activeTab === 'admins'} 
              onClick={() => setActiveTab('admins')}
            >
              <FaUsers /> Admin Users
            </NavItem>
          )}
        </Navigation>

        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </LogoutButton>
      </Sidebar>

      {/* Overlay for mobile */}
      {sidebarOpen && <Overlay onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <MainContent $sidebarOpen={sidebarOpen}>
        <Header>
          <h1>
            {activeTab === 'posts' && 'Content Management'}
            {activeTab === 'admins' && 'Admin Management'}
          </h1>
          
          {activeTab === 'posts' && (
            <CreateButton onClick={() => navigate('/admin/create')}>
              <FaPlus /> New Post
            </CreateButton>
          )}
        </Header>

        {error && (
          <ErrorMessage>
            {error}
            <button onClick={() => setError('')}>×</button>
          </ErrorMessage>
        )}

        {/* Stats Cards */}
        {activeTab === 'posts' && (
          <StatsGrid>
            <StatCard>
              <StatNumber>{stats.totalPosts}</StatNumber>
              <StatLabel>Total Posts</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.publishedPosts}</StatNumber>
              <StatLabel>Published</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.draftPosts}</StatNumber>
              <StatLabel>Drafts</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.totalViews}</StatNumber>
              <StatLabel>Total Views</StatLabel>
            </StatCard>
          </StatsGrid>
        )}

        {/* Content Area */}
        <ContentArea>
          {loading ? (
            <LoadingContainer>
              <FaSpinner className="spinner" />
              <span>Loading...</span>
            </LoadingContainer>
          ) : (
            <>
              {/* Posts Tab */}
              {activeTab === 'posts' && (
                <PostsTable>
                  <TableHeader>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Views</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </TableHeader>
                  <tbody>
                    {posts.length > 0 ? posts.map(post => (
                      <TableRow key={post.id}>
                        <td>
                          <PostTitle>{post.title}</PostTitle>
                          {post.excerpt && <PostExcerpt>{post.excerpt}</PostExcerpt>}
                        </td>
                        <td>{getStatusBadge(post.status)}</td>
                        <td>{post.view_count || 0}</td>
                        <td>{formatDate(post.created_at)}</td>
                        <td>
                          <ActionButtons>
                            <ActionButton
                              onClick={() => navigate(`/admin/edit/${post.id}`)}
                              title="Edit"
                            >
                              <FaEdit />
                            </ActionButton>
                            <ActionButton
                              onClick={() => handleTogglePostStatus(post.id, post.status)}
                              title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                              $color="#10b981"
                            >
                              <FaEye />
                            </ActionButton>
                            <ActionButton
                              onClick={() => handleDeletePost(post.id)}
                              title="Delete"
                              $color="#ef4444"
                            >
                              <FaTrash />
                            </ActionButton>
                          </ActionButtons>
                        </td>
                      </TableRow>
                    )) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                          No posts found. <button onClick={() => navigate('/admin/create')}>Create your first post</button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </PostsTable>
              )}

              {/* Admins Tab (Super Admin Only) */}
              {activeTab === 'admins' && user?.role === 'super_admin' && (
                <PostsTable>
                  <TableHeader>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </TableHeader>
                  <tbody>
                    {admins.length > 0 ? admins.map(admin => (
                      <TableRow key={admin.id}>
                        <td>{admin.name}</td>
                        <td>{admin.email}</td>
                        <td>{admin.role}</td>
                        <td>{getStatusBadge(admin.status)}</td>
                        <td>{formatDate(admin.created_at)}</td>
                      </TableRow>
                    )) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                          No admin users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </PostsTable>
              )}
            </>
          )}
        </ContentArea>
      </MainContent>
    </DashboardContainer>
  );
};

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
`;

const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  padding: 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #4a5568;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    display: block;
  }
`;

const Sidebar = styled.div`
  width: 280px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(${props => props.$open ? '0' : '-100%'});
  }
`;

const SidebarHeader = styled.div`
  padding: 2rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    color: #2d3748;
    font-size: 1.25rem;
  }
`;

const CloseButton = styled.button`
  display: none;
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: #4a5568;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #f7fafc;
  margin: 0 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;

  svg {
    color: #667eea;
    font-size: 1.25rem;
  }

  strong {
    display: block;
    color: #2d3748;
    font-size: 0.875rem;
  }

  small {
    display: block;
    color: #718096;
    font-size: 0.75rem;
    text-transform: capitalize;
  }
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 1rem 1.5rem;
`;

const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: ${props => props.$active ? '#667eea' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#4a5568'};
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;

  &:hover {
    background: ${props => props.$active ? '#5a67d8' : '#f7fafc'};
  }

  svg {
    font-size: 1rem;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: transparent;
  color: #e53e3e;
  border: none;
  border-top: 1px solid #e2e8f0;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;

  &:hover {
    background: #fed7d7;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 5rem 1rem 2rem 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    margin: 0;
    color: #2d3748;
    font-size: 2rem;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    
    h1 {
      font-size: 1.5rem;
    }
  }
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(var(--lavender-rgb), 0.3);
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fed7d7;
  border: 1px solid #feb2b2;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;

  button {
    background: none;
    border: none;
    color: inherit;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #718096;
  font-size: 0.875rem;
  font-weight: 500;
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
  color: #4a5568;

  .spinner {
    font-size: 2rem;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const PostsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f7fafc;

  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #2d3748;
    border-bottom: 1px solid #e2e8f0;
    font-size: 0.875rem;
    white-space: nowrap;
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;

  &:hover {
    background: #f7fafc;
  }

  td {
    padding: 1rem;
    vertical-align: top;
  }
`;

const PostTitle = styled.div`
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
`;

const PostExcerpt = styled.div`
  color: #718096;
  font-size: 0.75rem;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background: ${props => props.$color};
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  background: ${props => props.$color || '#667eea'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }

  svg {
    font-size: 0.75rem;
  }
`;

export default AdminDashboardMain;