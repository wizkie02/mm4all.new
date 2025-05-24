import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { resources } from "../data/resourcesData"; // Import centralized resources
import BackgroundEffect from "../components/BackgroundEffect";

const ResourceDetailPageContainer = styled.div`
  position: relative;
  padding-top: 2rem; /* Add some padding at the top */
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
`;

const ContentWrapper = styled(motion.div)`
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-large);
  position: relative;
  z-index: 1;
`;

const ResourceImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
`;

const ResourceTitle = styled.h1`
  color: var(--text-dark);
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
`;

const ResourceMeta = styled.div`
  display: flex;
  gap: 1rem;
  color: var(--text-light);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
`;

const ResourceCategory = styled.span`
  background-color: var(--tertiary-color);
  color: var(--primary-color);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-weight: 500;
`;

const ResourceContent = styled.div`
  color: var(--text-medium);
  line-height: 1.8;
  font-size: 1.1rem;

  p {
    margin-bottom: 1rem;
  }

  h2,
  h3 {
    color: var(--text-dark);
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 2rem;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const NotFoundMessage = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 1.5rem;
  color: var(--text-light);
`;

const ResourceDetailPage = () => {
  const { category: categoryId, id: resourceId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId, resourceId]);

  const resource = resources[categoryId]?.find((r) => r.id === resourceId);

  if (!resource) {
    return (
      <ResourceDetailPageContainer>
        <BackgroundEffect />
        <ContentWrapper>
          <NotFoundMessage>
            <h2>Resource Not Found</h2>
            <p>
              The resource you are looking for does not exist or may have been
              moved.
            </p>
            <BackLink to="/resources">← Back to Resources</BackLink>
          </NotFoundMessage>
        </ContentWrapper>
      </ResourceDetailPageContainer>
    );
  }

  return (
    <ResourceDetailPageContainer>
      <BackgroundEffect />
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BackLink
          to="/resources"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          ← Back
        </BackLink>
        <ResourceTitle>{resource.title}</ResourceTitle>
        <ResourceMeta>
          <ResourceCategory>{resource.category}</ResourceCategory>
          {resource.date && <span>📅 {resource.date}</span>}
          {resource.duration && <span>⏱️ {resource.duration}</span>}
        </ResourceMeta>
        {resource.image && (
          <ResourceImage src={resource.image} alt={resource.title} />
        )}
        <ResourceContent
          dangerouslySetInnerHTML={{
            __html: resource.fullContent || resource.excerpt,
          }}
        />
      </ContentWrapper>
    </ResourceDetailPageContainer>
  );
};

export default ResourceDetailPage;
