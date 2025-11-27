import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
const AudioVisualizer = ({ audioId, isPlaying }) => {
  const canvasRef = useRef(null);
  const audioRef = useRef(document.getElementById(audioId));
  const animationRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    // Adjust for device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    // Create audio context and analyzer if playing
    if (isPlaying && audioRef.current) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyzer = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyzer);
      analyzer.connect(audioContext.destination);
      analyzer.fftSize = 256;
      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      // Canvas dimensions
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      // Visualizer settings
      const barWidth = width / bufferLength * 2.5;
      const barSpacing = 2;
      // Animation function
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);
        analyzer.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, width, height);
        // Draw the audio waves - circles expanding based on frequency
        ctx.fillStyle = 'rgba(122, 107, 172, 0.2)';
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, height / 3 * (1 + dataArray[10] / 256 * 0.5), 0, 2 * Math.PI);
        ctx.fill();
        // Draw the frequency bars
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i] / 256 * height * 0.8;
          // Gradient color based on frequency
          const hue = i / bufferLength * 220 + 180;
          ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.5)`;
          // Draw rounded bar
          ctx.beginPath();
          ctx.roundRect(x, height - barHeight, barWidth, barHeight, 5);
          ctx.fill();
          x += barWidth + barSpacing;
        }
      };
      animate();
      // Clean up
      return () => {
        cancelAnimationFrame(animationRef.current);
        if (source) {
          source.disconnect();
        }
      };
    } else {
      // Draw a simple wave when not playing
      const drawStaticWave = () => {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        ctx.strokeStyle = 'rgba(122, 107, 172, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        // Draw a gentle sine wave
        for (let x = 0; x < width; x++) {
          const y = Math.sin(x * 0.02) * 10 + height / 2;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      };
      drawStaticWave();
      // Redraw on resize
      const handleResize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drawStaticWave();
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [audioId, isPlaying]);
  return <Canvas ref={canvasRef} />;
};
const Canvas = styled.canvas`
  width: 100%;
  height: 80px;
  border-radius: 10px;
  background: var(--tertiary-color);
`;
export default AudioVisualizer;
