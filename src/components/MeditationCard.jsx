import React, { useState } from "react";
import styled from "styled-components";
import { motion, scale } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

const MyPlyrVideo = ({ videoID }) => {
  const plyrProps = {
    source: {
      type: "video",
      sources: [
        {
          src: videoID,
          provider: "youtube",
        },
      ],
    },
    options: {
      controls: [
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "settings",
        "fullscreen",
      ],
      loop: {
        active: true,
      },
      youtube: {
        noCookie: true,
        rel: 0,
      },
    },
  };

  return (
    <PlayerWrapper>
      <Plyr {...plyrProps} />
    </PlayerWrapper>
  );
};

const MeditationCard = ({ meditation }) => {
  const { id, title, description, videoID, duration } = meditation;
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/meditation/${id}`);
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
        {/* <IFrameWrapper> */}
          {/* <iframe
            width={640}
            height={480}
            src={`https://www.youtube.com/embed/${videoID}?rel=0&loop=1`}
            title={title}
            allowFullScreen
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope;"
          /> */}
          {/* <ReactPlayer
            url={`https://www.youtube.com/embed/${videoID}?rel=0&loop=1`}
            controls
            width={640}
            height={480}
          /> */}
          <MyPlyrVideo videoID={videoID} />
        {/* </IFrameWrapper> */}
        <GlowEffect
          as={motion.div}
          animate={{ opacity: isHovered ? 0.7 : 0 }}
          transition={{ duration: 0.15 }}
        />
      </ThumbnailContainer>
      <CardContent>
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
        <Description>{description}</Description>
        <TimeIndicator
          as={motion.div}
          initial={{ width: "0%", opacity: 0 }}
          animate={{
            width: isHovered ? "50%" : "0%",
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <ClockIcon>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
            </svg>
          </ClockIcon>
          <span>{duration}</span>
        </TimeIndicator>
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
  max-width: 640px; /* or any fixed size */
  height: 100%
  aspect-ratio: 16 / 9;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
`;

const CardContainer = styled(motion.div)`
  background-color: var(--white);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(31, 29, 62, 0.1);
  transition: all var(--transition);
  position: relative;
`;

const ThumbnailContainer = styled.div`
  position: relative;
  overflow: hidden;
  min-height: 200px;
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
`;

const Title = styled.h3`
  margin-bottom: 0.7rem;
  font-size: 1.3rem;
  font-weight: 600;
  transition: all 0.3s ease;
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: var(--text-light);
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const TimeIndicator = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-light);
  gap: 5px;
  opacity: 0.8;
  overflow: hidden;

  span {
    white-space: nowrap;
  }
`;

const ClockIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 4px;
`;

export default MeditationCard;
