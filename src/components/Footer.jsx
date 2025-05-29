import React, { useState } from "react";
import styled from "styled-components";
import {
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaFacebookF,
} from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import logo from "../assets/mm_stacked.png";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (email.trim() !== "") {
    try {
      // Gửi dữ liệu email tới webhook
      await fetch("https://hook.eu2.make.com/qa5b4ub9lxpzjlw43l7otdi66gw8rjck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      setSubscribed(true);
      setEmail("");

      // Reset sau 3 giây
      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    } catch (error) {
      console.error("Error subscribing:", error);
    }
  }
};

  return (
    <FooterContainer>
      <FooterContent>
        <LeftGroup>
          <LogoSection>
            <Logo src={logo} alt="Meditation and Mindfulness 4 All" />
          </LogoSection>          <EmailSignup>
            <h3>Stay Connected</h3>
            <p>Join our newsletter for mindfulness tips and updates</p>
            <FormContainer onSubmit={handleSubmit}>
              <EmailInput
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <SubscribeButton type="submit">
                {subscribed ? "Subscribed!" : "Subscribe"}
              </SubscribeButton>
            </FormContainer>
            {subscribed && (
              <SuccessMessage>
                ✅ Thank you for subscribing! You'll receive mindfulness tips and updates in your inbox.
              </SuccessMessage>
            )}
          </EmailSignup>
        </LeftGroup>

        <RightGroup>
          {/* <ContactSection>
            <h3>Contact Us</h3>
            <ContactInfo>
              <p>No 2, Alley 337, Dinh Cong Street, Hanoi, Vietnam</p>
              <p>
                Email:{" "}
                <ContactLink href="mailto:info@mm4all.com">
                  info@mm4all.com
                </ContactLink>
              </p>
              <p>
                Phone:{" "}
                <ContactLink href="tel:+6581095789">+65 8109 5789</ContactLink>
              </p>
            </ContactInfo>
          </ContactSection> */}

          <SocialSection>
            <h3>Connect</h3>
            <SocialIcons>
              <SocialLink
                href="https://www.youtube.com/@Meditationandmindfulness-4all"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <FaYoutube />
              </SocialLink>
              <SocialLink
                href="https://www.instagram.com/meditation4all._/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </SocialLink>
              <SocialLink
                href="https://www.facebook.com/profile.php?id=61576010463402"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </SocialLink>
              <SocialLink
                href="https://www.tiktok.com/@meditation4all._"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <FaTiktok />
              </SocialLink>
              <SocialLink
                href="https://www.linkedin.com/company/mm4all/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </SocialLink>
            </SocialIcons>
          </SocialSection>
        </RightGroup>
      </FooterContent>
      <FooterNote>
        <p>
          © {new Date().getFullYear()} Meditation and Mindfulness 4 All. All
          rights reserved.
        </p>
      </FooterNote>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: var(--lavender-darker);
  padding: 3rem 0 0;
  color: var(--white);
  box-shadow: inset 0 5px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M60,60 C51.7157288,60 45,53.2842712 45,45 C45,36.7157288 51.7157288,30 60,30 C68.2842712,30 75,36.7157288 75,45 C75,53.2842712 68.2842712,60 60,60 Z M60,55 C65.5228475,55 70,50.5228475 70,45 C70,39.4771525 65.5228475,35 60,35 C54.4771525,35 50,39.4771525 50,45 C50,50.5228475 54.4771525,55 60,55 Z' fill='rgba(255,255,255,0.06)'/%3E%3Cpath d='M30,90 C21.7157288,90 15,83.2842712 15,75 C15,66.7157288 21.7157288,60 30,60 C38.2842712,60 45,66.7157288 45,75 C45,83.2842712 38.2842712,90 30,90 Z M30,85 C35.5228475,85 40,80.5228475 40,75 C40,69.4771525 35.5228475,65 30,65 C24.4771525,65 20,69.4771525 20,75 C20,80.5228475 24.4771525,85 30,85 Z' fill='rgba(255,255,255,0.04)'/%3E%3Cpath d='M90,90 C81.7157288,90 75,83.2842712 75,75 C75,66.7157288 81.7157288,60 90,60 C98.2842712,60 105,66.7157288 105,75 C105,83.2842712 98.2842712,90 90,90 Z M90,85 C95.5228475,85 100,80.5228475 100,75 C100,69.4771525 95.5228475,65 90,65 C84.4771525,65 80,69.4771525 80,75 C80,80.5228475 84.4771525,85 90,85 Z' fill='rgba(255,255,255,0.04)'/%3E%3Cpath d='M10,30 C4.4771525,30 0,25.5228475 0,20 C0,14.4771525 4.4771525,10 10,10 C15.5228475,10 20,14.4771525 20,20 C20,25.5228475 15.5228475,30 10,30 Z M10,25 C12.7614237,25 15,22.7614237 15,20 C15,17.2385763 12.7614237,15 10,15 C7.23857625,15 5,17.2385763 5,20 C5,22.7614237 7.23857625,25 10,25 Z' fill='rgba(255,255,255,0.03)'/%3E%3Cpath d='M110,30 C104.477153,30 100,25.5228475 100,20 C100,14.4771525 104.477153,10 110,10 C115.522847,10 120,14.4771525 120,20 C120,25.5228475 115.522847,30 110,30 Z M110,25 C112.761424,25 115,22.7614237 115,20 C115,17.2385763 112.761424,15 110,15 C107.238576,15 105,17.2385763 105,20 C105,22.7614237 107.238576,25 110,25 Z' fill='rgba(255,255,255,0.03)'/%3E%3Cpath d='M45,15 C42.790861,15 41,13.209139 41,11 C41,8.790861 42.790861,7 45,7 C47.209139,7 49,8.790861 49,11 C49,13.209139 47.209139,15 45,15 Z' fill='rgba(255,255,255,0.05)'/%3E%3Cpath d='M75,15 C72.790861,15 71,13.209139 71,11 C71,8.790861 72.790861,7 75,7 C77.209139,7 79,8.790861 79,11 C79,13.209139 77.209139,15 75,15 Z' fill='rgba(255,255,255,0.05)'/%3E%3Cpath d='M20,50 C17.790861,50 16,48.209139 16,46 C16,43.790861 17.790861,42 20,42 C22.209139,42 24,43.790861 24,46 C24,48.209139 22.209139,50 20,50 Z' fill='rgba(255,255,255,0.05)'/%3E%3Cpath d='M100,50 C97.790861,50 96,48.209139 96,46 C96,43.790861 97.790861,42 100,42 C102.209139,42 104,43.790861 104,46 C104,48.209139 102.209139,50 100,50 Z' fill='rgba(255,255,255,0.05)'/%3E%3Cpath d='M60,110 C57.790861,110 56,108.209139 56,106 C56,103.790861 57.790861,102 60,102 C62.209139,102 64,103.790861 64,106 C64,108.209139 62.209139,110 60,110 Z' fill='rgba(255,255,255,0.05)'/%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.5;
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50,30 C55.5228475,30 60,25.5228475 60,20 C60,14.4771525 55.5228475,10 50,10 C44.4771525,10 40,14.4771525 40,20 C40,25.5228475 44.4771525,30 50,30 Z M50,90 C55.5228475,90 60,85.5228475 60,80 C60,74.4771525 55.5228475,70 50,70 C44.4771525,70 40,74.4771525 40,80 C40,85.5228475 44.4771525,90 50,90 Z M20,60 C25.5228475,60 30,55.5228475 30,50 C30,44.4771525 25.5228475,40 20,40 C14.4771525,40 10,44.4771525 10,50 C10,55.5228475 14.4771525,60 20,60 Z M80,60 C85.5228475,60 90,55.5228475 90,50 C90,44.4771525 85.5228475,40 80,40 C74.4771525,40 70,44.4771525 70,50 C70,55.5228475 74.4771525,60 80,60 Z M30,30 C33.3137085,30 36,27.3137085 36,24 C36,20.6862915 33.3137085,18 30,18 C26.6862915,18 24,20.6862915 24,24 C24,27.3137085 26.6862915,30 30,30 Z M70,30 C73.3137085,30 76,27.3137085 76,24 C76,20.6862915 73.3137085,18 70,18 C66.6862915,18 64,20.6862915 64,24 C64,27.3137085 66.6862915,30 70,30 Z M30,70 C33.3137085,70 36,67.3137085 36,64 C36,60.6862915 33.3137085,58 30,58 C26.6862915,58 24,60.6862915 24,64 C24,67.3137085 26.6862915,70 30,70 Z M70,70 C73.3137085,70 76,67.3137085 76,64 C76,60.6862915 73.3137085,58 70,58 C66.6862915,58 64,60.6862915 64,64 C64,67.3137085 66.6862915,70 70,70 Z' stroke='rgba(255,255,255,0.08)' fill='none'/%3E%3C/svg%3E");
    opacity: 0.4;
    pointer-events: none;
  }
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem; /* Increased back to 2rem for consistent spacing */
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(197, 193, 242, 0.3);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftGroup = styled.div`
  display: flex;
  flex: 1.2;
  gap: 1rem; /* Reduced gap between logo and email signup */

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const RightGroup = styled.div`
  display: flex;
  flex: 1;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const LogoSection = styled.div`
  flex: 0.4; /* Smaller to fit closer to email signup */
  min-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 0; /* Remove padding */
`;

