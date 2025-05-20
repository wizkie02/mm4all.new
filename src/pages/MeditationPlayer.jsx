import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import BackgroundEffect from '../components/BackgroundEffect';

// Import placeholder images
import sleepImg1 from '../assets/product-candle.jpg';
import sleepImg2 from '../assets/product-diffuser.jpg';
import focusImg1 from '../assets/blog-meditation-beginners.jpg';
import focusImg2 from '../assets/blog-workplace-mindfulness.jpg';
import morningImg1 from '../assets/blog-breathing-techniques.jpg';
import anxietyImg1 from '../assets/blog-evening-rituals.jpg';

const MeditationPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  
  // Mock meditation data - in a real app, fetch based on ID
  const meditationData = {
    id: parseInt(id),
    title: getMeditationTitle(parseInt(id)),
    description: getMeditationDescription(parseInt(id)),
    thumbnail: getMeditationThumbnail(parseInt(id)),
    category: getMeditationCategory(parseInt(id)),
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder
    duration: '15:00',
    instructor: 'Sarah Johnson',
    background: 'A gentle meditation designed to help you relax and let go of stress. This guided practice focuses on breath awareness and body relaxation techniques.',
    benefits: [
      'Reduced stress and anxiety',
      'Improved sleep quality',
      'Enhanced mind-body connection',
      'Greater sense of inner peace'
    ]
  };
  
  // Get meditation details based on ID
  function getMeditationTitle(id) {
    switch(id) {
      case 1: return 'Relaxing Waves for Sleep';
      case 2: return 'Focus Your Mind Meditation';
      case 3: return 'Morning Start Meditation';
      case 4: return 'Anxiety Relief Guided Session';
      case 5: return 'Peaceful Night Meditation';
      case 6: return 'Deep Work Focus Track';
      default: return 'Meditation Session';
    }
  }
  
  function getMeditationDescription(id) {
    switch(id) {
      case 1: return 'Try this before bed for deep relaxation.';
      case 2: return 'Use this in the workspace to enhance concentration.';
      case 3: return 'Start your day refreshed and centered.';
      case 4: return 'Find calm amidst the storm.';
      case 5: return 'Drift off to a restful sleep.';
      case 6: return 'Enhance your productivity.';
      default: return 'A guided meditation session.';
    }
  }
  
  function getMeditationThumbnail(id) {
    switch(id) {
      case 1: return sleepImg1;
      case 2: return focusImg1;
      case 3: return morningImg1;
      case 4: return anxietyImg1;
      case 5: return sleepImg2;
      case 6: return focusImg2;
      default: return sleepImg1;
    }
  }
  
  function getMeditationCategory(id) {
    switch(id) {
      case 1: return 'sleep';
      case 2: return 'focus';
      case 3: return 'morning';
      case 4: return 'anxiety';
      case 5: return 'sleep';
      case 6: return 'focus';
      default: return 'meditation';
    }
  }
  
  // Audio player controls
  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    
    if (!prevValue) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };
  
  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    
    setCurrentTime(current);
    setDuration(duration);
  };
  
  const handleProgressChange = (e) => {
    const progressBar = progressBarRef.current;
    const percent = (e.nativeEvent.offsetX / progressBar.offsetWidth);
    const newTime = percent * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };
  
  const formatTime = (time) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    }
    return "0:00";
  };
  
  const jumpTime = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };
  
  // Focus effect for concentration meditations
  const isFocusCategory = meditationData.category === 'focus';
  
  return (
    <PageContainer>
      <BackgroundEffect />
      
      <BackButton 
        onClick={() => navigate('/meditate')}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Back to Library</span>
      </BackButton>
      
      <ContentWrapper>
        <MediaContainer>
          <ThumbnailImage
            src={meditationData.thumbnail}
            alt={meditationData.title}
            as={motion.img}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          
          {isFocusCategory && (
            <FocusBreathingCircle
              as={motion.div}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7] 
              }}
              transition={{ 
                repeat: Infinity,
                duration: 6, 
                ease: "easeInOut" 
              }}
            />
          )}
          
          <CategoryTag>{meditationData.category}</CategoryTag>
        </MediaContainer>
        
        <InfoContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <MeditationTitle>{meditationData.title}</MeditationTitle>
          <InstructorName>with {meditationData.instructor}</InstructorName>
          
          <AudioPlayer>
            <audio 
              ref={audioRef}
              src={meditationData.audioSrc}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleTimeUpdate}
            />
            
            <ProgressBarContainer 
              ref={progressBarRef}
              onClick={handleProgressChange}
            >
              <ProgressBar style={{ width: `${(currentTime / duration) * 100}%` }} />
            </ProgressBarContainer>
            
            <TimeAndControls>
              <TimeDisplay>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </TimeDisplay>
              
              <PlayerControls>
                <ControlButton 
                  onClick={() => jumpTime(-10)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V1L7 6L12 11V7C15.87 7 19 10.13 19 14C19 17.87 15.87 21 12 21C8.13 21 5 17.87 5 14H3C3 18.97 7.03 23 12 23C16.97 23 21 18.97 21 14C21 9.03 16.97 5 12 5Z" fill="currentColor"/>
                  </svg>
                  <span>10s</span>
                </ControlButton>
                
                <PlayPauseButton 
                  onClick={togglePlayPause}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isPlaying ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </PlayPauseButton>
                
                <ControlButton 
                  onClick={() => jumpTime(10)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V1L17 6L12 11V7C8.13 7 5 10.13 5 14C5 17.87 8.13 21 12 21C15.87 21 19 17.87 19 14H21C21 18.97 16.97 23 12 23C7.03 23 3 18.97 3 14C3 9.03 7.03 5 12 5Z" fill="currentColor"/>
                  </svg>
                  <span>10s</span>
                </ControlButton>
              </PlayerControls>
              
              <VolumeControl>
                <VolumeIcon>
                  {volume > 0.5 ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                  ) : volume > 0 ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                  )}
                </VolumeIcon>
                <VolumeSlider
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={handleVolumeChange}
                />
              </VolumeControl>
            </TimeAndControls>
          </AudioPlayer>
          
          <DescriptionBox>
            <h3>About this meditation</h3>
            <p>{meditationData.background}</p>
            
            <BenefitsSection>
              <h3>Benefits</h3>
              <BenefitsList>
                {meditationData.benefits.map((benefit, index) => (
                  <BenefitItem key={index}>
                    <BenefitIcon>✓</BenefitIcon>
                    <span>{benefit}</span>
                  </BenefitItem>
                ))}
              </BenefitsList>
            </BenefitsSection>
          </DescriptionBox>
        </InfoContainer>
      </ContentWrapper>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 6rem 0 4rem;
  position: relative;
