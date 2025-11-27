import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundEffect from "../components/BackgroundEffect";
import publicApiService from "../services/publicApiService";

// Function to strip HTML tags and get plain text
const stripHtmlTags = (html) => {
  if (!html) return '';
  // Create a temporary div element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  // Return the text content without HTML tags
  return tempDiv.textContent || tempDiv.innerText || '';
};

const Resources = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data from APIs
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load posts and categories in parallel
        const [postsResponse, categoriesResponse] = await Promise.all([
          publicApiService.getPosts({
            status: 'published',
            page: 1,
            limit: 50
          }),
          publicApiService.getCategories()
        ]);
        
        if (postsResponse.success) {
          setPosts(postsResponse.data || []);
        } else {
          setError('Failed to load posts');
          return;
        }

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data || []);
        } else {
          setCategories([]);
        }
      } catch (err) {
        setError('Error loading data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Create tabs from categories
  const tabs = [
    { id: "all", label: "All Categories", category_id: null },
    ...categories.map(category => ({
      id: category.slug || category.id.toString(),
      label: category.name,
      category_id: category.id
    }))
  ];

  // Filter posts based on active tab and search query
  const filteredResources = posts.filter((post) => {
    // Filter by category first
    const matchesCategory = activeTab === "all" || 
                           post.category_id === tabs.find(tab => tab.id === activeTab)?.category_id;
    
    // Then filter by search query
    const matchesSearch = !searchQuery || 
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stripHtmlTags(post.content || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  return (
    <ResourcesContainer>
      <PageHeader>
        <HeaderContent>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Mindfulness Resources
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore our collection of articles, guides, and research
            about mindfulness and meditation
          </motion.p>
        </HeaderContent>
      </PageHeader>
      <ContentSection>
        <SearchBox>
          <SearchIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBox>
        <TabsContainer>
          {tabs.length > 0 ? (
            tabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery("");
                }}
                as={motion.button}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <ActiveIndicator layoutId="tabIndicator" />
                )}
              </TabButton>
            ))
          ) : (
            // Fallback static tabs while loading categories
            <>
              <TabButton
                active={activeTab === "all"}
                onClick={() => {
                  setActiveTab("all");
                  setSearchQuery("");
                }}
                as={motion.button}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                All Resources
                {activeTab === "all" && (
                  <ActiveIndicator layoutId="tabIndicator" />
                )}
              </TabButton>
            </>
          )}
        </TabsContainer>
        <AnimatePresence mode="wait">
          <ResourceGrid
            key={activeTab}
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <LoadingContainer>
                <LoadingSpinner />
                <p>Loading resources...</p>
              </LoadingContainer>
            ) : error ? (
              <ErrorContainer>
                <p>⚠️ {error}</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
              </ErrorContainer>
            ) : filteredResources.length > 0 ? (
              filteredResources.map((post, index) => (
                <Link
                  key={post.id}
                  to={`/resources/${post.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                    height: "100%",
                  }}
                >
                  <ResourceCard
                    as={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  >
                    <ResourceImage>
                      <img 
                        src={post.featured_image_url || '/src/assets/blog-meditation-beginners.jpg'} 
                        alt={post.title}
                        onError={(e) => {
                          e.target.src = '/src/assets/blog-meditation-beginners.jpg';
                        }}
                      />
                      {post.difficulty_level && (
                        <Duration>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                          </svg>
                          {post.difficulty_level}
                        </Duration>
                      )}
                    </ResourceImage>
                    <ResourceContent>
                      <ResourceCategory>
                        {post.category_name || 'Mindfulness'}
                      </ResourceCategory>
                      <ResourceTitle>{post.title}</ResourceTitle>
                      {post.created_at && (
                        <ResourceDate>
                          {new Date(post.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </ResourceDate>
                      )}
                      <ResourceExcerpt>
                        {post.excerpt || (post.content ? stripHtmlTags(post.content).substring(0, 150) + '...' : 'No description available')}
                      </ResourceExcerpt>
                      <ReadMoreLink
                        as={motion.div}
                        whileHover={{ x: 5 }}
                      >
                        Read More
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                        </svg>
                      </ReadMoreLink>
                    </ResourceContent>
                  </ResourceCard>
                </Link>
              ))
            ) : (
              <NoResults>
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  opacity="0.3"
                >
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <p>No resources found{searchQuery ? ` for "${searchQuery}"` : activeTab !== "all" ? ` in "${tabs.find(tab => tab.id === activeTab)?.label}"` : ""}</p>
                <ResetButton onClick={() => setSearchQuery("")}>
                  Clear Search
                </ResetButton>
              </NoResults>
            )}
          </ResourceGrid>
        </AnimatePresence>
        <SubscribeSection>
          <SubscribeContent>
            <SubscribeTitle>Stay Updated with New Resources</SubscribeTitle>
            <SubscribeText>
              Join our mailing list to receive the latest articles, guides, and
              mindfulness tips directly in your inbox.
            </SubscribeText>
            <SubscribeForm>
              <SubscribeInput type="email" placeholder="Your email address" />
              <SubscribeButton
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </SubscribeButton>
            </SubscribeForm>
          </SubscribeContent>
        </SubscribeSection>
      </ContentSection>
    </ResourcesContainer>
  );
};
// Styled Components
const ResourcesContainer = styled.div`
  position: relative;
  min-height: 100vh;
`;
const PageHeader = styled.div`
  background-color: var(--primary-color);
  color: white;
  padding: 4rem 0;
  margin-bottom: 3rem;
`;
const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 0 1rem;
  h1 {
    color: white;
    margin-bottom: 1rem;
  }
  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.2rem;
    max-width: 700px;
    margin: 0 auto;
  }
`;
const ContentSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 4rem;
`;
const SearchBox = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto 2rem;
`;
const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-35%);
  color: var(--text-light);
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid #eee;
  border-radius: 30px;
  font-size: 1rem;
  box-shadow: var(--shadow);
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(122, 107, 172, 0.2);
  }
`;
const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
  position: relative;
`;
const TabButton = styled.button`
  background: ${(props) =>
    props.active ? "var(--primary-color)" : "transparent"};
  color: ${(props) => (props.active ? "white" : "var(--text-dark)")};
  border: 1px solid var(--primary-color);
  padding: 0.7rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  position: relative;
  overflow: hidden;
  &:hover {
    background: ${(props) =>
      props.active ? "var(--primary-color)" : "rgba(122, 107, 172, 0.1)"};
  }
`;
const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: var(--primary-color);
  border-radius: 30px;
  z-index: -1;
`;
const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 2rem;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;
const ResourceCard = styled.div`
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const ResourceImage = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  ${ResourceCard}:hover & img {
    transform: scale(1.05);
  }
`;
const Duration = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;
const ResourceContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const ResourceCategory = styled.span`
  display: inline-block;
  background: var(--tertiary-color);
  color: var(--primary-color);
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  align-self: flex-start;
`;
const ResourceTitle = styled.h3`
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
`;
const ResourceDate = styled.div`
  color: var(--text-light);
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;
const ResourceExcerpt = styled.p`
  color: var(--text-light);
  margin-bottom: 1.5rem;
  flex: 1;
`;
const ReadMoreLink = styled.div`
  color: var(--primary-color);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
  &:hover {
    color: var(--accent-color);
  }
`;
const NoResults = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
`;
const ResetButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 30px;
  margin-top: 1rem;
  font-size: 0.9rem;
`;
const SubscribeSection = styled.div`
  margin-top: 4rem;
  background: var(--tertiary-color);
  padding: 3rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
`;
const SubscribeContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;
const SubscribeTitle = styled.h2`
  margin-bottom: 1rem;
`;
const SubscribeText = styled.p`
  margin-bottom: 2rem;
`;
const SubscribeForm = styled.form`
  display: flex;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
  }
`;
const SubscribeInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: 1px solid #eee;
  border-top-left-radius: var(--border-radius);
  border-bottom-left-radius: var(--border-radius);
  font-size: 1rem;
  @media (max-width: 600px) {
    border-radius: var(--border-radius);
  }
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;
const SubscribeButton = styled.button`
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-top-right-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  font-weight: 600;
  @media (max-width: 600px) {
    border-radius: var(--border-radius);
  }
`;
const LoadingContainer = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;
const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
const ErrorContainer = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
  
  p {
    margin-bottom: 1rem;
    color: #e53e3e;
  }
  
  button {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 0.7rem 1.5rem;
    border-radius: 30px;
    font-size: 0.9rem;
    cursor: pointer;
    
    &:hover {
      background: var(--accent-color);
    }
  }
`;
export default Resources;
