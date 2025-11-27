import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import MeditationCard from "../components/MeditationCard";
import BackgroundEffect from "../components/BackgroundEffect";
import BreathingExercise from "../components/BreathingExercise";
import Sounds from "./Sounds";
// Import images
import sleepImg1 from "../assets/product-candle.jpg";
import sleepImg2 from "../assets/product-diffuser.jpg";
import focusImg1 from "../assets/blog-meditation-beginners.jpg";
import focusImg2 from "../assets/blog-workplace-mindfulness.jpg";
import morningImg1 from "../assets/blog-breathing-techniques.jpg";
import anxietyImg1 from "../assets/blog-evening-rituals.jpg";
const MeditationLibrary = () => {
  const [activeTab, setActiveTab] = useState("meditate");
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredMeditations, setFilteredMeditations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [isLoadingYoutube, setIsLoadingYoutube] = useState(false);
  const [youtubeError, setYoutubeError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 9;
  // Meditation data
  const meditations = [
    {
      id: 1,
      title: "Meditation at a forest river",
      description:
        "Step into a tranquil forest where a gentle river flows and nature embraces you in calm.",
      videoID: "ou6L1s8BgJg",
      duration: '10:02',
    },
    {
      id: 2,
      title: "10 minutes of blissful meditation music",
      description:
        "Let yourself unwind with this serene meditation video.",
      videoID: "JNB-EuTpQmE",
      duration: '10:29',
    },
    {
      id: 3,
      title: "10 minutes of forest mediation",
      description:
        "Escape the noise of everyday life with this calming 10-minute guided meditation.",
      videoID: "tnIZbSzUKi4",
      duration: '10:06',
    },
    {
      id: 4,
      title: "Guided Meditation for Stressrelief",
      description:
        "17 minutes of guided meditation. Guaranteed to relax you and give you inner peace.",
      videoID: "BErd5XfLEVM",
      duration: '17:01',
    },
    {
      id: 5,
      title: "Blissful 10 minute panflute meditation",
      description:
        "Take a moment to pause, breathe, and reconnect with yourself.",
      videoID: "Oj3RGSzGNMc",
      duration: '10:10',
    },
    {
      id: 6,
      title: "10 minute relaxing mediation",
      description:
        "This calming guided meditation is designed to help you relax, release stress.",
      videoID: "kXnpLieFkPU",
      duration: '10:42',
    },
  ];

  // YouTube API Configuration
  const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || "AIzaSyBHrIC4qmRjAe7NqB87VEOWks05j3iYdtw";
  const YOUTUBE_CHANNEL_HANDLE = "Meditationandmindfulness-4all";



  // Function to fetch videos from YouTube channel
  const fetchYouTubeVideos = async () => {
    if (!YOUTUBE_API_KEY) {
      setYoutubeVideos(meditations); // Fallback to hardcoded videos
      return;
    }

    setIsLoadingYoutube(true);
    setYoutubeError(null);

    try {
      // First, get the channel ID from the handle
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id,snippet&forHandle=${YOUTUBE_CHANNEL_HANDLE}&key=${YOUTUBE_API_KEY}`
      );

      if (!channelResponse.ok) {
        throw new Error(`Channel API error: ${channelResponse.status}`);
      }

      const channelData = await channelResponse.json();

      if (!channelData.items || channelData.items.length === 0) {
        throw new Error("Channel not found");
      }

      const channelId = channelData.items[0].id;

      // Then, search for videos from this channel
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=20&key=${YOUTUBE_API_KEY}`
      );

      if (!videosResponse.ok) {
        throw new Error(`Videos API error: ${videosResponse.status}`);
      }

      const videosData = await videosResponse.json();

      // Transform YouTube data to match our meditation data structure
      const transformedVideos = videosData.items.map((item, index) => ({
        id: index + 1,
        title: item.snippet.title,
        description: item.snippet.description.substring(0, 150) + "...", // Truncate description
        videoID: item.id.videoId,
        duration: "N/A", // YouTube API v3 requires additional call to get duration
        publishedAt: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url
      }));

      setYoutubeVideos(transformedVideos);

    } catch (error) {
      setYoutubeError(error.message);
      // Fallback to hardcoded videos
      setYoutubeVideos(meditations);
    } finally {
      setIsLoadingYoutube(false);
    }
  };

  // Load YouTube videos on component mount
  useEffect(() => {
    fetchYouTubeVideos();
  }, []);

  // Filter meditations/videos based on active filter and tab
  useEffect(() => {
    // Use YouTube videos for "Video" tab, hardcoded meditations for fallback
    const sourceVideos = activeTab === "meditate" ? youtubeVideos : meditations;
    let filtered = [...sourceVideos];

    // Apply search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      );
    }
    setFilteredMeditations(filtered);

    // Reset to first page when filters change
    setCurrentPage(1);
  }, [activeFilter, searchTerm, activeTab, youtubeVideos]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredMeditations.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  const currentVideos = filteredMeditations.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of video grid when changing pages
      const gridElement = document.querySelector('[data-video-grid]');
      if (gridElement) {
        gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);
  const toggleBreathingExercise = () => {
    setShowBreathingExercise((prev) => !prev);
  };
  return (
    <PageContainer>
      <PageWrapper>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <PageHeader>
            <PageTitle>{activeTab === "meditate" ? "Meditation Library" : "Sounds"}</PageTitle>
            <GradientUnderline />
          </PageHeader>
          <PageDescription>
            {activeTab === "meditate"
              ? "Find peace, focus, and relaxation with our curated collection of guided meditation videos."
              : "Create your perfect ambient soundscape for meditation, focus, or relaxation."
            }
          </PageDescription>
        </motion.div>

        {/* Tab Switcher */}
        <TabSwitcher>
          <TabButton
            $active={activeTab === "meditate"}
            onClick={() => setActiveTab("meditate")}
            as={motion.button}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Videos
          </TabButton>
          <TabButton
            $active={activeTab === "sounds"}
            onClick={() => setActiveTab("sounds")}
            as={motion.button}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Sounds
          </TabButton>
        </TabSwitcher>
        {/* Content Area - Conditionally render based on active tab */}
        {activeTab === "meditate" ? (
          <>
            <SearchAndFilterContainer>
              <SearchBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <SearchIcon>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 21L16.65 16.65"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </SearchIcon>
                <input
                  type="text"
                  placeholder="Search meditations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchBox>
            </SearchAndFilterContainer>
            <BreathingExerciseToggle
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              onClick={toggleBreathingExercise}
              whileHover={{
                y: -5,
                boxShadow: "0 8px 20px rgba(119, 117, 147, 0.3)",
              }}
            >
              {showBreathingExercise
                ? "Hide Breathing Exercise"
                : "Try Quick Breathing Exercise"}
            </BreathingExerciseToggle>
            <AnimatePresence>
              {showBreathingExercise && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <BreathingExercise />
                </motion.div>
              )}
            </AnimatePresence>
            {/* YouTube API Status */}
            {activeTab === "meditate" && youtubeError && (
              <ApiStatusMessage>
                <p>⚠️ YouTube API unavailable - showing fallback videos</p>
                <RefreshButton onClick={fetchYouTubeVideos} disabled={isLoadingYoutube}>
                  {isLoadingYoutube ? "Retrying..." : "Retry YouTube API"}
                </RefreshButton>
              </ApiStatusMessage>
            )}

            <MeditationGrid data-video-grid>
              <AnimatePresence>
                {isLoadingYoutube && activeTab === "meditate" ? (
                  <LoadingMessage
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="spinner"></div>
                    <h3>Loading videos from YouTube...</h3>
                    <p>Fetching latest content from our channel</p>
                  </LoadingMessage>
                ) : currentVideos.length > 0 ? (
                  currentVideos.map((meditation) => (
                    <motion.div
                      key={meditation.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.25 }}
                      layout
                    >
                      <MeditationCard meditation={meditation} />
                    </motion.div>
                  ))
                ) : filteredMeditations.length === 0 ? (
                  <EmptyStateMessage
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12 2C17.5228 6.47715 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 15H16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 9H9.01"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15 9H15.01"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <h3>No videos found</h3>
                    <p>Try adjusting your search criteria</p>
                  </EmptyStateMessage>
                ) : null}
              </AnimatePresence>
            </MeditationGrid>

            {/* Pagination Controls */}
            {filteredMeditations.length > videosPerPage && (
              <PaginationContainer
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <PaginationButton
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15,18 9,12 15,6"></polyline>
                  </svg>
                  Previous
                </PaginationButton>

                <PageNumbers>
                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === currentPage;

                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1;

                    if (!showPage) {
                      // Show ellipsis for gaps
                      if (page === 2 && currentPage > 4) {
                        return <PageEllipsis key={page}>...</PageEllipsis>;
                      }
                      if (page === totalPages - 1 && currentPage < totalPages - 3) {
                        return <PageEllipsis key={page}>...</PageEllipsis>;
                      }
                      return null;
                    }

                    return (
                      <PageNumber
                        key={page}
                        onClick={() => goToPage(page)}
                        $active={isCurrentPage}
                        aria-label={`Go to page ${page}`}
                        aria-current={isCurrentPage ? 'page' : undefined}
                      >
                        {page}
                      </PageNumber>
                    );
                  })}
                </PageNumbers>

                <PaginationButton
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </PaginationButton>

                <PageInfo>
                  Page {currentPage} of {totalPages} ({filteredMeditations.length} videos)
                </PageInfo>
              </PaginationContainer>
            )}
          </>
        ) : (
          <SoundsContainer>
            <Sounds />
          </SoundsContainer>
        )}
      </PageWrapper>
    </PageContainer>
  );
};
const PageContainer = styled.section`
  position: relative;
  background-color: var(--background-light);
  min-height: 100vh;
  padding: 2rem 0;
`;
const PageWrapper = styled.div`
  width: 92%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 2rem 0 4rem;
  position: relative;
  z-index: 10;
`;
const PageHeader = styled.div`
  text-align: center;
  position: relative;
  margin-bottom: 1rem;
`;
const PageTitle = styled.h1`
  text-align: center;
  font-size: 3rem;
  font-weight: 700;
  color: var(--lavender);
  margin-bottom: 0;
  letter-spacing: 0.5px;
`;
const GradientUnderline = styled.div`
  height: 4px;
  width: 80px;
  background: linear-gradient(
    to right,
    var(--primary-color),
    var(--accent-color)
  );
  margin: 0.8rem auto 0;
  border-radius: 2px;
`;
const PageDescription = styled.p`
  text-align: center;
  max-width: 700px;
  margin: 1.5rem auto 3rem;
  color: var(--text-light);
  font-size: 1.2rem;
  line-height: 1.7;
  font-weight: 300;
`;
const SearchAndFilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;
const SearchBox = styled(motion.div)`
  display: flex;
  .hover-effect
  align-items: center;
  background-color: white;
  border-radius: 30px;
  padding: 0.8rem 1.5rem;
  width: 300px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  &:focus-within {
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 1rem;
    width: 100%;
    color: var(--text-dark);
    &::placeholder {
      color: #aaa;
    }
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const SearchIcon = styled.div`
  display: flex;
  margin-right: 0.8rem;
  color: #aaa;
