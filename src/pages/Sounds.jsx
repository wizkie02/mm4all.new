// Note: This is a refactored version aiming to match asoftmurmur.com functionality
// while preserving the original layout and color scheme.
// Incorporates user feedback: Timer, 5-col grid, larger icons, fixed sliders, centered play button.
// Placeholder icons and audio URLs are used.
// Assumes CSS variables like --primary-color, --accent-color, --text-light, --text-dark are globally available.

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundEffect from '../components/BackgroundEffect'; // Keep original background

// --- Placeholder Icons (Increased Size) ---
const iconSize = "50px"; // Increased icon size
const IconRain = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 13.15V4.5a4 4 0 00-8 0v8.65m.8 4.7a4 4 0 006.4 0M12 17.85v4.6M8 16.5l-2 2m12-2l2 2"></path></svg>;
const IconThunder = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>;
const IconWaves = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6c3 0 5 2 8 2s5-2 8-2 3 2 3 2v10c-3 0-5-2-8-2s-5 2-8 2-3-2-3-2V6z"></path><path d="M3 12c3 0 5 2 8 2s5-2 8-2 3 2 3 2"></path></svg>;
const IconWind = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"></path></svg>;
const IconFire = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19c0 1.1-.9 2-2 2s-2-.9-2-2c0-1.1.9-2 2-2s2 .9 2 2zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 14.5c-2.5 0-4.5-2-4.5-4.5 0-1.7.9-3.2 2.3-4M12 10c.9 0 1.7.3 2.3.8"></path></svg>;
const IconBirds = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 7.5c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8zM18 16l4 4M18 4l4-4"></path></svg>;
const IconCrickets = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10m0-4V2m8 10l-2.83 2.83M6.83 6.83L4 4m13.17 13.17L14 14m-4 4l-2.83 2.83M6.83 17.17L4 20m13.17-13.17L14 10"></path></svg>;
const IconCoffeeShop = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3m4-3v3m4-3v3"></path></svg>;
const IconSingingBowl = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8c-4.4 0-8 1.8-8 4s3.6 4 8 4 8-1.8 8-4-3.6-4-8-4zM4 12H2m18 0h2M12 4V2m0 18v2M7 17l-2 2m14-2l2 2M7 7l-2-2m14 2l2-2"></path></svg>;
const IconWhiteNoise = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18"></path></svg>;
// --- End Placeholder Icons ---

// --- Sound Data (Matching asoftmurmur, using placeholder audio) ---
const soundsData = [
  { id: 'rain', title: 'Rain', Icon: IconRain, audioSrc: 'https://cdn.freesound.org/previews/399/399072_3710957-lq.mp3' },
  { id: 'thunder', title: 'Thunder', Icon: IconThunder, audioSrc: 'https://cdn.freesound.org/previews/531/531873_1059037-lq.mp3' },
  { id: 'waves', title: 'Waves', Icon: IconWaves, audioSrc: 'https://cdn.freesound.org/previews/156/156598_981371-lq.mp3' },
  { id: 'wind', title: 'Wind', Icon: IconWind, audioSrc: 'https://cdn.freesound.org/previews/527/527281_942923-lq.mp3' },
  { id: 'fire', title: 'Fire', Icon: IconFire, audioSrc: 'https://cdn.freesound.org/previews/729/729395_12863902-lq.mp3' },
  { id: 'birds', title: 'Birds', Icon: IconBirds, audioSrc: 'https://cdn.freesound.org/previews/468/468449_3405405-lq.mp3' },
  { id: 'crickets', title: 'Crickets', Icon: IconCrickets, audioSrc: 'https://cdn.freesound.org/previews/210/210540_985466-lq.mp3' },
  { id: 'coffeeshop', title: 'Coffee Shop', Icon: IconCoffeeShop, audioSrc: 'https://cdn.freesound.org/previews/609/609250_1445263-lq.mp3' },
  { id: 'singingbowl', title: 'Singing Bowl', Icon: IconSingingBowl, audioSrc: 'https://cdn.freesound.org/previews/169/169289_71257-lq.mp3' },
  { id: 'whitenoise', title: 'White Noise', Icon: IconWhiteNoise, audioSrc: 'https://cdn.freesound.org/previews/255/255890_1216015-lq.mp3' },
];

