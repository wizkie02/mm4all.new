import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaEye, FaSave, FaTimes, FaArrowLeft, FaCog, FaShare, FaSpinner, FaUpload, FaImage
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import NotionEditor from '../components/editor/NotionEditor';
const ContentEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, hasPermission } = useAuth();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category_id: '',
    content_type: 'article',
    difficulty_level: 'beginner',
    status: 'draft',
    featured_image_url: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    tags: []
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Rich text editor states
  const [showPreview, setShowPreview] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved'); // 'saving', 'saved', 'error'
  const [uploadingImage, setUploadingImage] = useState(false);
  const autoSaveTimeoutRef = useRef(null);
  useEffect(() => {
    loadFormData();
  }, [id]);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!formData.title.trim() || !isEditMode) return;

    setAutoSaveStatus('saving');
    try {
      const postData = {
        ...formData,
        status: 'draft', // Always save as draft for auto-save
        slug: formData.slug || generateSlug(formData.title)
      };

      const response = await apiService.updatePost(id, postData);
      if (response.success) {
        setAutoSaveStatus('saved');
      } else {
        setAutoSaveStatus('error');
      }
    } catch (error) {
      setAutoSaveStatus('error');
    }
  }, [formData, id, isEditMode]);

  // Trigger auto-save when content changes
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Auto-save after 3 seconds of inactivity
    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 3000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData.content, formData.title, autoSave]);
  const loadFormData = async () => {
    setLoading(true);
    try {
      // Load categories and tags
      const [categoriesRes, tagsRes] = await Promise.all([
        apiService.getCategories(),
        apiService.getTags()
      ]);
      if (categoriesRes.success) {
        setCategories(categoriesRes.data.categories || []);
      }
      if (tagsRes.success) {
        setTags(tagsRes.data.tags || []);
      }
      // Load post data if editing
      if (isEditMode) {
        const postRes = await apiService.getPost(id);
        if (postRes.success && postRes.data.post) {
          const post = postRes.data.post;
          setFormData({
            title: post.title || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            category_id: post.category_id || '',
            content_type: post.content_type || 'article',
            difficulty_level: post.difficulty_level || 'beginner',
            status: post.status || 'draft',
            featured_image_url: post.featured_image_url || '',
            meta_title: post.meta_title || '',
            meta_description: post.meta_description || '',
            meta_keywords: post.meta_keywords || '',
            tags: post.tags || []
          });
        }
      }
    } catch (error) {
      setError('Failed to load form data');
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleTagChange = (selectedTags) => {
    setFormData(prev => ({
      ...prev,
      tags: selectedTags
    }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content: content
    }));
  };

  const handleImageUpload = async (file) => {
    setUploadingImage(true);
    try {
      // Create FormData for file upload
      const uploadFormData = new FormData();
      uploadFormData.append('file', file); // Use 'file' as expected by the PHP endpoint

      // Upload image to server
      const response = await fetch(`${apiService.baseURL}/admin/media/upload_media.php`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiService.getToken()}`
        },
        body: uploadFormData
      });

      const result = await response.json();
      if (result.success) {
        // Return the full URL for the uploaded image
        const baseUrl = apiService.baseURL.replace('/api', '');
        return baseUrl + result.file_url;
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      setError('Failed to upload image: ' + error.message);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };
  const handleSave = async (publishStatus = null) => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const postData = {
        ...formData,
        status: publishStatus || formData.status,
        // Auto-generate slug from title if not provided
        slug: formData.slug || generateSlug(formData.title)
      };
      let response;
      if (isEditMode) {
        response = await apiService.updatePost(id, postData);
      } else {
        response = await apiService.createPost(postData);
      }
      if (response.success) {
        navigate('/admin/dashboard');
      } else {
        setError(response.error || 'Failed to save post');
      }
    } catch (error) {
      setError(error.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };
  // Helper function to generate URL-friendly slugs
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };
  const handlePublish = () => {
    if (hasPermission('posts.publish')) {
      handleSave('published');
    } else {
      setError('You do not have permission to publish posts');
    }
  };
  if (loading) {
    return (
      <LoadingContainer>
        <FaSpinner className="spinner" />
        <span>Loading editor...</span>
      </LoadingContainer>
    );
  }
  return (
    <EditorContainer>
      <EditorHeader>
        <HeaderLeft>
          <BackButton onClick={() => navigate('/admin/dashboard')}>
            <FaArrowLeft /> Back to Dashboard
          </BackButton>
          <PageTitle>
            {isEditMode ? 'Edit Post' : 'Create New Post'}
          </PageTitle>
        </HeaderLeft>
        <HeaderRight>
          <SaveButton 
            onClick={() => handleSave()} 
            disabled={saving}
          >
            {saving ? <FaSpinner className="spinner" /> : <FaSave />}
            Save Draft
          </SaveButton>
          {hasPermission('posts.publish') && (
            <PublishButton 
              onClick={handlePublish}
              disabled={saving}
            >
              {saving ? <FaSpinner className="spinner" /> : <FaShare />}
              Publish
            </PublishButton>
          )}
        </HeaderRight>
      </EditorHeader>
      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}
      <EditorContent>
        <EditorMain>
          <FormGroup>
            <FormLabel>Post Title</FormLabel>
            <TitleInput
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter post title..."
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Excerpt</FormLabel>
            <ExcerptTextarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Brief description of the post..."
              rows={3}
            />
          </FormGroup>
          <FormGroup>
            <ContentHeader>
              <FormLabel>Content</FormLabel>
              <ContentActions>
                <AutoSaveStatus $status={autoSaveStatus}>
                  {autoSaveStatus === 'saving' && <FaSpinner className="spinner" />}
                  {autoSaveStatus === 'saved' && <FaSave />}
                  {autoSaveStatus === 'error' && <FaTimes />}
                  <span>
                    {autoSaveStatus === 'saving' && 'Saving...'}
                    {autoSaveStatus === 'saved' && 'Saved'}
                    {autoSaveStatus === 'error' && 'Save failed'}
                  </span>
                </AutoSaveStatus>
                <PreviewToggle
                  onClick={() => setShowPreview(!showPreview)}
                  $active={showPreview}
                >
                  <FaEye /> {showPreview ? 'Edit' : 'Preview'}
                </PreviewToggle>
              </ContentActions>
            </ContentHeader>

            {showPreview ? (
              <PreviewContainer>
                <div dangerouslySetInnerHTML={{ __html: formData.content }} />
              </PreviewContainer>
            ) : (
              <RichEditorContainer>
                <NotionEditor
                  content={formData.content}
                  onChange={handleContentChange}
                  onImageUpload={handleImageUpload}
                  placeholder="Start writing your post content..."
                  uploadingImage={uploadingImage}
                />
              </RichEditorContainer>
            )}
          </FormGroup>
        </EditorMain>
        <EditorSidebar>
          <SidebarSection>
            <SectionTitle>Post Settings</SectionTitle>
            <FormGroup>
              <FormLabel>Category</FormLabel>
              <FormSelect
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>
            <FormGroup>
              <FormLabel>Content Type</FormLabel>
              <FormSelect
                name="content_type"
                value={formData.content_type}
                onChange={handleInputChange}
              >
                <option value="article">Article</option>
                <option value="meditation">Meditation Guide</option>
                <option value="guide">How-to Guide</option>
                <option value="news">News</option>
              </FormSelect>
            </FormGroup>
            <FormGroup>
              <FormLabel>Difficulty Level</FormLabel>
              <FormSelect
                name="difficulty_level"
                value={formData.difficulty_level}
                onChange={handleInputChange}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </FormSelect>
            </FormGroup>
            <FormGroup>
              <FormLabel>Status</FormLabel>
              <FormSelect
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending Review</option>
                {hasPermission('posts.publish') && (
                  <option value="published">Published</option>
                )}
              </FormSelect>
            </FormGroup>
          </SidebarSection>
          <SidebarSection>
            <SectionTitle>Featured Image</SectionTitle>
            <FormGroup>
              <FormInput
                type="url"
                name="featured_image_url"
                value={formData.featured_image_url}
                onChange={handleInputChange}
                placeholder="Image URL..."
              />
            </FormGroup>
            <FormGroup>
              <ImageUploadButton
                onClick={() => document.getElementById('featured-image-upload').click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <>
                    <FaSpinner className="spinner" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload />
                    Upload Image
                  </>
                )}
              </ImageUploadButton>
              <input
                id="featured-image-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const imageUrl = await handleImageUpload(file);
                    if (imageUrl) {
                      setFormData(prev => ({
                        ...prev,
                        featured_image_url: imageUrl
                      }));
                    }
                  }
                }}
              />
            </FormGroup>
            {formData.featured_image_url && (
              <ImagePreview>
                <img src={formData.featured_image_url} alt="Preview" />
              </ImagePreview>
            )}
          </SidebarSection>
          <SidebarSection>
            <SectionTitle>SEO Settings</SectionTitle>
            <FormGroup>
              <FormLabel>Meta Title</FormLabel>
              <FormInput
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleInputChange}
                placeholder="SEO title..."
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Meta Description</FormLabel>
              <FormTextarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleInputChange}
                placeholder="SEO description..."
                rows={3}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Keywords</FormLabel>
              <FormInput
                type="text"
                name="meta_keywords"
                value={formData.meta_keywords}
                onChange={handleInputChange}
                placeholder="keyword1, keyword2, keyword3"
              />
            </FormGroup>
          </SidebarSection>
          <SidebarSection>
            <SectionTitle>Tags</SectionTitle>
            <TagsContainer>
              {tags.map(tag => (
                <TagOption
                  key={tag.id}
                  selected={formData.tags.includes(tag.name)}
                  onClick={() => {
                    const updatedTags = formData.tags.includes(tag.name)
                      ? formData.tags.filter(t => t !== tag.name)
                      : [...formData.tags, tag.name];
                    handleTagChange(updatedTags);
                  }}
                >
                  {tag.name}
                </TagOption>
              ))}
            </TagsContainer>
          </SidebarSection>
        </EditorSidebar>
      </EditorContent>
    </EditorContainer>
  );
};
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
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
const EditorContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`;
const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const HeaderRight = styled.div`
  display: flex;
  gap: 1rem;
`;
const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: #edf2f7;
    color: #2d3748;
  }
`;
const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
`;
const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #edf2f7;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #4a5568;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  &:hover:not(:disabled) {
    background: #e2e8f0;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .spinner {
    animation: spin 1s linear infinite;
  }
`;
const PublishButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  .spinner {
    animation: spin 1s linear infinite;
  }
`;
const ErrorMessage = styled.div`
  background: #fed7d7;
  border: 1px solid #feb2b2;
  color: #c53030;
  padding: 1rem 2rem;
  margin: 0;
  text-align: center;
`;
const EditorContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;
const EditorMain = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;
const EditorSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
const SidebarSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;
const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
`;
const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  &:last-child {
    margin-bottom: 0;
  }
`;
const FormLabel = styled.label`
  display: block;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;
const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;
const TitleInput = styled(FormInput)`
  font-size: 1.5rem;
  font-weight: 600;
  padding: 1rem;
`;
const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease;
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;
const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease;
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;
const ExcerptTextarea = styled(FormTextarea)`
  min-height: 80px;
`;
const ContentTextarea = styled(FormTextarea)`
  min-height: 400px;
  font-family: 'Courier New', monospace;
`;
const ImagePreview = styled.div`
  margin-top: 1rem;
  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }
`;
const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
const TagOption = styled.button`
  padding: 0.25rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: ${props => props.selected ? '#667eea' : 'white'};
  color: ${props => props.selected ? 'white' : '#4a5568'};
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    border-color: #667eea;
    color: ${props => props.selected ? 'white' : '#667eea'};
  }
`;

// New styled components for enhanced editor
const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ContentActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AutoSaveStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${props => {
    switch (props.$status) {
      case 'saving': return '#f59e0b';
      case 'saved': return '#10b981';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  }};

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const PreviewToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.$active ? '#667eea' : '#f7fafc'};
  color: ${props => props.$active ? 'white' : '#4a5568'};
  border: 1px solid ${props => props.$active ? '#667eea' : '#e2e8f0'};
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? '#5a67d8' : '#edf2f7'};
    border-color: ${props => props.$active ? '#5a67d8' : '#cbd5e0'};
  }
`;

const PreviewContainer = styled.div`
  min-height: 400px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fafafa;

  /* Style the preview content */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  ul, ol {
    margin-bottom: 1rem;
    padding-left: 2rem;
  }

  blockquote {
    border-left: 4px solid #667eea;
    padding-left: 1rem;
    margin: 1rem 0;
    font-style: italic;
    color: #4a5568;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1rem 0;
  }

  code {
    background: #f1f5f9;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
  }

  pre {
    background: #1e293b;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;

    code {
      background: none;
      padding: 0;
      color: inherit;
    }
  }
`;

const RichEditorContainer = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;

  /* Ensure the NotionEditor fills the container */
  .ProseMirror {
    min-height: 400px;
    padding: 1.5rem;
    outline: none;

    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }
`;

const ImageUploadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: #f7fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  color: #4a5568;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #edf2f7;
    border-color: #cbd5e0;
    color: #2d3748;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export default ContentEditor;