`;
const BreathingExerciseToggle = styled(motion.button)`
  background: linear-gradient(
    135deg,
    var(--lavender) 0%,
    var(--lavender-dark) 100%
  );
  border: none;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 500;
  margin: 0 auto 2rem;
  display: block;
  box-shadow: 0 5px 15px rgba(119, 117, 147, 0.2);
  transition: all 0.3s ease;
  &:hover {
    filter: brightness(1.1);
  }
`;
const MeditationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;
const EmptyStateMessage = styled(motion.div)`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-light);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  svg {
    margin-bottom: 1rem;
    color: var(--text-light);
    opacity: 0.5;
  }
  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
  }
  p {
    font-size: 1rem;
    opacity: 0.7;
  }
`;

// New styled components for tab functionality
const TabSwitcher = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  background: white;
  border-radius: 50px;
  padding: 0.5rem;
  box-shadow: var(--shadow);
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;

  background: ${props => props.$active ? 'var(--gradient-primary)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--text-dark)'};

  &:hover {
    background: ${props => props.$active ? 'var(--gradient-primary)' : 'rgba(122, 107, 172, 0.1)'};
  }
`;

const SoundsContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
`;

// YouTube API status and loading components
const ApiStatusMessage = styled.div`
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #856404;

  p {
    margin: 0 0 1rem 0;
    font-weight: 500;
  }
