import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundEffect from '../components/BackgroundEffect';
import AudioVisualizer from '../components/AudioVisualizer';

const SleepSounds = () => {
  const [playing, setPlaying] = useState(null);
  const [volume, setVolume] = useState(0.7);
  const audioRefs = useRef({});
  const [activeTab, setActiveTab] = useState('sleep');
  
  const soundsData = {
    'sleep': [
      {
        id: 'sleep-1',
        title: 'Ocean Waves',
        description: 'Gentle waves crashing on the shore',
        thumbnail: sleepImg1,
        audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Replace with actual audio
      },
      {
        id: 'sleep-2',
        title: 'Rainfall',
        description: 'Soft rain on a window',
        thumbnail: sleepImg2,
        audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' // Replace with actual audio
      },
      {
        id: 'sleep-3',
        title: 'White Noise',
        description: 'Consistent sound frequency',
        thumbnail: morningImg1,
        audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' // Replace with actual audio
      }
    ],
    'ambience': [
      {
        id: 'ambience-1',
        title: 'Forest Sounds',
        description: 'Birds chirping in a forest',
        thumbnail: morningImg1,
        audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' // Replace with actual audio
      },
      {
        id: 'ambience-2',
        title: 'Cafe Ambience',
        description: 'Gentle murmurs of a coffee shop',
        thumbnail: sleepImg2,
        audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' // Replace with actual audio
      }
    ],
    'relax': [
      {
        id: 'relax-1',
        title: 'Gentle Piano',
        description: 'Soft piano melodies',
        thumbnail: sleepImg1,
        audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' // Replace with actual audio
      },
      {
        id: 'relax-2',
        title: 'Meditation Bowls',
        description: 'Tibetan singing bowls',
        thumbnail: sleepImg2,
        audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' // Replace with actual audio
      }
    ]
  };
    
  const handlePlayPause = (soundId) => {
    // Stop any currently playing sound
    if (playing && playing !== soundId && audioRefs.current[playing]) {
      audioRefs.current[playing].pause();
      audioRefs.current[playing].currentTime = 0;
    }
    
    // Play or pause the selected sound
    if (playing === soundId) {
      audioRefs.current[soundId].pause();
      setPlaying(null);
    } else {
      if (audioRefs.current[soundId]) {
        audioRefs.current[soundId].volume = volume;
        
        // Create a fade-in effect
        audioRefs.current[soundId].volume = 0;
        const fadeAudio = setInterval(() => {
          if (audioRefs.current[soundId].volume < volume) {
            audioRefs.current[soundId].volume += 0.05;
            if (audioRefs.current[soundId].volume >= volume) {
              clearInterval(fadeAudio);
            }
          }
        }, 100);
        
        audioRefs.current[soundId].play();
        setPlaying(soundId);
      }
    }
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    // Update volume of currently playing sound
    if (playing && audioRefs.current[playing]) {
      audioRefs.current[playing].volume = newVolume;
    }
  };
  
  const tabs = [
    { id: 'sleep', label: 'Sleep Sounds' },
    { id: 'ambience', label: 'Ambient Noise' },
    { id: 'relax', label: 'Relaxation' }
  ];
  
  return (
    <PageContainer>
      <BackgroundEffect />
      
      <PageWrapper>
        <HeaderSection>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <PageTitle>Sleep & Relaxing Sounds</PageTitle>
            <GradientUnderline />
            <Description>
              Explore our collection of calming sounds designed to help you relax, focus, or drift into sleep.
              Mix different sounds to create your perfect ambient soundscape.
            </Description>
          </motion.div>
        </HeaderSection>
        
        <TabsContainer>
          {tabs.map((tab, index) => (
            <TabButton 
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              as={motion.button}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -3 }}
            >
              {tab.label}
              {activeTab === tab.id && <TabActiveIndicator layoutId="activeTab" />}
            </TabButton>
          ))}
        </TabsContainer>
        
        <VolumeControl>
          <VolumeLabel>
            <VolumeIcon>
              {volume > 0.7 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              ) : volume > 0.3 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
              ) : volume > 0 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 9v6h4l5 5V4l-5 5H7z"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              )}
            </VolumeIcon>
            <span>Master Volume</span>
          </VolumeLabel>
          <VolumeSlider 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={handleVolumeChange}
          />
          <VolumePercentage>{Math.round(volume * 100)}%</VolumePercentage>
        </VolumeControl>
        
        <AnimatePresence mode="wait">
          <SoundGrid
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {soundsData[activeTab].map((sound, index) => (
              <SoundCard
                key={sound.id}
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              >
                <audio 
                  ref={el => audioRefs.current[sound.id] = el} 
                  src={sound.audioSrc} 
                  loop 
                />                <SoundThumbnail>
                  <img src={sound.thumbnail} alt={sound.title} />
                  <PlayButton 
                    isPlaying={playing === sound.id} 
                    onClick={() => handlePlayPause(sound.id)}
                    as={motion.button}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {playing === sound.id ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </PlayButton>
                  {playing === sound.id && (
                    <SoundWaves>
                      <Wave delay={0} />
                      <Wave delay={0.2} />
                      <Wave delay={0.4} />
                      <Wave delay={0.6} />
                    </SoundWaves>
                  )}
                </SoundThumbnail>
                <SoundInfo>
                  <SoundTitle>{sound.title}</SoundTitle>
                  <SoundDescription>{sound.description}</SoundDescription>
                </SoundInfo>
                <VisualizerWrapper>
                  <AudioVisualizer 
                    audioId={sound.id} 
                    isPlaying={playing === sound.id} 
                  />
                </VisualizerWrapper>
              </SoundCard>
            ))}
          </SoundGrid>
        </AnimatePresence>
        
        <TipBox>
          <TipIcon>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </TipIcon>
          <div>
            <TipTitle>Sleep Sound Tips</TipTitle>
            <TipText>For the best sleep experience, set a timer that gradually reduces the volume before stopping. Keep your device at a safe distance and ensure the volume is at a comfortable level.</TipText>
          </div>
        </TipBox>
      </PageWrapper>
    </PageContainer>
  );
};

