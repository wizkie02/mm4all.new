import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaLeaf, FaMoon, FaBrain } from "react-icons/fa";
import heroBg from "../assets/hero-background.jpg";
import improveIcon from "../assets/icon-improve-sleep.png";
import reduceIcon from "../assets/icon-reduce-stress.png";
import groundIcon from "../assets/icon-stay-grounded.png";
const HomePage = () => {
  return (
    <>
      <HeroSection>
        <HeroContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HeroTitle>Find Your Inner Peace</HeroTitle>
            <HeroSubtitle>
              Guided meditation and mindfulness practices for everyone
            </HeroSubtitle>
            <ButtonGroup>
              <PrimaryButton
                as={Link}
                to="/meditate"
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.03 }}
              >
                <span>Start Meditating</span>
              </PrimaryButton>
              <SecondaryButton
                as={Link}
                to="/about"
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.03 }}
              >
                <span>Learn More</span>
              </SecondaryButton>
            </ButtonGroup>
          </motion.div>
        </HeroContent>
      </HeroSection>
      <BenefitsSection>
        <SectionHeading>Benefits of Mindfulness</SectionHeading>
        <BenefitsContainer>
          <BenefitCard
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
          >
            <BenefitIcon>
              <FaMoon size={35} />
            </BenefitIcon>
            <BenefitTitle>Improve Sleep</BenefitTitle>
            <BenefitText>
              Fall asleep faster and enjoy deeper, more restful sleep with our
              sleep meditations.
            </BenefitText>
          </BenefitCard>
          <BenefitCard
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
          >
            <BenefitIcon>
              <FaLeaf size={35} />
            </BenefitIcon>
            <BenefitTitle>Reduce Stress</BenefitTitle>
            <BenefitText>
              Calm your mind and reduce stress with mindfulness techniques that
              work in everyday life.
            </BenefitText>
          </BenefitCard>
          <BenefitCard
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.3 }}
          >
            <BenefitIcon>
              <FaBrain size={35} />
            </BenefitIcon>
            <BenefitTitle>Stay Grounded</BenefitTitle>
            <BenefitText>
              Develop mental clarity and focus to stay present and engaged in
              your daily activities.
            </BenefitText>
          </BenefitCard>
        </BenefitsContainer>
      </BenefitsSection>
      <CtaSection>
        <CtaContent>
          <CtaTitle>Ready to Transform Your Daily Routine?</CtaTitle>
          <CtaText>
            Join the community which has discovered the benefits of regular
            mindfulness practice.
          </CtaText>{" "}
          <PrimaryButton
            as={Link}
            to="/meditate"
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.03 }}
          >
            <span>Browse Meditations</span>
          </PrimaryButton>
        </CtaContent>
      </CtaSection>
    </>
  );
};
// Styled Components
const HeroSection = styled.section`
  height: 80vh;
  min-height: 600px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url(${heroBg});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 0 1rem;
`;
const HeroContent = styled.div`
  max-width: 800px;
`;
const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;
const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2.5rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
`;
const PrimaryButton = styled(motion.button)`
  background-color: var(--primary-color);
  color: rgba(0, 0, 0, 0.5);
  padding: 0.9rem 2rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  display: inline-block;
  border: none;
  ;
  box-shadow: 0 4px 15px rgba(31, 29, 62, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at center,
      var(--lavender-light) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }
  &:hover {
    background-color: var(--lavender);
    box-shadow: 0 6px 20px rgba(161, 155, 232, 0.5);
    transform: translateY(-2px);
    color: white;
    &::after {
      opacity: 0.3;
    }
  }
  & > * {
    position: relative;
    z-index: 1;
  }
`;
const SecondaryButton = styled(motion.button)`
  background-color: transparent;
  color: white;
  padding: 0.9rem 2rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  display: inline-block;
  border: 2px solid white;
  ;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at center,
      var(--lavender-light) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }
  &:hover {
    background-color: white;
    border-color: white;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
    color: var(--lavender-light)
    &::after {
      opacity: 0.3;
    }
  }
  & > * {
    position: relative;
    z-index: 1;
  }
`;
const BenefitsSection = styled.section`
  padding: 5rem 0;
  background-color: rgba(245, 243, 255, 0.5);
  text-align: center;
`;
const SectionHeading = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  display: inline-block;
  font-size: 2.2rem;
`;
const BenefitsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;
const BenefitCard = styled(motion.div)`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2.5rem 2rem;
  box-shadow: 0 5px 15px rgba(31, 29, 62, 0.1);
  flex: 1;
  min-width: 250px;
  max-width: 350px;
  transition: var(--transition);
  &:hover {
    box-shadow: 0 8px 25px rgba(31, 29, 62, 0.15);
  }
`;
const BenefitIcon = styled.div`
  width: 70px;
  height: 70px;
  background-color: rgba(161, 159, 190, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: var(--lavender-darker);
`;
const BenefitTitle = styled.h3`
  margin-bottom: 1rem;
  font-size: 1.4rem;
`;
const BenefitText = styled.p`
  color: var(--text-light);
  font-size: 1rem;
  line-height: 1.6;
`;
const CtaSection = styled.section`
  padding: 5rem 0;
  background: linear-gradient(
    135deg,
    rgba(161, 159, 190, 0.15) 0%,
    rgba(68, 66, 105, 0.25) 100%
  );
  text-align: center;
`;
const CtaContent = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 0 1rem;
`;
const CtaTitle = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 2.2rem;
`;
const CtaText = styled.p`
  margin-bottom: 2rem;
  font-size: 1.1rem;
  color: var(--text-light);
`;
export default HomePage;