`;

const RefreshButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);

  &:hover:not(:disabled) {
    background: var(--lavender-dark);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled(motion.div)`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-light);

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(122, 107, 172, 0.1);
    border-left: 4px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1.5rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
  }

  p {
    font-size: 1rem;
    opacity: 0.7;
  }
`;

// Pagination styled components
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 3rem 0 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.5rem;
    margin: 2rem 0 1rem;
  }
`;

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: ${props => props.disabled ? 'rgba(255, 255, 255, 0.1)' : 'var(--primary-color)'};
  color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.4)' : 'white'};
  border: 1px solid ${props => props.disabled ? 'rgba(255, 255, 255, 0.2)' : 'var(--primary-color)'};
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: var(--accent-color);
    border-color: var(--accent-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(161, 155, 232, 0.3);
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover:not(:disabled) svg {
    transform: translateX(${props => props.children[0] === 'Next' ? '2px' : '-2px'});
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
`;

const PageNumbers = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`;

const PageNumber = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid ${props => props.$active ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.2)'};
  background: ${props => props.$active ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? 'white' : 'var(--text-light)'};
  font-size: 0.9rem;
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$active ? 'var(--primary-color)' : 'var(--accent-color)'};
    border-color: var(--accent-color);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(161, 155, 232, 0.3);
  }

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 0.8rem;
  }
`;

const PageEllipsis = styled.span`
  color: var(--text-light);
  font-size: 0.9rem;
  padding: 0 0.5rem;
`;

const PageInfo = styled.div`
  color: var(--text-light);
  font-size: 0.85rem;
  text-align: center;
  margin-left: 1rem;

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 0.5rem;
    width: 100%;
    font-size: 0.8rem;
  }
`;

export default MeditationLibrary;