const PageContainer = styled.section`
  position: relative;
  min-height: 100vh;
  padding: 4rem 0;
`;

const PageWrapper = styled.div`
  width: 92%;
  max-width: 1300px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const GradientUnderline = styled.div`
  height: 4px;
  width: 80px;
  background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  margin: 0.5rem auto 1.5rem;
  border-radius: 2px;
`;

const Description = styled.p`
  max-width: 700px;
  margin: 0 auto;
  font-size: 1.2rem;
  color: var(--text-light);
  line-height: 1.7;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
`;

const TabButton = styled.button`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)'};
  color: var(--text-dark);
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 30px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  min-width: 150px;
  
  @media (max-width: 600px) {
    width: 100%;
    max-width: 300px;
  }
`;

const TabActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(var(--primary-color-rgb), 0.15) 0%, 
    rgba(var(--accent-color-rgb), 0.15) 100%);
  border-radius: 30px;
  z-index: -1;
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  border-radius: 50px;
  margin: 0 auto 2rem;
  max-width: 600px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    flex-direction: column;
    border-radius: 20px;
    padding: 1rem;
    gap: 0.5rem;
  }
`;

const VolumeLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-dark);
  font-weight: 500;
  min-width: 150px;
  
  span {
    font-size: 0.9rem;
  }
`;

const VolumeIcon = styled.div`
  display: flex;
  align-items: center;
  color: var(--primary-color);
`;

const VolumeSlider = styled.input`
  -webkit-appearance: none;
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--primary-color);
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--primary-color);
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const VolumePercentage = styled.div`
  min-width: 40px;
  font-size: 0.9rem;
  color: var(--text-light);
  text-align: right;
`;

const SoundGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const SoundCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
`;

const SoundThumbnail = styled.div`
  position: relative;
  height: 180px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${SoundCard}:hover img {
    transform: scale(1.05);
  }
`;

const PlayButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.isPlaying 
    ? 'var(--accent-color)' 
    : 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const SoundWaves = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const Wave = styled(motion.div).attrs({
  animate: {
    scale: [1, 1.5, 1],
    opacity: [0.3, 0.7, 0.3],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    delay: props => props.delay,
    ease: "easeInOut"
  }
})`
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  opacity: 0.3;
`;

const SoundInfo = styled.div`
  padding: 1.2rem;
`;

const SoundTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const SoundDescription = styled.p`
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 0;
`;

const TipBox = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const TipIcon = styled.div`
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const TipTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const TipText = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;

const VisualizerWrapper = styled.div`
  width: 100%;
  margin-top: 10px;
  padding: 0 10px;
  overflow: hidden;
  transition: opacity 0.3s ease;
`;

export default SleepSounds;
