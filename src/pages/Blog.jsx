import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { FaCalendar, FaEye, FaUser, FaArrowLeft } from 'react-icons/fa';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/admin/posts/get_posts.php`);
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data.posts || []);
      } else {
        setError('Failed to load posts');
      }
    } catch (error) {
      setError('Failed to load posts');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <p>Loading posts...</p>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={fetchPosts}>Try Again</button>
      </ErrorContainer>
    );
  }

  return (
    <BlogContainer>
      <BlogHeader>
        <Link to="/">
          <BackButton>
            <FaArrowLeft /> Back to Home
          </BackButton>
        </Link>
        <HeaderContent>
          <h1>Max & Oli Blog</h1>
          <p>Insights, stories, and updates from our journey</p>
        </HeaderContent>
      </BlogHeader>

      <PostsGrid>
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard 
              key={post.id}
              as={motion.article}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {post.featured_image_url && (
                <PostImage>
                  <img src={post.featured_image_url} alt={post.title} />
                </PostImage>
              )}
              
              <PostContent>
                <PostTitle>
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </PostTitle>
                
                {post.excerpt && (
                  <PostExcerpt>{post.excerpt}</PostExcerpt>
                )}
                
                <PostMeta>
                  <MetaItem>
                    <FaUser />
                    <span>{post.author_name || 'Admin'}</span>
                  </MetaItem>
                  <MetaItem>
                    <FaCalendar />
                    <span>{formatDate(post.published_at || post.created_at)}</span>
                  </MetaItem>
                  <MetaItem>
                    <FaEye />
                    <span>{post.view_count || 0} views</span>
                  </MetaItem>
                </PostMeta>
                
                <ReadMoreLink to={`/blog/${post.slug}`}>
                  Read More →
                </ReadMoreLink>
              </PostContent>
            </PostCard>
          ))
        ) : (
          <EmptyState>
            <h2>No posts yet</h2>
            <p>Check back soon for new content!</p>
          </EmptyState>
        )}
      </PostsGrid>
    </BlogContainer>
  );
};

// Single Post Page
export const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/public/get_post.php?slug=${encodeURIComponent(slug)}`);
      const data = await response.json();
      
      if (data.success) {
        setPost(data.data.post);
      } else {
        setError(data.error || 'Post not found');
      }
    } catch (error) {
      setError('Failed to load post');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <p>Loading post...</p>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <h2>Post Not Found</h2>
        <p>{error}</p>
        <Link to="/blog">← Back to Blog</Link>
      </ErrorContainer>
    );
  }

  if (!post) return null;

  return (
    <PostContainer>
      <PostHeader>
        <Link to="/blog">
          <BackButton>
            <FaArrowLeft /> Back to Blog
          </BackButton>
        </Link>
        
        {post.featured_image_url && (
          <FeaturedImage>
            <img src={post.featured_image_url} alt={post.title} />
          </FeaturedImage>
        )}
        
        <PostTitle>{post.title}</PostTitle>
        
        <PostMeta>
          <MetaItem>
            <FaUser />
            <span>{post.author_name || 'Admin'}</span>
          </MetaItem>
          <MetaItem>
            <FaCalendar />
            <span>{new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </MetaItem>
          <MetaItem>
            <FaEye />
            <span>{post.view_count || 0} views</span>
          </MetaItem>
        </PostMeta>
      </PostHeader>

      <PostBody>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </PostBody>
    </PostContainer>
  );
};

// Styled Components
const BlogContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const BlogHeader = styled.header`
  max-width: 1200px;
  margin: 0 auto 3rem auto;
  text-align: center;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-bottom: 2rem;

  &:hover {
    background: #f7fafc;
    transform: translateY(-1px);
  }
`;

const HeaderContent = styled.div`
  h1 {
    font-size: 3rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.25rem;
    color: #718096;
  }
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const PostCard = styled.article`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
`;

const PostImage = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const PostContent = styled.div`
  padding: 1.5rem;
`;

const PostTitle = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;

  a {
    color: #2d3748;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--lavender);
    }
  }
`;

const PostExcerpt = styled.p`
  color: #718096;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #718096;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 0.75rem;
    color: var(--lavender);
  }
`;

const ReadMoreLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: var(--lavender);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    color: var(--lavender-dark);
    transform: translateX(4px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
  color: #718096;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: var(--lavender);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
  text-align: center;
  color: #718096;

  h2 {
    color: #2d3748;
  }

  button, a {
    padding: 0.75rem 1.5rem;
    background: var(--lavender);
    color: white;
    border: none;
    border-radius: 8px;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--lavender-dark);
    }
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: #718096;

  h2 {
    color: #2d3748;
    margin-bottom: 1rem;
  }
`;

// Single Post Styles
const PostContainer = styled.article`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const PostHeader = styled.header`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 2rem 0 2rem;
`;

const FeaturedImage = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    height: 250px;
  }
`;

const PostBody = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  margin-top: 2rem;
  margin-bottom: 2rem;
  line-height: 1.8;

  h1, h2, h3, h4, h5, h6 {
    margin: 2rem 0 1rem 0;
    color: #2d3748;
    font-weight: 600;
  }

  p {
    margin-bottom: 1.5rem;
    color: #4a5568;
  }

  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }

  blockquote {
    border-left: 4px solid var(--lavender);
    padding-left: 1rem;
    margin: 2rem 0;
    font-style: italic;
    color: #718096;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 2rem 0;
  }

  code {
    background: #f7fafc;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
  }

  a {
    color: var(--lavender);
    text-decoration: underline;

    &:hover {
      color: var(--lavender-dark);
    }
  }
`;

export default Blog;