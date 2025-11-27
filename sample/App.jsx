import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import GlobalStyles from "./styles/GlobalStyles";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import MeditationLibrary from "./pages/MeditationLibrary";
import MeditationPlayer from "./pages/MeditationPlayer";
import Resources from "./pages/Resources";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import About from "./pages/About";
import AdminDashboardMain from "./pages/AdminDashboardMain";
import AdminLogin from "./pages/AdminLogin";
import ContentEditor from "./pages/ContentEditor";
import CursorEffect from "./components/CursorEffect";
import ScrollToTop from "./components/ScrollToTop";
import PageTransition from "./components/PageTransition";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

// Admin-only AuthProvider wrapper - only provides auth context for admin routes
const AdminAuthWrapper = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

// AnimatePresence wrapper needs to be inside the Router context
// but we also need access to location, so we create a separate component
const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin' || location.pathname.startsWith('/admin/');

  // Cleanup effect to ensure custom cursor class is removed
  React.useEffect(() => {
    return () => {
      // Remove custom cursor class when app unmounts
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  return (
    <>
      <GlobalStyles />
      {!isAdminPage && <CursorEffect />}
      <ScrollToTop />
      <AppContainer>
        {!isAdminPage && <Navbar />}
        <MainContent>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <HomePage />
                  </PageTransition>
                }
              />
              <Route
                path="/meditate"
                element={
                  <PageTransition>
                    <MeditationLibrary />
                  </PageTransition>
                }
              />
              <Route
                path="/meditation/:id"
                element={
                  <PageTransition>
                    <MeditationPlayer />
                  </PageTransition>
                }
              />
              <Route
                path="/resources"
                element={
                  <PageTransition>
                    <Resources />
                  </PageTransition>
                }
              />
              <Route
                path="/resources/:id"
                element={
                  <PageTransition>
                    <ResourceDetailPage />
                  </PageTransition>
                }
              />
              <Route
                path="/about"
                element={
                  <PageTransition>
                    <About />
                  </PageTransition>
                }
              />

              {/* Admin Routes - Single AdminAuthWrapper for all admin routes */}
              <Route path="/admin/*" element={
                <AdminAuthWrapper>
                  <Routes>
                    <Route
                      path="login"
                      element={
                        <PageTransition>
                          <AdminLogin />
                        </PageTransition>
                      }
                    />
                    <Route
                      path="dashboard"
                      element={
                        <ProtectedRoute>
                          <AdminDashboardMain />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path=""
                      element={<Navigate to="/admin/dashboard" replace />}
                    />
                    <Route
                      path="create"
                      element={
                        <ProtectedRoute requiredPermission="posts.create">
                          <PageTransition>
                            <ContentEditor />
                          </PageTransition>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="edit/:id"
                      element={
                        <ProtectedRoute requiredPermission="posts.update">
                          <PageTransition>
                            <ContentEditor />
                          </PageTransition>
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </AdminAuthWrapper>
              } />
            </Routes>
          </AnimatePresence>
        </MainContent>
        {!isAdminPage && <Footer />}
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
export default App;
