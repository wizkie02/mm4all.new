// Note: This is a refactored version aiming to match asoftmurmur.com functionality
// while preserving the original layout and color scheme.
// Incorporates user feedback: Timer, 5-col grid, larger icons, fixed sliders, centered play button.
// Placeholder icons and audio URLs are used.
// Assumes CSS variables like --primary-color, --accent-color, --text-light, --text-dark are globally available.

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundEffect from '../components/BackgroundEffect'; // Keep original background

// --- Sound-Related Icons (Improved & More Relevant) ---
const iconSize = "50px"; // Increased icon size

// Rain with cloud and droplets
const IconRain = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} fill="currentColor"><g transform="matrix(0.77 0 0 0.77 12 12)"><path transform="translate(-15, -14.51)" d="M 17.5 3 C 15.190761059566523 3.002490252604338 13.0562172598275 4.2299830293830745 11.892577999999999 6.224609400000004 C 11.443078905277378 6.076999566968081 10.973113793940723 6.0011987273179805 10.499999999999998 6.000000000000001 C 8.197284862857309 6.001465163573856 6.2672095425491285 7.7410614542506035 6.027343800000001 10.03125 C 3.740186742742711 10.272814773669591 2.0032499725009307 12.200123833307845 2.000000000000001 14.5 C 2 16.98528137423857 4.01471862576143 19 6.5 19 L 23.5 19 C 25.98528137423857 19 28 16.98528137423857 28 14.5 C 27.9987457043911 12.198629699659133 26.261296786905486 10.269067356465818 23.972655999999997 10.027344 C 23.988909987186254 9.852005618892 23.998032179376374 9.676079151721655 24 9.499999999999998 C 24 5.910149126099842 21.089850873900158 3 17.5 3 z M 5.984375 20.986328 C 5.4328588034331595 20.994949073062962 4.992447279873388 21.448468138368238 5 22 L 5 23 C 4.994899710454515 23.360635916577568 5.184375296169332 23.696081364571608 5.495872849714331 23.877887721486516 C 5.80737040325933 24.059694078401428 6.192629596740671 24.059694078401428 6.50412715028567 23.877887721486516 C 6.815624703830668 23.696081364571608 7.005100289545485 23.360635916577568 7 23 L 7 22 C 7.0037014610101975 21.729699667173673 6.897823324754008 21.46941334607979 6.706490332869745 21.27844827870817 C 6.515157340985481 21.087483211336544 6.254667707530458 20.98210627103109 5.984375 20.986328 z M 17.984375 20.986328 C 17.43285880343316 20.994949073062962 16.99244727987339 21.448468138368238 17 22 L 17 23 C 16.994899710454515 23.360635916577568 17.184375296169332 23.696081364571608 17.49587284971433 23.877887721486516 C 17.80737040325933 24.059694078401428 18.19262959674067 24.059694078401428 18.50412715028567 23.877887721486516 C 18.815624703830668 23.696081364571608 19.005100289545485 23.360635916577568 19 23 L 19 22 C 19.0037014610102 21.729699667173673 18.897823324754008 21.46941334607979 18.706490332869745 21.27844827870817 C 18.515157340985482 21.087483211336544 18.25466770753046 20.98210627103109 17.984375 20.986328 z M 11.984375 22.986328 C 11.43285880343316 22.994949073062962 10.992447279873389 23.448468138368238 11 24 L 11 25 C 10.994899710454515 25.360635916577568 11.184375296169332 25.696081364571608 11.495872849714331 25.877887721486516 C 11.80737040325933 26.059694078401428 12.192629596740671 26.059694078401428 12.504127150285669 25.877887721486516 C 12.815624703830668 25.696081364571608 13.005100289545485 25.360635916577568 13 25 L 13 24 C 13.003701461010198 23.729699667173673 12.89782332475401 23.46941334607979 12.706490332869745 23.27844827870817 C 12.51515734098548 23.087483211336544 12.254667707530459 22.98210627103109 11.984375 22.986328 z M 23.984375 22.986328 C 23.43285880343316 22.994949073062962 22.99244727987339 23.448468138368238 23 24 L 23 25 C 22.994899710454515 25.360635916577568 23.184375296169332 25.696081364571608 23.49587284971433 25.877887721486516 C 23.80737040325933 26.059694078401428 24.19262959674067 26.059694078401428 24.50412715028567 25.877887721486516 C 24.815624703830668 25.696081364571608 25.005100289545485 25.360635916577568 25 25 L 25 24 C 25.0037014610102 23.729699667173673 24.897823324754008 23.46941334607979 24.706490332869745 23.27844827870817 C 24.515157340985482 23.087483211336544 24.25466770753046 22.98210627103109 23.984375 22.986328 z"/></g></svg>;

