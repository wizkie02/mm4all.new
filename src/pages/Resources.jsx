import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundEffect from '../components/BackgroundEffect';

// Import blog images
import blogImg1 from '../assets/blog-meditation-beginners.jpg';
import blogImg2 from '../assets/blog-breathing-techniques.jpg';
import blogImg3 from '../assets/blog-evening-rituals.jpg';
import blogImg4 from '../assets/blog-workplace-mindfulness.jpg';

const Resources = () => {
  const [activeTab, setActiveTab] = useState('blogs');
  const [searchQuery, setSearchQuery] = useState('');
  
  const tabs = [
    { id: 'blogs', label: 'Blog Articles' },
    { id: 'guides', label: 'Free Guides' },
    { id: 'videos', label: 'Videos' },
    { id: 'research', label: 'Research' }
  ];
  
  const resources = {
    'blogs': [
      {
        id: 'blog-1',
        title: 'Meditation for Beginners: How to Start Your Practice',
        category: 'Beginners',
        date: 'May 10, 2025',
        image: blogImg1,
        excerpt: 'Starting a meditation practice can feel overwhelming. In this guide, we break down the basics into simple, manageable steps...'
      },
      {
        id: 'blog-2',
        title: '5 Breathing Techniques to Calm Your Mind',
        category: 'Techniques',
        date: 'May 5, 2025',
        image: blogImg2,
        excerpt: 'Your breath is a powerful tool for managing stress and anxiety. Learn five effective breathing techniques that you can use anywhere...'
      },
      {
        id: 'blog-3',
        title: 'Creating an Evening Ritual for Better Sleep',
        category: 'Sleep',
        date: 'April 28, 2025',
        image: blogImg3,
        excerpt: 'The way you spend your evening has a profound impact on your sleep quality. Discover how to create a calming ritual that prepares your body and mind...'
      },
      {
        id: 'blog-4',
        title: 'Mindfulness at Work: Staying Focused in a Busy Environment',
        category: 'Workplace',
        date: 'April 15, 2025',
        image: blogImg4,
        excerpt: 'Maintaining focus and calm amid workplace distractions is challenging. Learn practical mindfulness techniques designed for busy professionals...'
      }
    ],
    'guides': [
      {
        id: 'guide-1',
        title: '7-Day Mindfulness Challenge',
        category: 'Practice',
        image: blogImg3,
        excerpt: 'A step-by-step guide to building a consistent mindfulness practice in just one week.'
      },
      {
        id: 'guide-2',
        title: 'The Complete Guide to Meditation Postures',
        category: 'Techniques',
        image: blogImg1,
        excerpt: 'Find the most comfortable and effective position for your meditation practice with this illustrated guide.'
      },
      {
        id: 'guide-3',
        title: 'Mindful Eating Handbook',
        category: 'Wellness',
        image: blogImg2,
        excerpt: 'Transform your relationship with food by bringing mindfulness to your meals.'
      }
    ],
    'videos': [
      {
        id: 'video-1',
        title: 'Guided Meditation for Anxiety Relief',
        category: 'Meditation',
        duration: '15:24',
        image: blogImg2,
        excerpt: 'A gentle guide to calming anxiety through mindfulness and visualization.'
      },
      {
        id: 'video-2',
        title: 'Morning Stretches for Mindful Movement',
        category: 'Movement',
        duration: '10:12',
        image: blogImg4,
        excerpt: 'Start your day with intention through these gentle, mindful stretches.'
      }
    ],
    'research': [
      {
        id: 'research-1',
        title: 'The Science Behind Mindfulness Meditation',
        category: 'Neuroscience',
        date: 'March 2025',
        image: blogImg1,
        excerpt: 'A summary of recent scientific findings on how meditation affects the brain and nervous system.'
      },
      {
        id: 'research-2',
        title: 'Mindfulness-Based Stress Reduction: A Review of the Evidence',
        category: 'Clinical Research',
        date: 'February 2025',
        image: blogImg3,
        excerpt: 'An overview of studies demonstrating the effectiveness of MBSR for various conditions.'
      }
    ]
  };
  
  // Filter resources based on search query
  const filteredResources = resources[activeTab].filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <ResourcesContainer>
      <BackgroundEffect />
      
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
            Explore our collection of articles, guides, videos, and research about mindfulness and meditation
          </motion.p>
        </HeaderContent>
      </PageHeader>
      
      <ContentSection>
        <SearchBox>
          <SearchIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
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
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchQuery('');
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
          ))}
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
            {filteredResources.length > 0 ? (
              filteredResources.map((resource, index) => (
                <ResourceCard
                  key={resource.id}
                  as={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                >
                  <ResourceImage>
                    <img src={resource.image} alt={resource.title} />
                    {activeTab === 'videos' && (
                      <Duration>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                          <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                        </svg>
                        {resource.duration}
                      </Duration>
                    )}
                  </ResourceImage>
                  <ResourceContent>
                    <ResourceCategory>{resource.category}</ResourceCategory>
                    <ResourceTitle>{resource.title}</ResourceTitle>
                    {(activeTab === 'blogs' || activeTab === 'research') && (
                      <ResourceDate>{resource.date}</ResourceDate>
                    )}
                    <ResourceExcerpt>{resource.excerpt}</ResourceExcerpt>
                    <ReadMoreLink
                      as={motion.a}
                      whileHover={{ x: 5 }}
                      href="#"
                    >
                      Connect
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </ReadMoreLink>
                  </ResourceContent>
                </ResourceCard>
              ))
            ) : (
              <NoResults>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <p>No resources match your search criteria</p>
                <ResetButton onClick={() => setSearchQuery('')}>
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
              Join our mailing list to receive the latest articles, guides, and mindfulness tips directly in your inbox.
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
  transform: translateY(-50%);
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
  background: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-dark)'};
  border: 1px solid var(--primary-color);
  padding: 0.7rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary-color)' : 'rgba(122, 107, 172, 0.1)'};
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

const ReadMoreLink = styled.a`
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

export default Resources;