const Sounds = () => {
  const [volumes, setVolumes] = useState(
    soundsData.reduce((acc, sound) => ({ ...acc, [sound.id]: 0 }), {})
  );
  const [playingSounds, setPlayingSounds] = useState(
    soundsData.reduce((acc, sound) => ({ ...acc, [sound.id]: false }), {})
  );const audioRefs = useRef({});
  const [isMasterPlaying, setIsMasterPlaying] = useState(false);const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [timerSettings, setTimerSettings] = useState({ hours: 0, minutes: 5, type: 'stop', fade: false });
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const activeTimerId = useRef(null);
  const countdownInterval = useRef(null);  // Initialize Audio elements
  useEffect(() => {
    soundsData.forEach(sound => {
      // Create single audio instance with seamless looping
      if (!audioRefs.current[sound.id]) {
        const audio = new Audio(sound.audioSrc);
        
        // Configure audio for seamless looping
        audio.loop = true; // Enable native looping for seamless playback
        audio.volume = 0;
        audio.preload = 'auto';
        
        audio.addEventListener('error', (e) => {
          console.error(`Audio loading error for ${sound.id}:`, e);
        });
        
        audioRefs.current[sound.id] = audio;
      }
    });    return () => {
      // Clean up audio
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioRefs.current = {};
      
      if (activeTimerId.current) clearTimeout(activeTimerId.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, []);  // --- Playback Logic --- 
  const playAudio = (soundId) => {
    const audio = audioRefs.current[soundId];
    if (audio && audio.paused) {
      // console.log(`Playing ${soundId}`);
      audio.play().catch(e => console.error(`Error playing ${soundId}:`, e));
    }
  };

  const pauseAudio = (soundId) => {
    const audio = audioRefs.current[soundId];
    if (audio && !audio.paused) {
      // console.log(`Pausing ${soundId}`);
      audio.pause();
    }
  };
  // Update master playing state based on individual states
  useEffect(() => {
    const anySoundPlaying = Object.entries(playingSounds).some(([id, isPlaying]) => isPlaying);
    setIsMasterPlaying(anySoundPlaying);
  }, [playingSounds]);  // Toggle individual sound
  const toggleSound = useCallback((soundId) => {
    setPlayingSounds(prev => {
      const isNowPlaying = !prev[soundId];
      const audio = audioRefs.current[soundId];
      
      if (audio) {
        if (isNowPlaying) {
          // When turning ON: set volume to 30% if it's 0, then play
          if (volumes[soundId] === 0) {
            setVolumes(prevVolumes => ({ ...prevVolumes, [soundId]: 0.3 }));
            audio.volume = 0.3;
          }
          playAudio(soundId);
        } else {
          // When turning OFF: pause the audio
          pauseAudio(soundId);
        }
      }
      return { ...prev, [soundId]: isNowPlaying };
    });
  }, [volumes]); // Dependency on volumes ensures playAudio checks current volume// Handle individual volume change
  const handleVolumeChange = useCallback((soundId, value) => {
    const newVolume = parseFloat(value);
    setVolumes(prev => ({ ...prev, [soundId]: newVolume }));
    
    // Apply volume to audio instance
    const audio = audioRefs.current[soundId];
    if (audio) audio.volume = newVolume;
    
    // Volume change doesn't affect playing state, only adjusts volume
  }, []);
  // Master Play/Pause Logic
  const handleMasterPlayPause = useCallback(() => {
    const nextMasterState = !isMasterPlaying;
    setIsMasterPlaying(nextMasterState);

    Object.entries(playingSounds).forEach(([soundId, shouldBePlaying]) => {
      if (shouldBePlaying) { // Only affect sounds the user intended to play
        if (nextMasterState) {
          playAudio(soundId);
        } else {
          pauseAudio(soundId);
        }
      }
    });
  }, [isMasterPlaying, playingSounds]);

  // --- Timer Logic --- 
  const handleTimerSettingChange = (field, value) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setTimerSettings(prev => ({ ...prev, [field]: numValue }));
    }
  };
  const startTimer = () => {
    if (activeTimerId.current) clearTimeout(activeTimerId.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    
    const { hours, minutes, type } = timerSettings;
    const totalMilliseconds = (hours * 3600 + minutes * 60) * 1000;

    if (totalMilliseconds <= 0) return; // No timer needed

    // Set initial state
    setTimerActive(true);
    setTimeRemaining(totalMilliseconds);

    // Start countdown display
    countdownInterval.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          clearInterval(countdownInterval.current);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    activeTimerId.current = setTimeout(() => {
      console.log(`Timer finished: ${type}`);
      setTimerActive(false);
      setTimeRemaining(0);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
      
      if (type === 'stop') {
        // Pause all sounds and update state
        setPlayingSounds(prevPlayingSounds => {
          const newPlayingSounds = { ...prevPlayingSounds };
          Object.keys(newPlayingSounds).forEach(soundId => {
            if (newPlayingSounds[soundId]) {
              pauseAudio(soundId);
              newPlayingSounds[soundId] = false;
            }
          });
          return newPlayingSounds;
        });
        setIsMasterPlaying(false);      } else { // type === 'start'
        // Play all sounds with default volume of 30%
        setPlayingSounds(prevPlayingSounds => {
          const newPlayingSounds = { ...prevPlayingSounds };
          soundsData.forEach(sound => {
            newPlayingSounds[sound.id] = true;
            // Set volume to 30% if it's 0
            if (volumes[sound.id] === 0) {
              setVolumes(prevVolumes => ({ ...prevVolumes, [sound.id]: 0.3 }));
              const audio = audioRefs.current[sound.id];
              if (audio) audio.volume = 0.3;
            }
            playAudio(sound.id);
          });
          return newPlayingSounds;
        });
      }
      activeTimerId.current = null;
    }, totalMilliseconds);

    setIsTimerModalOpen(false);
  };
  const cancelTimer = () => {
    if (activeTimerId.current) {
      clearTimeout(activeTimerId.current);
      activeTimerId.current = null;
    }
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
    }
    setTimerActive(false);
    setTimeRemaining(0);
    setIsTimerModalOpen(false);
    console.log("Timer cancelled");
  };

  return (
    <PageContainer>
      <PageWrapper>        <HeaderSection>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <PageTitle>Relaxing Sounds</PageTitle>
            <GradientUnderline />
            <Description>
              Mix ambient sounds to wash away distraction. Adjust individual volumes to create your perfect soundscape.
            </Description>
          </motion.div>
        </HeaderSection>

        {/* Centered Master Play Button */} 
        <CenteredPlayButtonWrapper>
            <MasterPlayButton onClick={handleMasterPlayPause} title={isMasterPlaying ? "Pause All" : "Play All"} isPlaying={isMasterPlaying}>
                {isMasterPlaying ? (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
            </MasterPlayButton>
        </CenteredPlayButtonWrapper>        {/* Other Controls (Timer, etc.) */} 
        <OtherControls>
          <ControlButton onClick={() => setIsTimerModalOpen(true)} title="Set Timer">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
             Timers
          </ControlButton>
          {timerActive && (
            <TimerDisplay>
              <TimerIcon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </TimerIcon>
              <TimerText>
                {Math.floor(timeRemaining / 60000)}:{String(Math.floor((timeRemaining % 60000) / 1000)).padStart(2, '0')}
              </TimerText>
              <CancelTimerButton onClick={cancelTimer} title="Cancel Timer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </CancelTimerButton>
            </TimerDisplay>
          )}
        </OtherControls>

        <SoundGridContainer>
          {soundsData.map((sound, index) => (            <SoundControlCard
              key={sound.id}
              as={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              isActive={playingSounds[sound.id]}
            >
              <IconWrapper 
                onClick={() => toggleSound(sound.id)}
                isActive={playingSounds[sound.id]}
                title={`Toggle ${sound.title}`}
              >
                <sound.Icon />
              </IconWrapper>
              <SoundLabel>{sound.title}</SoundLabel>
              <VolumeSliderWrapper>
                <IndividualVolumeSlider
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volumes[sound.id]}
                  onChange={(e) => handleVolumeChange(sound.id, e.target.value)}
                  title={`${sound.title} Volume: ${Math.round(volumes[sound.id] * 100)}%`}
                  // Slider is always enabled, but sound only plays if toggled on AND volume > 0
                />
              </VolumeSliderWrapper>
            </SoundControlCard>
          ))}
        </SoundGridContainer>

        <TipBox>
          <TipIcon>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </TipIcon>
          <div>
            <TipTitle>Sound Mixing Tips</TipTitle>
            <TipText>Click icons to toggle sounds. Adjust sliders for volume. Use the large central button to play/pause all active sounds. Set a timer using the 'Timers' button.</TipText>
          </div>
        </TipBox>

        {/* Timer Modal */} 
        <AnimatePresence>
          {isTimerModalOpen && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cancelTimer} // Close modal on overlay click
            >
              <ModalContent
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
              >
                <ModalHeader>Set Timer</ModalHeader>
                <TimerTypeSelector>
                  <TimerTypeButton 
                    active={timerSettings.type === 'stop'} 
                    onClick={() => setTimerSettings(prev => ({...prev, type: 'stop'}))}
                  >
                    Stop playing after
                  </TimerTypeButton>
                  <TimerTypeButton 
                    active={timerSettings.type === 'start'} 
                    onClick={() => setTimerSettings(prev => ({...prev, type: 'start'}))}
                  >
                    Start playing after
                  </TimerTypeButton>
                  {/* Fade option - future enhancement */}
                  {/* <TimerTypeButton disabled>Fade</TimerTypeButton> */}
                </TimerTypeSelector>
                <TimeInputArea>
                  <TimeInput 
                    type="number" 
                    value={timerSettings.hours}
                    onChange={(e) => handleTimerSettingChange('hours', e.target.value)}
                    min="0"
                  /> 
                  <span>hours and</span>
                  <TimeInput 
                    type="number" 
                    value={timerSettings.minutes}
                    onChange={(e) => handleTimerSettingChange('minutes', e.target.value)}
                    min="0"
                    max="59"
                  /> 
                  <span>minutes</span>
                </TimeInputArea>
                <ModalActions>
                  <ModalButton onClick={cancelTimer}>Cancel</ModalButton>
                  <ModalButton primary onClick={startTimer}>Start timer</ModalButton>
                </ModalActions>
              </ModalContent>
            </ModalOverlay>
          )}
        </AnimatePresence>

      </PageWrapper>
    </PageContainer>
  );
};

// --- Styled Components --- 

const PageContainer = styled.section`
  position: relative;
  min-height: 100vh;
  padding: 3rem 1rem 4rem; /* Adjusted padding */
  overflow-x: hidden;
`;

const PageWrapper = styled.div`
  width: 95%;
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 1.5rem; /* Reduced margin */
  width: 100%;
`;

const PageTitle = styled.h1`
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-color, #8a2be2) 0%, var(--accent-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const GradientUnderline = styled.div`
  height: 4px;
  width: 80px;
  background: linear-gradient(to right, var(--primary-color, #8a2be2), var(--accent-color));
  margin: 0.5rem auto 1.5rem;
  border-radius: 2px;
`;

const Description = styled.p`
  max-width: 700px;
  margin: 0 auto;
  font-size: clamp(1rem, 2.5vw, 1.1rem);
  color: var(--text-light, #ccc);
  line-height: 1.7;
`;

const CenteredPlayButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1.5rem 0; /* Spacing around the button */
    width: 100%;
`;

const MasterPlayButton = styled.button`
    background: var(--primary-color, #8a2be2);
    border: 2px solid var(--primary-color, #8a2be2);
    color: white;
    width: 80px; /* Larger size */
    height: 80px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
    box-shadow: 0 5px 15px rgba(161, 155, 232, 0.4);    &:hover {
        transform: scale(1.05);
        background: var(--accent-color);
        border-color: var(--accent-color);
        box-shadow: 0 6px 20px rgba(161, 155, 232, 0.6);
    }

    svg {
        display: block;
    }
`;

const OtherControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 2.5rem; /* Spacing below controls */
  flex-wrap: wrap;
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-light, #eee);
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem; /* Space between icon and text */

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
     display: block;
  }
`;

const SoundGridContainer = styled(motion.div)`
  display: grid;
  /* Aim for 5 columns on medium/large screens */
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); 
  gap: 1.5rem;
  width: 100%;
  max-width: 900px; 
  margin-bottom: 3rem;

  @media (min-width: 768px) {
     grid-template-columns: repeat(5, 1fr); /* Force 5 columns */
  }
  @media (max-width: 480px) {
     grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); 
     gap: 1rem;
  }
`;

const SoundControlCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 0.5rem; /* Adjusted padding */
  border-radius: var(--border-radius, 12px);
  background: ${props => props.isActive ? 'rgba(var(--primary-color-rgb, 138, 43, 226), 0.25)' : 'rgba(255, 255, 255, 0.08)'};
  border: 1px solid ${props => props.isActive ? 'var(--primary-color, #8a2be2)' : 'rgba(255, 255, 255, 0.2)'};
  transition: all 0.3s ease;
  backdrop-filter: blur(2px);
`;

const IconWrapper = styled.div`
  padding: 0.6rem; /* Adjusted padding */
  margin-bottom: 0.6rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.isActive ? 'var(--primary-color, #8a2be2)' : 'var(--text-light, #ccc)'};
  border: 2px solid transparent; // Border removed, background indicates active
  background-color: ${props => props.isActive ? 'rgba(var(--primary-color-rgb, 138, 43, 226), 0.15)' : 'transparent'};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }

  svg {
    display: block;
    /* Size is set directly on SVG components now */
  }
`;

const SoundLabel = styled.span`
  font-size: 0.85rem; /* Slightly larger label */
  color: var(--text-light, #eee);
  margin-bottom: 0.8rem; /* Increased margin */
  text-align: center;
`;

const VolumeSliderWrapper = styled.div`
  width: 85%; /* Slightly wider */
  height: 20px;
  display: flex;
  align-items: center;
`;

const IndividualVolumeSlider = styled.input`  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px; /* Slightly thicker */
  border-radius: 3px;
  background: linear-gradient(to right, var(--primary-color, #8a2be2), var(--accent-color));
  outline: none;
  opacity: 0.8; /* Consistent opacity regardless of volume */
  transition: opacity 0.2s;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px; /* Slightly larger thumb */
    height: 16px;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--primary-color, #8a2be2);
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.1s ease;
  }
   &::-webkit-slider-thumb:active {
      transform: scale(1.1);
   }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--primary-color, #8a2be2);
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const TipBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  padding: 1.5rem;
  border-radius: var(--border-radius, 12px);
  margin-top: 3rem;
  max-width: 800px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-light, #eee);
`;

const TipIcon = styled.div`
  color: var(--primary-color, #8a2be2);
  flex-shrink: 0;
  margin-top: 2px;
`;

const TipTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-light, #fff);
`;

const TipText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-light, #ddd);
`;

// --- Timer Modal Styles ---
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled(motion.div)`
  background: rgba(240, 239, 252, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: var(--border-radius, 12px);
  border: 1px solid var(--primary-color);
  width: 90%;
  max-width: 450px;
  color: var(--text-dark);
  box-shadow: 0 10px 30px rgba(161, 155, 232, 0.3);
`;

const ModalHeader = styled.h2`
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
  color: var(--text-dark);
`;

const TimerTypeSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const TimerTypeButton = styled.button`
  flex: 1;
  padding: 0.7rem;
  border: 1px solid ${props => props.active ? 'var(--primary-color, #8a2be2)' : '#ddd'};
  background: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--text-dark)'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.active ? 'var(--primary-color)' : '#f5f5f5'};
    border-color: ${props => props.active ? 'var(--primary-color)' : '#bbb'};
  }
  &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
  }
`;

const TimeInputArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  margin-bottom: 2rem;
  color: var(--text-dark);
`;

const TimeInput = styled.input`
  width: 60px;
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: white;
  color: var(--text-dark);
  text-align: center;
  font-size: 1rem;
  -moz-appearance: textfield; /* Firefox */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(161, 155, 232, 0.2);
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ModalButton = styled.button`
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  border: 1px solid ${props => props.primary ? 'var(--primary-color, #8a2be2)' : '#ddd'};
  background: ${props => props.primary ? 'var(--primary-color, #8a2be2)' : 'white'};
  color: ${props => props.primary ? 'white' : 'var(--text-dark)'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    background: ${props => props.primary ? 'var(--primary-color, #8a2be2)' : '#f5f5f5'};
    border-color: ${props => props.primary ? 'var(--primary-color, #8a2be2)' : '#bbb'};
  }
`;

const TimerDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary-color);
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(161, 155, 232, 0.3);
  backdrop-filter: blur(5px);
`;

const TimerIcon = styled.div`
  display: flex;
  align-items: center;
  color: white;
`;

const TimerText = styled.span`
  font-family: monospace;
  font-weight: 600;
  min-width: 50px;
`;

const CancelTimerButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  svg {
    display: block;
  }
`;

export default Sounds;