const EmailSignup = styled.div`
  flex: 1.6;
  min-width: 280px;

  h3 {
    margin-bottom: 0.75rem;
    color: var(--white);
    text-shadow: 0 0 5px rgba(197, 193, 242, 0.5);
  }

  p {
    margin-bottom: 1.25rem;
    color: rgba(255, 255, 255, 0.8);
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;

  @media (min-width: 768px) {
    flex-wrap: nowrap;
  }
`;

const EmailInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(197, 193, 242, 0.4);
  border-radius: 8px; /* Increased from var(--border-radius) for more rounding */
  font-family: inherit;
  transition: var(--transition);
  background-color: rgba(255, 255, 255, 0.08);
  color: var(--white);

  &:focus {
    outline: none;
    border-color: var(--lavender-light);
    box-shadow: 0 0 0 2px rgba(197, 193, 242, 0.3);
    background-color: rgba(255, 255, 255, 0.12);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const SubscribeButton = styled.button`
  background: linear-gradient(
    135deg,
    var(--lavender) 0%,
    var(--lavender-dark) 100%
  );
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px; /* Increased for more rounding */
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  position: relative;
  overflow: hidden;
  display: flex; /* Added to center text */
  align-items: center; /* Center text vertically */
  justify-content: center; /* Center text horizontally */

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(31, 29, 62, 0.3);

    &::after {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const SuccessMessage = styled.div`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: rgba(160, 155, 231, 0.2);
  border: 1px solid rgba(160, 155, 231, 0.4);
  border-radius: 8px;
  color: #A09BE7;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: slideInFromTop 0.4s ease-out;

  @keyframes slideInFromTop {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SocialSection = styled.div`
  flex: 1;
  min-width: 200px; /* Adjusted to be more consistent */

  h3 {
    margin-bottom: 1rem;
    color: var(--white);
    text-shadow: 0 0 5px rgba(197, 193, 242, 0.5);
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--lavender-light);
  transition: all 0.2s ease;

  &:hover {
    color: var(--white);
    transform: translateY(-2px);
  }
`;

const ContactSection = styled.div`
  flex: 1;
  min-width: 220px; /* Adjusted to be more consistent */

  h3 {
    margin-bottom: 1rem;
    color: var(--white);
    text-shadow: 0 0 5px rgba(197, 193, 242, 0.5);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;

  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const ContactLink = styled.a`
  color: var(--lavender-light);
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    color: var(--white);
    text-decoration: underline;
  }
`;

const FooterNote = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 1.5rem auto 0;
  text-align: center;
  font-size: 0.9rem;
  color: #ffffff;

  p {
    color: #ffffff;
  }
`;

const Logo = styled.img`
  max-width: 110px;
  height: auto;
  margin-bottom: 1rem;
`;

export default Footer;
