import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import BackgroundEffect from "../components/BackgroundEffect";

// Import images
import journeyImg from "../assets/about-journey.jpg";
import purposeImg from "../assets/about-purpose.jpg";

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
              Founded in 2025, Meditation 4 All began with a simple yet powerful
              idea: In a fast-paced world, everyone deserves a moment of
              stillness.
            </p>
            <p>
              Our founder, Dirk de Vlaam, had spent years navigating the demands
              of modern life—tight deadlines, constant notifications, and an
              overwhelming pressure to stay productive. Along the way, he
              noticed a deeper pattern: more and more people, both young and
              old, were feeling disconnected, anxious, and exhausted.
            </p>
            <p>
              Despite the growing awareness of mindfulness, most resources felt
              too complicated, too spiritual, or too time-consuming for everyday
              people.
            </p>
            <p>So he set out to change that.</p>
            <p>
              With a team of mindfulness practitioners, educators, and
              creatives, Dirk created Meditation 4 All—a space where anyone,
              regardless of experience, age, or background, could find calm
              through simple, approachable meditation.
            </p>
            <StyledMission>
              Our mission is not to teach perfection.
              <br />
              It's to offer peace—in small, honest moments.
              <br />
              No pressure. No performance.
              <br />
              Just space to breathe.
            </StyledMission>
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
            <SectionTitle>Our Mission</SectionTitle>
            <p>
              At Meditation 4 All, we believe that mindfulness should be a part
              of everyday life. Our mission is to remove the barriers that
              prevent people from experiencing the benefits of meditation.
            </p>
            <p>
              We recognize that in today's fast-paced world, finding moments of
              stillness can seem impossible. That's why we've designed our
              approach to fit seamlessly into modern life—no complicated
              techniques, no hour-long sessions, just simple practices that
              create real impact.
            </p>
            <p>
              Through accessible guidance, thoughtful resources, and supportive
              community, we're creating a world where mindfulness is available
              to anyone who seeks it.
            </p>
            <StyledMission>
              Our mission is not to teach perfection.
              <br />
              It's to offer peace—in small, honest moments.
              <br />
              No pressure. No performance.
              <br />
              Just space to breathe.
            </StyledMission>
            <p>
              This philosophy guides everything we do—from the meditations we
              create to the community we build. We're not about achieving some
              idealized state of enlightenment; we're about helping you find
              moments of clarity and calm in your daily life.
            </p>
          </TextContent>
          <ImageContainer>
            <img src={purposeImg} alt="Our mission" />
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
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-18c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8zm-5 8c0-2.76 2.24-5 5-5 .28 0 .5.22.5.5s-.22.5-.5.5c-2.21 0-4 1.79-4 4 0 .28-.22.5-.5.5s-.5-.22-.5-.5z"
                    opacity="0.9"
                  />
                </svg>
              </ValueIcon>
              <ValueTitle>Accessibility</ValueTitle>
              <ValueText>
                We believe mindfulness should be available to everyone. Our
                content is designed to be approachable for all experience levels
                and backgrounds.
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
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M16 13h-3V3h-2v10H8l4 4 4-4zM4 19v2h16v-2H4z"
                    opacity="0.9"
                  />
                </svg>
              </ValueIcon>
              <ValueTitle>Authenticity</ValueTitle>
              <ValueText>
                We honor the traditional roots of meditation while making these
                practices relevant to modern life. No pretense, just practical
                wisdom.
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
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"
                    opacity="0.9"
                  />
                </svg>
              </ValueIcon>
              <ValueTitle>Evidence-Based</ValueTitle>
              <ValueText>
                Our approach is grounded in science. We incorporate
                research-backed techniques that have been shown to reduce stress
                and improve wellbeing.
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
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"
                    opacity="0.9"
                  />
                </svg>
              </ValueIcon>
              <ValueTitle>Inclusivity</ValueTitle>
              <ValueText>
                Meditation is for everyone. We create content that respects
                diverse backgrounds, traditions, and perspectives on
                mindfulness.
              </ValueText>
            </ValueCard>
          </ValuesGrid>
        </ValuesSection>

        <TeamSection>
          <SectionTitle>Our Team</SectionTitle>
          <TeamGrid>
            <TeamCard
              as={motion.div}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <TeamAvatar>D</TeamAvatar>
              <TeamName>Dirk de Vlaam</TeamName>
              <TeamRole>Founder</TeamRole>
              <TeamBio>
                Former financial executive who found mindfulness after burnout.
                Now passionate about making meditation accessible to everyone,
                drawing on a career built on strategic thinking.
              </TeamBio>
            </TeamCard>

            <TeamCard
              as={motion.div}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <TeamAvatar>L</TeamAvatar>
              <TeamName>Dirk de Vlaam</TeamName>
              <TeamRole>CEO</TeamRole>
              <TeamBio>
                Once a financial executive facing burnout, I discovered
                mindfulness and transformed my path. Today, I combine strategic
                insight with a mission to make meditation accessible to all.
              </TeamBio>
            </TeamCard>

            <TeamCard
              as={motion.div}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <TeamAvatar>D</TeamAvatar>
              <TeamName>Dirk de Vlaam</TeamName>
              <TeamRole>AI Enthusiast</TeamRole>
              <TeamBio>
                Burnout in the corporate world led me to mindfulness—a turning
                point that reshaped my life. Now, I&apos;m committed to helping
                others access the calm and clarity I once searched for.
              </TeamBio>
            </TeamCard>

            <TeamCard
              as={motion.div}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <TeamAvatar>V</TeamAvatar>
              <TeamName>Dirk de Vlaam</TeamName>
              <TeamRole>Promptalchemist</TeamRole>
              <TeamBio>
                I used to thrive in the fast-paced world of finance—until
                burnout forced me to pause. That pause led me to mindfulness.
                Now, I&apos;m on a mission to share its benefits with as many people
                as possible.
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
  flex-direction: ${(props) => (props.reverse ? "row-reverse" : "row")};
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
    content: "";
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

const StyledMission = styled.p`
  font-style: italic;
  line-height: 1.8;
  margin-top: 1.5rem;
  padding-left: 1rem;
  border-left: 3px solid var(--lavender-light);
`;

export default About;
