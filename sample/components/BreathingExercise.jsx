import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
const BreathingExercise = () => {
  const [breathState, setBreathState] = useState("idle");
  const [countdown, setCountdown] = useState(3);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  useEffect(() => {
    let interval;
    if (isExerciseActive) {
      // Start countdown
      setCountdown(3);
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            startBreathingCycle();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathState("idle");
    }
    return () => {
      clearInterval(interval);
    };
  }, [isExerciseActive]);
  const startBreathingCycle = () => {
    breathingLoop();
  };
  const breathingLoop = () => {
    // Breathing cycle: inhale (4s) -> hold (7s) -> exhale (8s)
    setBreathState("inhale");
    const inhaleTimeout = setTimeout(() => {
      setBreathState("hold");
      const holdTimeout = setTimeout(() => {
        setBreathState("exhale");
        const exhaleTimeout = setTimeout(() => {
          if (isExerciseActive) {
            breathingLoop();
          } else {
            setBreathState("idle");
          }
        }, 8000); // Exhale for 8 seconds
        return () => clearTimeout(exhaleTimeout);
      }, 7000); // Hold for 7 seconds
      return () => clearTimeout(holdTimeout);
    }, 4000); // Inhale for 4 seconds
    return () => clearTimeout(inhaleTimeout);
  };
  const toggleExercise = () => {
    setIsExerciseActive((prev) => !prev);
  };
  // Variants for animations
  const circleVariants = {
    inhale: {
      scale: 1.5,
      transition: { duration: 4, ease: "easeInOut" },
    },
    hold: {
      scale: 1.5,
      transition: { duration: 7, ease: "linear" },
    },
    exhale: {
      scale: 1,
      transition: { duration: 8, ease: "easeInOut" },
    },
    idle: {
      scale: 1,
      transition: { duration: 1 },
    },
  };
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.15 },
    },
  };
  return (
    <BreathingContainer>
      <InstructionText>
        <AnimatePresence mode="wait">
          {countdown > 0 && isExerciseActive ? (
            <motion.p
              key="countdown"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={textVariants}
            >
              Starting in {countdown}...
            </motion.p>
          ) : (
            <motion.p
              key={breathState}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={textVariants}
            >
              <InstructionHighlight>
                {breathState === "inhale" && "Inhale slowly..."}
                {breathState === "hold" && "Hold your breath..."}
                {breathState === "exhale" && "Exhale fully..."}
                {breathState === "idle" &&
                  "Click to start a breathing exercise"}
              </InstructionHighlight>
            </motion.p>
          )}
        </AnimatePresence>
      </InstructionText>
      <BreathCircle
        animate={breathState}
        variants={circleVariants}
        onClick={toggleExercise}
      >
        <InnerCircle />
      </BreathCircle>
      <ControlButton onClick={toggleExercise}>
        {isExerciseActive ? "Stop" : "Start"} Exercise
      </ControlButton>
    </BreathingContainer>
  );
};
const BreathingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem 4rem;
  background: linear-gradient(
    135deg,
    rgba(161, 159, 190, 0.1) 0%,
    rgba(68, 66, 105, 0.15) 100%
  );
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(31, 29, 62, 0.15);
  backdrop-filter: blur(8px);
  margin: 2rem auto;
  max-width: 600px;
  position: relative;
  overflow: visible;
  min-height: 420px;
`;
const InstructionText = styled.div`
  height: 40px;
  margin-bottom: 4rem;
  text-align: center;
  font-size: 1.5rem;
  color: var(--text-light);
  font-weight: 300;
  position: relative;
  z-index: 5;
  p {
    margin: 0;
  }
`;
const InstructionHighlight = styled.span`
  background-color: rgba(255, 255, 255, 0.85);
  padding: 5px 15px;
  border-radius: 20px;
  color: var(--lavender-darker);
  font-weight: 500;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;
const BreathCircle = styled(motion.div)`
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--lavender) 0%,
    var(--lavender-darker) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  ;
  box-shadow: 0 0 30px rgba(68, 66, 105, 0.5);
  margin-bottom: 5rem;
  z-index: 2;
  &::before {
    content: "";
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 70%
    );
    z-index: -1;
    opacity: 0.8;
  }
  /* Create space for expanded circle during animation */
  @media (max-width: 600px) {
    width: 250px;
    height: 250px;
  }
`;
const InnerCircle = styled.div`
  width: 70%;
  height: 70%;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    rgba(197, 193, 242, 0.9) 0%,
    rgba(161, 155, 232, 0.5) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 20px rgba(31, 29, 62, 0.2);
`;
const ControlButton = styled.button`
  background: linear-gradient(
    135deg,
    var(--lavender) 0%,
    var(--lavender-dark) 100%
  );
  border: none;
  border-radius: 30px;
  padding: 0.8rem 2rem;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  ;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(68, 66, 105, 0.2);
  position: relative;
  z-index: 5;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.6s ease;
  }
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(31, 29, 62, 0.25);
    &::before {
      left: 100%;
    }
  }
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 8px rgba(31, 29, 62, 0.2);
  }
`;
export default BreathingExercise;
