import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import MeditationCard from "../components/MeditationCard";
import BackgroundEffect from "../components/BackgroundEffect";
import BreathingExercise from "../components/BreathingExercise";

// Import images
import sleepImg1 from "../assets/product-candle.jpg";
import sleepImg2 from "../assets/product-diffuser.jpg";
import focusImg1 from "../assets/blog-meditation-beginners.jpg";
import focusImg2 from "../assets/blog-workplace-mindfulness.jpg";
import morningImg1 from "../assets/blog-breathing-techniques.jpg";
import anxietyImg1 from "../assets/blog-evening-rituals.jpg";

const MeditationLibrary = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredMeditations, setFilteredMeditations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);

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

  // Filter meditations based on active filter
  useEffect(() => {
    let filtered = [...meditations];

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
  }, [activeFilter, searchTerm]);

  const toggleBreathingExercise = () => {
    setShowBreathingExercise((prev) => !prev);
  };

  return (
    <PageContainer>
      <BackgroundEffect />

      <PageWrapper>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <PageHeader>
            <PageTitle>Meditation Library</PageTitle>
            <GradientUnderline />
          </PageHeader>

          <PageDescription>
            Find peace, focus, and relaxation with our curated collection of
            guided meditations.
          </PageDescription>
        </motion.div>

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

        <MeditationGrid>
          <AnimatePresence>
            {filteredMeditations.length > 0 ? (
              filteredMeditations.map((meditation) => (
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
            ) : (
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
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
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
                <h3>No meditations found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </EmptyStateMessage>
            )}
          </AnimatePresence>
        </MeditationGrid>
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

export default MeditationLibrary;
