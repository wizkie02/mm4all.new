import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";

const CursorEffect = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Refs for smooth cursor movement
  const cursorRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const cursorPosition = useRef({ x: 0, y: 0 });
  const requestRef = useRef(null);

  useEffect(() => {
    // Show cursor when mouse enters the window
    const onMouseEnter = () => setIsVisible(true);

    // Hide cursor when mouse leaves the window
    const onMouseLeave = () => setIsVisible(false);

    // Track mouse position
    const onMouseMove = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    // Handle mouse down/up events
    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    // Setup hover state for interactive elements
    const setupHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        "a, button, input, textarea, select, .hover-effect"
      );

      interactiveElements.forEach((element) => {
        element.addEventListener("mouseenter", () => setIsHovered(true));
        element.addEventListener("mouseleave", () => setIsHovered(false));
      });
    };
    // Animate cursor with breathing effect
    const animateCursor = () => {
      // Create breathing-like delayed motion
      const easeAmount = 0.25; // Increased for more responsive cursor movement

      // Calculate the distance between mouse and cursor
      const dx = mousePosition.current.x - cursorPosition.current.x;
      const dy = mousePosition.current.y - cursorPosition.current.y;

      // Update cursor position with easing
      cursorPosition.current.x += dx * easeAmount;
      cursorPosition.current.y += dy * easeAmount;

      // Apply transform to the cursor element
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPosition.current.x}px, ${cursorPosition.current.y}px, 0)`;
      }

      // Continue animation loop
      requestRef.current = requestAnimationFrame(animateCursor);
    };

    // Start animation
    requestRef.current = requestAnimationFrame(animateCursor);

    // Add all event listeners
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    // Set up hover state for interactive elements
    setupHoverListeners();

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isVisible]);
  return (
    <CursorContainer
      ref={cursorRef}
      className={`${isVisible ? "visible" : "hidden"} ${
        isClicked ? "clicked" : ""
      } ${isHovered ? "hovered" : ""}`}
    >
      <CursorInnerGlow $isClicked={isClicked} />
      <CursorGlow $isClicked={isClicked} $isHovered={isHovered} />
    </CursorContainer>
  );
};

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.58;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
`;

const CursorContainer = styled.div`
  position: fixed;
  top: -16px;
  left: -16px;
  width: 32px; /* Reduced from 35px to 90% */
  height: 32px; /* Reduced from 35px to 90% */
  pointer-events: none;
  z-index: 9999;
  transition: opacity 0.3s ease;
  will-change: transform;
  opacity: 0;
  transform: translate3d(0, 0, 0);

  &.visible {
    opacity: 1;
  }

  &.hidden {
    opacity: 0;
  }

  &.clicked .cursor-glow {
    transform: scale(0.85);
    opacity: 0.75;
  }

  &.hovered .cursor-glow {
    transform: scale(1.4);
  }
`;

const CursorGlow = styled.div.attrs({ className: "cursor-glow" })`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--lavender);
  border-radius: 50%;
  opacity: 0.55;
  transform-origin: center;
  box-shadow: 0 0 16px 3.6px var(--lavender-light),
    0 0 22.5px 9px var(--lavender-dark); /* Reduced shadow sizes to 90% */
  animation: ${pulseAnimation} 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  transition: transform 1s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1s ease;

  /* Apply scale transform based on click/hover state */
  transform: ${(props) =>
    props.isClicked
      ? "scale(0.85)"
      : props.isHovered
      ? "scale(1.4)"
      : "scale(1)"};
`;

const CursorInnerGlow = styled.div`
  position: absolute;
  top: 25%;
  left: 25%;
  width: 50%;
  height: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  opacity: 0.3;
  filter: blur(1.8px); /* Reduced blur from 2px to 1.8px (90%) */
  transition: transform 1s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1s ease;
  transform: ${(props) => (props.isClicked ? "scale(0.5)" : "scale(1)")};
`;

export default CursorEffect;
