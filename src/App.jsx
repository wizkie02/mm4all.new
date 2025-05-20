import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import GlobalStyles from './styles/GlobalStyles';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MeditationLibrary from './pages/MeditationLibrary';
import MeditationPlayer from './pages/MeditationPlayer';
import SleepSounds from './pages/SleepSounds';
import Shop from './pages/Shop';
import Resources from './pages/Resources';
import About from './pages/About';
import Contact from './pages/Contact';
import CursorEffect from './components/CursorEffect';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';

// AnimatePresence wrapper needs to be inside the Router context
// but we also need access to location, so we create a separate component
const AppContent = () => {
  const location = useLocation();
  
  return (
    <>
      <GlobalStyles />
      <CursorEffect />
      <ScrollToTop />
      <AppContainer>
        <Navbar />
        <MainContent>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              } />
              <Route path="/meditate" element={
                <PageTransition>
                  <MeditationLibrary />
                </PageTransition>
              } />
              <Route path="/meditation/:id" element={
                <PageTransition>
                  <MeditationPlayer />
                </PageTransition>
              } />
              <Route path="/sleep-sounds" element={
                <PageTransition>
                  <SleepSounds />
                </PageTransition>
              } />
              <Route path="/shop" element={
                <PageTransition>
                  <Shop />
                </PageTransition>
              } />
              <Route path="/resources" element={
                <PageTransition>
                  <Resources />
                </PageTransition>
              } />
              <Route path="/about" element={
                <PageTransition>
                  <About />
                </PageTransition>
              } />
              <Route path="/contact" element={
                <PageTransition>
                  <Contact />
                </PageTransition>
              } />
            </Routes>
          </AnimatePresence>
        </MainContent>
        <Footer />
      </AppContainer>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// Styled components
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
`;

const PagePlaceholder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  font-size: 2rem;
  color: var(--primary-color);
  background-color: var(--background-light);
`;

export default App
