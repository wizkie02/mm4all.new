import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import BackgroundEffect from "../components/BackgroundEffect";

import heroImg from "../assets/contact-hero.png";

const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formState.name || !formState.email || !formState.message) {
      setFormStatus({
        submitted: true,
        success: false,
        message: "Please fill out all required fields.",
      });
      return;
    }

    // Simulate form submission
    setFormStatus({
      submitted: true,
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    });

    // Reset form (would normally happen after a successful API call)
    setFormState({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <ContactContainer>
      <PageHeader>
        <HeaderContent>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We'd love to hear from you! Whether you have a question, feedback,
            or just want to say hello.
          </motion.p>
        </HeaderContent>
      </PageHeader>

      <ContentSection>
        <ContactWrapper>
          <ContactImage src={heroImg} alt="Contact Hero" />

          <ContactForm onSubmit={handleSubmit}>
            <FormTitle>Send a Message</FormTitle>

            {formStatus.submitted && (
              <FormMessage success={formStatus.success}>
                {formStatus.message}
              </FormMessage>
            )}

            <FormRow>
              <FormGroup>
                <FormLabel htmlFor="name">Name *</FormLabel>
                <FormInput
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="email">Email *</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <FormLabel htmlFor="subject">Subject</FormLabel>
              <FormInput
                type="text"
                id="subject"
                name="subject"
                value={formState.subject}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="message">Message *</FormLabel>
              <FormTextarea
                id="message"
                name="message"
                rows="5"
                value={formState.message}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <SubmitButton
              type="submit"
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send Message
            </SubmitButton>
          </ContactForm>
        </ContactWrapper>
      </ContentSection>
    </ContactContainer>
  );
};

// Styled Components
const ContactContainer = styled.div`
  min-height: 100vh;
  position: relative;
`;

const PageHeader = styled.div`
  background-color: var(--primary-color);
  color: white;
  padding: 4rem 0;
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
  padding: 4rem 2rem;
`;

const ContactWrapper = styled.div`
  display: flex;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow: hidden;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const ContactImage = styled.img`
  flex: 1;
  object-fit: cover;
  width: 40%;
  height: 100%;
  max-height: 100%;
  border-radius: var(--border-radius);
  @media (max-width: 1024px) {
    display: none;
  }
`;

const ContactInfo = styled.div`
  flex: 1;
  padding: 3rem;
  background: var(--primary-color);
  color: white;
`;

const InfoTitle = styled.h2`
  color: white;
  margin-bottom: 1.5rem;
`;

const InfoText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
`;

const ContactDetail = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const ContactIcon = styled.div`
  margin-right: 1rem;
  margin-top: 3px;
`;

const ContactLabel = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const ContactValue = styled.div`
  color: rgba(255, 255, 255, 0.9);
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transition: var(--transition);

  &:hover {
    background: white;
    color: var(--primary-color);
    transform: translateY(-3px);
  }
`;

const ContactForm = styled.form`
  flex: 1.5;
  padding: 3rem;
`;

const FormTitle = styled.h2`
  margin-bottom: 2rem;
`;

const FormMessage = styled.div`
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: var(--border-radius);
  background: ${(props) =>
    props.success ? "rgba(109, 152, 134, 0.1)" : "rgba(220, 53, 69, 0.1)"};
  color: ${(props) => (props.success ? "var(--accent-color)" : "#dc3545")};
  border-left: 4px solid
    ${(props) => (props.success ? "var(--accent-color)" : "#dc3545")};
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: var(--border-radius);
  transition: var(--transition);

  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(122, 107, 172, 0.2);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: var(--border-radius);
  transition: var(--transition);
  resize: vertical;

  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(122, 107, 172, 0.2);
  }
`;

const SubmitButton = styled.button`
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1rem;
  transition: var(--transition);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const FAQSection = styled.div`
  text-align: center;
  padding: 2rem 0 0;
`;

const SectionTitle = styled.h2`
  margin-bottom: 2.5rem;
  position: relative;
  display: inline-block;

  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 25%;
    width: 50%;
    height: 3px;
    background: var(--gradient-primary);
    border-radius: 3px;
  }
`;

const FAQGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FAQItem = styled.div`
  text-align: left;
  background: white;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
`;

const FAQQuestion = styled.h3`
  margin-bottom: 1rem;
  color: var(--primary-color);
`;

const FAQAnswer = styled.p`
  color: var(--text-light);
  line-height: 1.6;
`;

const SupportLink = styled.a`
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-weight: 500;
  box-shadow: var(--shadow);
  transition: var(--transition);

  &:hover {
    background: var(--accent-color);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

export default Contact;
