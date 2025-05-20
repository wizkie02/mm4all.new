import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MeditationCard = ({ meditation }) => {
  const { id, title, description, thumbnail, category } = meditation;
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/meditation/${id}`);
  };    return (
    <CardContainer        
      whileHover={{ 
        y: -10, 
        boxShadow: '0 15px 35px rgba(31, 29, 62, 0.15)' 
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}      
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20, 
        duration: 0.4 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <ThumbnailContainer>
        <Thumbnail 
          src={thumbnail} 
          alt={`${title} Thumbnail`} 
          as={motion.img}          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.15 }}
        />
        <PlayButton
          as={motion.div}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            scale: isHovered ? 1 : 0.8,
            y: isHovered ? 0 : 10
          }}
          transition={{ duration: 0.15 }}
        >
          <motion.svg 
            width="30" 
            height="30" 
            viewBox="0 0 24 24" 
            fill="white"
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.1 }}
          >
            <path d="M8 5v14l11-7z"/>
          </motion.svg>
        </PlayButton>        <CategoryTag
          as={motion.span}          animate={{ 
            y: isHovered ? -5 : 0,
            backgroundColor: isHovered ? 'var(--lavender-darker)' : 'var(--primary-color)'
          }}
          transition={{ duration: 0.15 }}
        >
          {category}
        </CategoryTag>        <GlowEffect 
          as={motion.div}
          animate={{ opacity: isHovered ? 0.7 : 0 }}
          transition={{ duration: 0.15 }}
        />
      </ThumbnailContainer>
      <CardContent>
        <Title
          as={motion.h3}          animate={{ 
            color: isHovered ? 'var(--lavender-darker)' : 'var(--text-dark)',
            y: isHovered ? -2 : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </Title>
        <Description>{description}</Description>
        <TimeIndicator
          as={motion.div}
          initial={{ width: '0%', opacity: 0 }}          animate={{ 
            width: isHovered ? '50%' : '0%',
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.15 }}
        >
          <ClockIcon>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
            </svg>
          </ClockIcon>
          <span>10-15 min</span>
        </TimeIndicator>
      </CardContent>
    </CardContainer>
  );
};

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
  height: 200px;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, var(--primary-color), var(--lavender-darker));
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 4px 20px rgba(31, 29, 62, 0.3);
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

const CategoryTag = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: var(--primary-color);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
  box-shadow: 0 4px 10px rgba(160, 155, 231, 0.2);
  z-index: 10;
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
