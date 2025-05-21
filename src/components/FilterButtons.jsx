import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FilterButtons = ({ activeFilter, setActiveFilter, categories }) => {
  return (
    <FilterContainer>
      {categories.map((category, index) => (
        <FilterButton
          key={category.value}
          isActive={activeFilter === category.value}
          onClick={() => setActiveFilter(category.value)}          whileHover={{ 
            scale: 1.05, 
            boxShadow: '0 5px 15px rgba(160, 155, 231, 0.2)'
          }}
          whileTap={{ scale: 0.95 }}
          custom={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}          transition={{ 
            duration: 0.3, 
            delay: index * 0.08,
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
        >
          {activeFilter === category.value && (            <ActiveIndicator 
              layoutId="activeFilterIndicator"
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30, duration: 0.4 }}
            />
          )}
          <ButtonText isActive={activeFilter === category.value}>
            {category.label}
          </ButtonText>
        </FilterButton>
      ))}
    </FilterContainer>
  );
};

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
`;

const FilterButton = styled(motion.button)`
  background-color: ${props => props.isActive 
    ? 'rgba(255, 255, 255, 0.9)' 
    : 'rgba(255, 255, 255, 0.5)'};
  color: ${props => props.isActive ? 'var(--lavender-dark)' : 'var(--text-dark)'};
  padding: 0.7rem 1.8rem;
  border-radius: 30px;
  font-weight: ${props => props.isActive ? '600' : '500'};
  font-size: 0.95rem;
  border: 1px solid ${props => props.isActive ? 'rgba(161, 155, 232, 0.3)' : 'transparent'};
  box-shadow: ${props => props.isActive 
    ? '0 4px 12px rgba(68, 66, 105, 0.15)' 
    : '0 2px 8px rgba(119, 117, 147, 0.1)'};
  backdrop-filter: blur(5px);
  ;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background-color: ${props => props.isActive 
      ? 'rgba(255, 255, 255, 0.95)' 
      : 'rgba(255, 255, 255, 0.7)'};
    box-shadow: ${props => props.isActive 
      ? '0 6px 15px rgba(68, 66, 105, 0.2)' 
      : '0 4px 10px rgba(119, 117, 147, 0.15)'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: ${props => props.isActive 
      ? '0 2px 8px rgba(68, 66, 105, 0.1)' 
      : '0 1px 5px rgba(119, 117, 147, 0.1)'};
  }
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(161, 155, 232, 0.15) 0%, 
    rgba(68, 66, 105, 0.2) 100%);
  border-radius: 30px;
  z-index: 0;
`;

const ButtonText = styled.span`
  position: relative;
  z-index: 1;
  font-weight: ${props => props.isActive ? '600' : '500'};
  background: ${props => props.isActive 
    ? 'linear-gradient(135deg, var(--primary-color) 0%, var(--lavender-darker) 100%)' 
    : 'transparent'};
  -webkit-background-clip: ${props => props.isActive ? 'text' : 'none'};
  -webkit-text-fill-color: ${props => props.isActive ? 'transparent' : 'inherit'};
  background-clip: ${props => props.isActive ? 'text' : 'none'};
`;

export default FilterButtons;
