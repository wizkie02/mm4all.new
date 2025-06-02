import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 72dvh;
  text-align: center;
  padding: 2rem;
  background-color: var(--background-color, #f4f7f6); // Fallback color
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  font-weight: bold;
  color: var(--primary-color, #7a6bac); // Fallback color
  margin-bottom: 0.5rem;
`;

const ErrorMessage = styled.h2`
  font-size: 1.75rem;
  color: var(--text-dark, #333); // Fallback color
  margin-bottom: 1rem;
`;

const ErrorDescription = styled.p`
  font-size: 1.1rem;
  color: var(--text-light, #555); // Fallback color
  margin-bottom: 2rem;
  max-width: 500px;
`;

const HomeButton = styled(Link)`
  padding: 0.8rem 1.5rem;
  background: var(--primary-color, #7a6bac); // Fallback color
  color: var(--text-dark);
  text-decoration: none;
  border-radius: var(--border-radius, 8px);
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover {
    color: var(--tertiary-color);
  }
`;

const NotFoundPage = () => {
  return (
    <NotFoundContainer>
      <ErrorCode>404</ErrorCode>
      <ErrorMessage>Oops! Page Not Found</ErrorMessage>
      <ErrorDescription>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </ErrorDescription>
      <HomeButton to="/">Go to Homepage</HomeButton>
    </NotFoundContainer>
  );
};

export default NotFoundPage;