// Lightning bolt for thunder
const IconThunder = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;

// Ocean waves
const IconWaves = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12c3-2 6-2 9 0s6 2 9 0"/><path d="M2 8c3-2 6-2 9 0s6 2 9 0"/><path d="M2 16c3-2 6-2 9 0s6 2 9 0"/><path d="M2 20c3-2 6-2 9 0s6 2 9 0"/></svg>;

// Wind swirls
const IconWind = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 111.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1112 8H2"/><path d="M14.6 20.6A2 2 0 1017 17H6"/></svg>;

// Fire flames
const IconFire = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>;

// Flying bird
const IconBirds = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 008-8V7a4 4 0 00-7.28-2.3L2 20"/><path d="M20 7l2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 003.84-10.61"/></svg>;

// Cricket insect body
const IconCrickets = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} fill="currentColor"><g transform="matrix(0.83 0 0 0.83 12 12)"><g><g transform="matrix(1 0 0 1 1.51 0.99)"><path transform="translate(-13.51, -12.99)" d="M 24 13.64 C 24.038970924329494 13.505457895738477 24.020889875399114 13.360809504295448 23.95 13.24 C 23.875825397922938 13.111007423520922 23.747055438774495 13.02270802296199 23.6 13 L 21.200000000000003 12.5 L 20.490000000000002 6.87 C 20.428976595398225 6.365034935656987 19.99862567252134 5.986326123525329 19.490000000000002 5.99 C 19.180000000000003 5.99 17.94 6.15 15.370000000000001 8.21 C 14.42353649223033 8.906245896003183 13.636092929464242 9.7959548565311 13.059999999999997 10.820000000000004 L 9.06 9.98 C 8.927739794106241 9.9555124520064 8.79116091177273 9.984265900918718 8.68 10.06 C 8.562525579330824 10.133143978357442 8.482335048995647 10.253429773860207 8.459999999999999 10.39 C 8.270583589542026 11.493326875669872 8.173580258829169 12.610537650086913 8.17 13.730000000000004 C 7.4488002400635045 13.940803833464848 6.771362922733774 14.279522492129713 6.169999999999998 14.73 C 5.671921680341049 15.220278250161757 5.307094170848405 15.829471355635318 5.109999999999999 16.5 L 5 16.76 C 4.853975875917813 17.191342385208472 4.455187415251563 17.486445846101496 4 17.5 C 3.4477152501692068 17.5 3 17.947715250169207 3 18.5 C 3 19.052284749830793 3.4477152501692068 19.5 4 19.5 C 5.327075181684912 19.501710641311277 6.505019593462666 18.650524782115706 6.919999999999999 17.39 L 7 17.14 C 7.185838965297113 16.57868674744305 7.610525576840195 16.128372495548234 8.16 15.91 L 9.35 15.44 C 9.57954442341813 15.58559821615197 9.816533620128746 15.719113256552319 10.059999999999997 15.84 L 9.62 16.74 C 9.432920951194067 17.19954575561842 8.986166173459253 17.50001799551086 8.489999999999998 17.5 C 7.937715250169205 17.5 7.489999999999998 17.947715250169207 7.489999999999998 18.5 C 7.489999999999998 19.052284749830793 7.937715250169205 19.5 8.489999999999998 19.5 C 9.797128905921179 19.533274387699862 10.989746756302521 18.758072784951988 11.489999999999998 17.55 L 11.959999999999999 16.55 C 11.959999999999999 16.55 14.629999999999999 17.18 14.87 17.220000000000002 C 15.813419963037529 17.36486014538433 16.765640476426064 17.445047135985465 17.719999999999995 17.459999999999997 C 17.862621737309865 17.45795873865088 17.998872471926674 17.40059000828591 18.099999999999998 17.3 C 18.194134849085287 17.189291636621284 18.237649261137964 17.044243596445696 18.22 16.900000000000002 L 17.669999999999998 12.090000000000003 C 17.641953085644964 11.874045184685816 17.482312552794866 11.698440598550707 17.27 11.650000000000004 L 15.18 11.220000000000004 C 15.605508388579695 10.663208746559818 16.10320874655981 10.1655083885797 16.66 9.740000000000006 C 17.281917883986424 9.212462554788832 17.951456010651867 8.743785866123025 18.659999999999997 8.340000000000005 L 19.93 18.5 L 19.5 18.5 C 19.085786437626904 18.5 18.75 18.835786437626904 18.75 19.25 C 18.75 19.664213562373096 19.085786437626904 20 19.5 20 L 22.5 20 C 22.914213562373096 20 23.25 19.664213562373096 23.25 19.25 C 23.25 18.835786437626904 22.914213562373096 18.5 22.5 18.5 L 22 18.5 L 21.75 16.5 C 22.792340196802336 15.818109822302892 23.582630552592928 14.813562970053518 24 13.64 Z"/></g><g transform="matrix(1 0 0 1 -8.46 -3.07)"><path transform="translate(-3.54, -8.93)" d="M 7.07 10 C 7.12117665417391 9.742082264929062 6.963840725855768 9.488596602638724 6.71 9.42 C 5.254845676311582 9.139180338399212 3.8852376453906237 8.522856724484779 2.7100000000000026 7.619999999999999 C 2.3262194948554176 7.363262443331845 2.0684474820102663 6.956636169547945 1.9999999999999998 6.5 C 1.9861842900698639 6.209010195865541 2.0668672460757795 5.921357917931408 2.23 5.68 C 2.6138379011324013 5.282354980121829 2.602645019878171 4.648837901132401 2.205 4.265 C 1.8073549801218287 3.8811620988675983 1.1738379011324014 3.892354980121829 0.79 4.29 C 0.25451199611011943 4.898990159712081 -0.028086681109662615 5.689551016238308 4.440892098500626e-16 6.5 C 0 7.79 0.93 9 2.6 10 C 2.436263621588657 11.066326762964513 2.8106644007833426 12.144601007045207 3.599999999999999 12.879999999999997 C 4.283714502359641 13.550998228640925 5.212580137872961 13.912424545961283 6.169999999999998 13.879999999999999 C 6.301679965098184 13.882687908889633 6.428897903017545 13.83225211354657 6.522965015983315 13.740066342840116 C 6.617032128949084 13.647880572133662 6.670027430527338 13.521707392769061 6.67 13.389999999999999 C 6.718437829006757 12.251592428402715 6.85214579242502 11.1184174384329 7.069999999999995 10.000000000000007 Z"/></g></g></g></svg>;

