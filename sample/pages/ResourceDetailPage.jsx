import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import publicApiService from "../services/publicApiService";


const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;

        // Check if the parameter is a number (ID) or string (slug)
        const isNumeric = /^\d+$/.test(id);

        if (isNumeric) {
          // Use ID-based API call
          response = await publicApiService.getPost(id);
        } else {
          // Use slug-based API call
          response = await publicApiService.getPostBySlug(id);
        }

        if (response.success) {
          // API returns array, get first item
          const postData = Array.isArray(response.data) ? response.data[0] : response.data;

          if (postData) {
            setPost(postData);
            // Update page title
            document.title = `${postData.title} | MM4All`;

            // If we loaded by ID but have a slug, redirect to slug URL for SEO
            if (isNumeric && postData.slug) {
              navigate(`/resources/${postData.slug}`, { replace: true });
            }
          } else {
            setError('Post not found');
          }
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError('Error loading post: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPost();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <ModernPageContainer>
        <ModernArticleWrapper>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Loading article...</LoadingText>
          </LoadingContainer>
        </ModernArticleWrapper>
      </ModernPageContainer>
    );
  }

  if (error) {
    return (
      <ModernPageContainer>
        <ModernArticleWrapper>
          <ErrorContainer>
            <ErrorTitle>⚠️ {error}</ErrorTitle>
            <ErrorMessage>The article you're looking for couldn't be found.</ErrorMessage>
            <ButtonGroup>
              <BackButton onClick={() => navigate('/resources')}>
                Back to Resources
              </BackButton>
              <RetryButton onClick={() => window.location.reload()}>
                Try Again
              </RetryButton>
            </ButtonGroup>
          </ErrorContainer>
        </ModernArticleWrapper>
      </ModernPageContainer>
    );
  }

  if (!post) {
    return (
      <ModernPageContainer>
        <ModernArticleWrapper>
          <ErrorContainer>
            <ErrorTitle>Article Not Found</ErrorTitle>
            <ErrorMessage>The article you're looking for doesn't exist.</ErrorMessage>
            <BackButton onClick={() => navigate('/resources')}>
              Back to Resources
            </BackButton>
          </ErrorContainer>
        </ModernArticleWrapper>
      </ModernPageContainer>
    );
  }

  return (
    <ModernPageContainer>
      <ModernArticleWrapper>
        {/* Back Button */}
        <BackButtonContainer>
          <BackButton
            onClick={() => navigate('/resources')}
            whileHover={{ x: -2 }}
            transition={{ duration: 0.2 }}
          >
            ← Back
          </BackButton>
        </BackButtonContainer>

        {/* Article Header */}
        <ArticleHeader>
          <ArticleTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {post.title}
          </ArticleTitle>

          <ArticleMetaRow>
            <CategoryBadge>
              {post.category_name || 'Workplace'}
            </CategoryBadge>
            <DateBadge>
              📅 {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </DateBadge>
          </ArticleMetaRow>
        </ArticleHeader>

        {/* Featured Image */}
        {post.featured_image_url && (
          <FeaturedImageContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FeaturedImage
              src={post.featured_image_url}
              alt={post.title}
              onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </FeaturedImageContainer>
          )}

          {/* Article Summary */}
          {post.excerpt && (
            <ArticleSummary
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {post.excerpt}
            </ArticleSummary>
          )}

          {/* Article Content */}
          <ArticleContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ContentBody
              dangerouslySetInnerHTML={{
                __html: post.content || '<p>No content available.</p>'
              }}
            />
          </ArticleContent>

          {/* Tags Section */}
          {post.tags && post.tags.length > 0 && (
            <TagsSection
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <TagsLabel>Related Topics</TagsLabel>
              <TagsList>
                {post.tags.map((tag, index) => (
                  <ModernTag key={index}>{tag}</ModernTag>
                ))}
              </TagsList>
            </TagsSection>
          )}
        </ModernArticleWrapper>
      </ModernPageContainer>
  );
};

export default ResourceDetailPage;

// Modern Styled Components
const ModernPageContainer = styled.div`
  min-height: 100vh;
  background: #fafafa;
  padding: 0;
`;

const ModernArticleWrapper = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding: 32px 24px;
  background: white;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

// Back Button
const BackButtonContainer = styled.div`
  margin-bottom: 24px;
`;

const BackButton = styled(motion.button)`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 0;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s ease;

  &:hover {
    color: #374151;
  }
`;

// Article Header
const ArticleHeader = styled.div`
  margin-bottom: 32px;
`;

const ArticleTitle = styled(motion.h1)`
  font-size: 36px;
  font-weight: 700;
  line-height: 1.2;
  color: #111827;
  margin: 0 0 16px 0;

  @media (max-width: 768px) {
    font-size: 28px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const ArticleMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const CategoryBadge = styled.span`
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
`;

const DateBadge = styled.span`
  color: #6b7280;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

// Loading & Error States
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1.5rem;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 500;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem 2rem;
`;

const ErrorTitle = styled.h2`
  color: #ef4444;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ErrorMessage = styled.p`
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const RetryButton = styled.button`
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-1px);
  }
`;

// Featured Image
const FeaturedImageContainer = styled(motion.div)`
  margin-bottom: 32px;
  border-radius: 8px;
  overflow: hidden;
`;

const FeaturedImage = styled.img`
  width: 100%;
  height: 350px;
  object-fit: cover;
  display: block;

  @media (max-width: 768px) {
    height: 280px;
  }
`;

// Article Summary
const ArticleSummary = styled(motion.div)`
  font-size: 18px;
  line-height: 1.6;
  color: #4b5563;
  margin-bottom: 32px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
  font-style: italic;
`;

// Article Content
const ArticleContent = styled(motion.div)`
  margin-bottom: 40px;
`;

const ContentBody = styled.div`
  font-size: 16px;
  line-height: 1.7;
  color: #374151;

  h1, h2, h3, h4, h5, h6 {
    color: #111827;
    font-weight: 600;
    margin: 24px 0 12px 0;
    line-height: 1.3;

    &:first-child {
      margin-top: 0;
    }
  }

  h1 { font-size: 28px; }
  h2 { font-size: 24px; }
  h3 { font-size: 20px; }
  h4 { font-size: 18px; }

  p {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  ul, ol {
    margin: 16px 0;
    padding-left: 24px;
  }

  li {
    margin-bottom: 6px;
  }

  blockquote {
    border-left: 4px solid #e5e7eb;
    padding-left: 16px;
    margin: 20px 0;
    font-style: italic;
    color: #6b7280;
  }

  code {
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 14px;
  }

  pre {
    background: #1f2937;
    color: #f9fafb;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 20px 0;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 20px 0;
  }
`;

// Tags Section
const TagsSection = styled(motion.div)`
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
`;

const TagsLabel = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
`;

const TagsList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ModernTag = styled.span`
  background: #f3f4f6;
  color: #374151;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
    transform: translateY(-1px);
  }
`;