`;

const ContentWrapper = styled.div`
  width: 92%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  position: relative;
  z-index: 10;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const BackButton = styled(motion.button)`
  background: none;
  border: none;
  color: var(--text-light);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  position: absolute;
  top: 2rem;
  left: 4%;
  z-index: 20;
  
  &:hover {
    color: var(--primary-color);
  }
  
  @media (max-width: 768px) {
    top: 1rem;
  }
`;

const MediaContainer = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  aspect-ratio: 1 / 1;
  max-height: 600px;
  
  @media (max-width: 768px) {
    aspect-ratio: 16 / 9;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FocusBreathingCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 50px rgba(255, 255, 255, 0.5);
  pointer-events: none;
`;

const CategoryTag = styled.span`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  color: white;
  padding: 0.5rem 1.2rem;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: capitalize;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const InfoContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const MeditationTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
`;

const InstructorName = styled.h3`
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 2rem;
`;

const AudioPlayer = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin-bottom: 1rem;
  cursor: pointer;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  border-radius: 4px;
  transform-origin: left center;
`;

const TimeAndControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-light);
`;

const PlayerControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
`;

const ControlButton = styled(motion.button)`
  background: none;
  border: none;
  color: var(--text-dark);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  
  span {
    font-size: 0.8rem;
  }
`;

const PlayPauseButton = styled(motion.button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const VolumeIcon = styled.div`
  display: flex;
  align-items: center;
  color: var(--text-dark);
`;

const VolumeSlider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.1);
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
    border: none;
  }
`;

const DescriptionBox = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  
  h3 {
    font-size: 1.3rem;
    color: var(--text-dark);
    margin-bottom: 1rem;
    font-weight: 500;
  }
  
  p {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-light);
    margin-bottom: 1.5rem;
  }
`;

const BenefitsSection = styled.div`
  margin-top: 1.5rem;
`;

const BenefitsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1rem;
  color: var(--text-light);
`;

const BenefitIcon = styled.span`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  flex-shrink: 0;
`;

export default MeditationPlayer;
