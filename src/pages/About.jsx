import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import BackgroundEffect from '../components/BackgroundEffect';

// Import images
import journeyImg from '../assets/about-journey.jpg';
import purposeImg from '../assets/about-purpose.jpg';

const About = () => {
  return (
    <AboutContainer>
      <BackgroundEffect />
      
      <PageHeader>
        <HeaderContent>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About MM4All
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Making mindfulness and meditation accessible to everyone
          </motion.p>
        </HeaderContent>
      </PageHeader>
      
      <ContentSection>
        <AboutSection
          as={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <TextContent>
            <SectionTitle>Our Story</SectionTitle>
            <p>
              MM4All began in 2020 with a simple mission: to make mindfulness and meditation accessible to everyone, regardless of background or experience level.
            </p>
            <p>
              Our founder, Sarah Chen, discovered meditation after a particularly stressful period in her corporate career. The practice transformed her life, but she noticed that many resources seemed intimidating or inaccessible to beginners.
            </p>
            <p>
              Determined to change this, she assembled a team of mindfulness experts, teachers, and designers to create guided meditations and resources that anyone could use—no prior experience required.
            </p>
          </TextContent>
          <ImageContainer>
            <img src={journeyImg} alt="Our journey" />
          </ImageContainer>
        </AboutSection>
        
        <AboutSection
          reverse
          as={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <TextContent>
            <SectionTitle>Our Purpose</SectionTitle>
            <p>
              At MM4All, we believe that mindfulness is a powerful tool for personal growth, stress reduction, and overall wellbeing. We're committed to making these practices approachable and relevant to modern life.
            </p>
            <p>
              Our approach combines ancient wisdom with contemporary science, creating practices that respect tradition while meeting the unique challenges of today's fast-paced world.
            </p>
            <p>
              Every meditation, article, and product we offer is designed with one goal in mind: helping you cultivate a more mindful, balanced, and fulfilling life.
            </p>
          </TextContent>
          <ImageContainer>
            <img src={purposeImg} alt="Our purpose" />
          </ImageContainer>
        </AboutSection>
        
        <ValuesSection>
          <SectionTitle>Our Values</SectionTitle>
          <ValuesGrid>
            <ValueCard
              as={motion.div}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <ValueIcon>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-18c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8zm-5 8c0-2.76 2.24-5 5-5 .28 0 .5.22.5.5s-.22.5-.5.5c-2.21 0-4 1.79-4 4 0 .28-.22.5-.5.5s-.5-.22-.5-.5z" opacity="0.9"/>
                </svg>
              </ValueIcon>
              <ValueTitle>Accessibility</ValueTitle>
              <ValueText>
                We believe mindfulness should be available to everyone. Our content is designed to be approachable for all experience levels and backgrounds.
              </ValueText>
            </ValueCard>
            
            <ValueCard
              as={motion.div}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <ValueIcon>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 13h-3V3h-2v10H8l4 4 4-4zM4 19v2h16v-2H4z" opacity="0.9"/>
                </svg>
              </ValueIcon>
              <ValueTitle>Authenticity</ValueTitle>
              <ValueText>
                We honor the traditional roots of meditation while making these practices relevant to modern life. No pretense, just practical wisdom.
              </ValueText>
            </ValueCard>
            
            <ValueCard
              as={motion.div}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <ValueIcon>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z" opacity="0.9"/>
                </svg>
              </ValueIcon>
              <ValueTitle>Evidence-Based</ValueTitle>
              <ValueText>
                Our approach is grounded in science. We incorporate research-backed techniques that have been shown to reduce stress and improve wellbeing.
              </ValueText>
            </ValueCard>
            
            <ValueCard
              as={motion.div}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <ValueIcon>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" opacity="0.9"/>
                </svg>
              </ValueIcon>
              <ValueTitle>Inclusivity</ValueTitle>
              <ValueText>
                Meditation is for everyone. We create content that respects diverse backgrounds, traditions, and perspectives on mindfulness.
              </ValueText>
            </ValueCard>
          </ValuesGrid>
        </ValuesSection>
        
        <TeamSection>
          <SectionTitle>Our Team</SectionTitle>
          <TeamGrid>
            <TeamCard
              as={motion.div}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <TeamAvatar>SC</TeamAvatar>
              <TeamName>Sarah Chen</TeamName>
              <TeamRole>Founder & CEO</TeamRole>
              <TeamBio>
                Former tech executive who discovered meditation after burnout. Now dedicated to making mindfulness accessible to all.
              </TeamBio>
            </TeamCard>
            
            <TeamCard
              as={motion.div}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <TeamAvatar>MR</TeamAvatar>
              <TeamName>Michael Reynolds</TeamName>
              <TeamRole>Head of Content</TeamRole>
              <TeamBio>
                Meditation teacher with 15 years of experience. Studied mindfulness practices across Asia before joining MM4All.
              </TeamBio>
            </TeamCard>
            
            <TeamCard
              as={motion.div}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <TeamAvatar>JP</TeamAvatar>
              <TeamName>Dr. Jasmine Patel</TeamName>
              <TeamRole>Wellness Advisor</TeamRole>
              <TeamBio>
                Clinical psychologist specializing in mindfulness-based therapies. Ensures our content is scientifically sound.
              </TeamBio>
            </TeamCard>
            
            <TeamCard
              as={motion.div}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <TeamAvatar>AK</TeamAvatar>
              <TeamName>Alex Kim</TeamName>
              <TeamRole>Lead Designer</TeamRole>
              <TeamBio>
                Passionate about creating calming digital experiences. Believes good design can enhance the mindfulness journey.
              </TeamBio>
            </TeamCard>
          </TeamGrid>
        </TeamSection>
      </ContentSection>
    </AboutContainer>
  );
};

// Styled Components
const AboutContainer = styled.div`
  min-height: 100vh;
`;

const PageHeader = styled.div`
  background-color: var(--primary-color);
  color: white;
  padding: 4rem 0;
  margin-bottom: 3rem;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 0 1rem;
  
  h1 {
    color: white;
    margin-bottom: 1rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.2rem;
    max-width: 700px;
    margin: 0 auto;
  }
`;

const ContentSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 4rem;
`;

const AboutSection = styled.div`
  display: flex;
  flex-direction: ${props => props.reverse ? 'row-reverse' : 'row'};
  gap: 4rem;
  margin-bottom: 6rem;
  align-items: center;
  
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const TextContent = styled.div`
  flex: 1;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 3px;
    background: var(--gradient-primary);
    border-radius: 3px;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  
  img {
    width: 100%;
    display: block;
    height: auto;
  }
`;

const ValuesSection = styled.div`
  margin-bottom: 6rem;
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const ValueCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
`;

const ValueIcon = styled.div`
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const ValueTitle = styled.h3`
  margin-bottom: 1rem;
`;

const ValueText = styled.p`
  color: var(--text-light);
  font-size: 0.95rem;
`;

const TeamSection = styled.div`
  margin-bottom: 4rem;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const TeamCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
`;

const TeamAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1.5rem;
`;

const TeamName = styled.h3`
  margin-bottom: 0.5rem;
`;

const TeamRole = styled.div`
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 1rem;
`;

const TeamBio = styled.p`
  color: var(--text-light);
  font-size: 0.9rem;
`;

export default About;
