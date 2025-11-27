import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const EmbeddedYouTubePlayer = ({ videoID, title }) => {
  return (
    <PlayerWrapper>
      <YouTubeIframe
        src={`https://www.youtube.com/embed/${videoID}?rel=0&modestbranding=1&playsinline=1`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </PlayerWrapper>
  );
};
const MeditationCard = ({ meditation }) => {
  const { id, title, description, videoID, duration, thumbnail } = meditation;
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const handleDescriptionClick = (e) => {
    e.stopPropagation();
    // Open YouTube video in new tab when description area is clicked
    window.open(`https://www.youtube.com/watch?v=${videoID}`, '_blank');
  };

  // Standardize description text - optimal length for consistent card heights
  const getStandardizedDescription = (text) => {
    const maxLength = 100; // Optimal length for 2-3 lines
    if (!text) return "Discover peace and mindfulness with this guided meditation session."; // Default fallback

    if (text.length <= maxLength) {
      return text;
    }

    // Find the last complete word within the limit
    const truncated = text.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');

    if (lastSpaceIndex > maxLength * 0.8) { // If we can find a good word boundary
      return text.substring(0, lastSpaceIndex) + "...";
    }

    return truncated + "...";
  };
  return (
    <CardContainer
      whileHover={{
        y: -10,
        boxShadow: "0 15px 35px rgba(31, 29, 62, 0.15)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.4,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ThumbnailContainer>
        <EmbeddedYouTubePlayer
          videoID={videoID}
          title={title}
        />
        <GlowEffect
          as={motion.div}
          animate={{ opacity: isHovered ? 0.7 : 0 }}
          transition={{ duration: 0.15 }}
        />
      </ThumbnailContainer>
      <CardContent onClick={handleDescriptionClick}>
        <Title
          as={motion.h3}
          animate={{
            color: isHovered ? "var(--lavender-darker)" : "var(--text-dark)",
            y: isHovered ? -2 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </Title>
        <Description>{getStandardizedDescription(description)}</Description>

      </CardContent>
    </CardContainer>
  );
};
const IFrameWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 15px 15px 0 0;
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 15px;
  }
`;
const PlayerWrapper = styled.div`
  width: 100%;
  height: 200px; /* Fixed height for consistency */
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
`;

const YouTubeIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 15px;
`;


const CardContainer = styled(motion.div)`
  background-color: var(--white);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(31, 29, 62, 0.1);
  transition: all var(--transition);
  position: relative;
  height: 340px; /* Fixed total card height for perfect grid alignment */
  display: flex;
  flex-direction: column;
`;
const ThumbnailContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 200px; /* Fixed height for video player area */
  flex-shrink: 0; /* Prevent shrinking */
`;
const GlowEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 70%
  );
  pointer-events: none;
`;
const CardContent = styled.div`
  padding: 1.5rem;
  position: relative;
  height: 140px; /* Fixed height for perfect consistency */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(122, 107, 172, 0.05);
  }
`;
const Title = styled.h3`
  margin: 0 0 0.8rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.3;
  height: 2.6rem; /* Fixed height for 2 lines max */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: all 0.3s ease;
`;
const Description = styled.p`
  font-size: 0.9rem;
  color: var(--text-light);
  margin: 0;
  line-height: 1.4;
  height: 3.6rem; /* Fixed height for exactly 3 lines */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  flex: 1; /* Take remaining space */
`;

export default MeditationCard;