// Coffee cup with steam
const IconCoffeeShop = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><path d="M6 2v2"/><path d="M10 2v2"/><path d="M14 2v2"/></svg>;

// Tibetan singing bowl with sound vibrations
const IconSingingBowl = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14c0 4.4 3.6 8 8 8s8-3.6 8-8"/><path d="M20 14c0-1.1-3.6-2-8-2s-8 .9-8 2"/><path d="M12 12v-4"/><path d="M8 7a4 4 0 018 0"/><circle cx="12" cy="6" r="1"/><path d="M7 12c-1-1-1-2 0-3m10 3c1-1 1-2 0-3"/><path d="M5 15c-1-1-1-2 0-3m14 3c1-1 1-2 0-3"/></svg>;

// Sound waves for white noise
const IconWhiteNoise = () => <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 9h.01"/><path d="M15 9h.01"/><path d="M9 15h.01"/><path d="M15 15h.01"/><path d="M12 9h.01"/><path d="M12 15h.01"/><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M12 12h.01"/><path d="M6 12h.01"/><path d="M18 12h.01"/><path d="M3 12h.01"/><path d="M21 12h.01"/></svg>;
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
  { id: 'coffeeshop', title: 'Coffee Shop', Icon: IconCoffeeShop, audioSrc: 'https://cdn.freesound.org/previews/453/453074_3569783-lq.mp3' },
  { id: 'singingbowl', title: 'Singing Bowl', Icon: IconSingingBowl, audioSrc: 'https://cdn.freesound.org/previews/169/169289_71257-lq.mp3' },
  { id: 'whitenoise', title: 'White Noise', Icon: IconWhiteNoise, audioSrc: 'https://cdn.freesound.org/previews/249/249313_4056007-lq.mp3' },
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
  const countdownInterval = useRef(null);  // Cleanup function only
  useEffect(() => {
    return () => {
      // Clean up audio
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioRefs.current = {};
      
      if (activeTimerId.current) clearTimeout(activeTimerId.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, []);

  // Lazy load audio only when needed
  const getOrCreateAudio = (soundId) => {
    if (!audioRefs.current[soundId]) {
      const sound = soundsData.find(s => s.id === soundId);
      if (sound) {
        const audio = new Audio(sound.audioSrc);
        
        // Configure audio for seamless looping
        audio.loop = true;
        audio.volume = volumes[soundId] || 0;
        audio.preload = 'none'; // Only load when needed
        
        audio.addEventListener('error', (e) => {
          console.error(`Audio loading error for ${soundId}:`, e);
        });
        
        audioRefs.current[soundId] = audio;
      }
    }
    return audioRefs.current[soundId];
  };  // --- Playback Logic --- 
  const playAudio = (soundId) => {
    const audio = getOrCreateAudio(soundId);
    if (audio && audio.paused) {
      // console.log(`Playing ${soundId}`);
      audio.play().catch(e => console.error(`Error playing ${soundId}:`, e));
    }
  };

  const pauseAudio = (soundId) => {
    const audio = audioRefs.current[soundId]; // Only use existing audio
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
      const audio = getOrCreateAudio(soundId); // Create audio if needed
      
      if (audio) {
        if (isNowPlaying) {
          // When turning ON: set volume to 30% if it's 0, then play
          if (volumes[soundId] === 0) {
            setVolumes(prevVolumes => ({ ...prevVolumes, [soundId]: 0.3 }));
            audio.volume = 0.3;
          } else {
            audio.volume = volumes[soundId];
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
    
    // Apply volume to audio instance if it exists
    const audio = audioRefs.current[soundId];
    if (audio) {
      audio.volume = newVolume;
    }
    
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
        </OtherControls>        <SoundGridContainer>
          {soundsData.map((sound, index) => (            <SoundControlCard
              key={sound.id}
              as={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              isActive={playingSounds[sound.id]}
              onClick={() => toggleSound(sound.id)}
              title={`Toggle ${sound.title}`}
            >
              <IconWrapper 
                isActive={playingSounds[sound.id]}
              >
                <sound.Icon />
              </IconWrapper>
              <SoundLabel>{sound.title}</SoundLabel>              <VolumeSliderWrapper>
                <IndividualVolumeSlider
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volumes[sound.id]}
                  onChange={(e) => {
                    e.stopPropagation(); // Prevent card click when adjusting volume
                    handleVolumeChange(sound.id, e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()} // Prevent card click on slider click
                  onMouseDown={(e) => e.stopPropagation()} // Prevent card click on mouse down
                  onPointerDown={(e) => e.stopPropagation()} // Prevent card click on pointer down
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
  cursor: pointer; /* Make whole card clickable */
  
  &:hover {
    background: ${props => props.isActive ? 'rgba(var(--primary-color-rgb, 138, 43, 226), 0.35)' : 'rgba(255, 255, 255, 0.15)'};
    border-color: ${props => props.isActive ? 'var(--primary-color, #8a2be2)' : 'rgba(255, 255, 255, 0.4)'};
    transform: translateY(-2px);
  }
`;

const IconWrapper = styled.div`
  padding: 0.6rem; /* Adjusted padding */
  margin-bottom: 0.6rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  color: ${props => props.isActive ? 'var(--primary-color, #8a2be2)' : 'var(--text-light, #ccc)'};
  border: 2px solid transparent; // Border removed, background indicates active
  background-color: ${props => props.isActive ? 'rgba(var(--primary-color-rgb, 138, 43, 226), 0.15)' : 'transparent'};
  pointer-events: none; /* Let card handle clicks */

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

