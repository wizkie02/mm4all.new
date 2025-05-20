import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`  :root {
    --primary-color: #A19BE8;  /* Main lavender purple */
    --primary-color-rgb: 161, 155, 232;
    --secondary-color: #A19FBE; /* Muted lavender for accents */
    --tertiary-color: #F0EFFC; /* Very light lavender for backgrounds */
    --lavender: #A19BE8; /* Main lavender purple */
    --lavender-light: #C5C1F2; /* Lighter lavender */
    --lavender-dark: #777593; /* Darker lavender */
    --lavender-darker: #444269; /* Even darker lavender for depth */
    --lavender-deepest: #1F1D3E; /* Very deep lavender for contrasts */
    --lavender-night: #120F33; /* Darkest lavender for night mode or strong contrast */
    --lavender-rgb: 161, 155, 232;
    --text-dark: #000000;
    --text-light: #333333;
    --background-light: #FFFFFF;
    --background-dark: #F5F3FF;    --white: #FFFFFF;
    --black: #000000;
    --transition: all 0.15s ease;
    --shadow: 0 5px 15px rgba(161, 155, 232, 0.15);
    --border-radius: 12px;
    
    /* Gradient variables */
    --gradient-primary: linear-gradient(135deg, var(--lavender) 0%, var(--lavender-dark) 100%);
    --gradient-deep: linear-gradient(135deg, var(--lavender-dark) 0%, var(--lavender-darker) 100%);
    --gradient-night: linear-gradient(135deg, var(--lavender-darker) 0%, var(--lavender-night) 100%);
    --gradient-light: linear-gradient(135deg, rgba(161, 155, 232, 0.1) 0%, rgba(119, 117, 147, 0.1) 100%);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }  body {
    font-family: 'Noto Sans', 'Roboto', sans-serif;
    color: var(--text-dark);
    background-color: var(--background-light);
    line-height: 1.6;
    min-height: 100vh;
    overflow-x: hidden;
    cursor: none; /* Hide default cursor when using custom cursor */
  }
  
  /* Hide default cursor on clickable elements */
  a, button, input[type="submit"], input[type="button"], .hover-effect {
    cursor: none;
  }

  h1, h2, h3, h4, h5 {
    font-family: 'Roboto', sans-serif;
    margin-bottom: 1rem;
    font-weight: 700;
    line-height: 1.2;
    color: var(--text-dark);
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.5rem;
  }
  p {
    margin-bottom: 1rem;
    color: var(--text-light);
    line-height: 1.7;
    font-size: 1rem;
  }  a {
    text-decoration: none;
    color: var(--primary-color);
    transition: var(--transition);
    position: relative;
    
    &:hover {
      color: var(--lavender-dark);
      transform: translateY(-2px);
    }
  }

  button {
    cursor: none;
    font-family: 'Noto Sans', sans-serif;
    border: none;
    transition: var(--transition);
    outline: none;
  }
  
  /* Custom Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 10px;
    background-color: var(--background-light);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 10px;
    transition: var(--transition);
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: var(--secondary-color);
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
  section {
    padding: 4rem 0;
    position: relative;
  }

  .container {
    width: 90%;
    max-width: 1300px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  /* For smooth scrolling */
  html {
    scroll-behavior: smooth;
  }
  
  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: var(--background-light);
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: var(--secondary-color);
  }

  /* Responsive Typography */
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
    
    h2 {
      font-size: 1.6rem;
    }
    
    h3 {
      font-size: 1.3rem;
    }
    
    p {
      font-size: 0.95rem;
    }
    
    section {
      padding: 2rem 0;
    }
    
    body {
      cursor: auto; /* Enable regular cursor on mobile */
    }
    
    a, button, input[type="submit"], input[type="button"], .hover-effect {
      cursor: pointer; /* Enable regular cursor on mobile for interactive elements */
    }
  }
    /* Animation Utilities */
  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  .slide-up {
    animation: slideUp 0.25s ease-in-out;
  }
  
  .pulse {
    animation: pulse 1.5s infinite;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  /* Glassmorphism Utility Class */  .glass-effect {
    background: rgba(160, 155, 231, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--border-radius);
    box-shadow: 0 8px 32px rgba(160, 155, 231, 0.1);
  }
`;

export default GlobalStyles;
