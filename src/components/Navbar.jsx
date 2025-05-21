import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "../assets/mm_horizontal.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <NavContainer scrolled={isScrolled}>
      <NavWrapper>
        <LogoContainer>
          <Link to="/">
            <Logo
              src={logoImg}
              alt="MM4All Logo"
              as={motion.img}
              whileHover={{ scale: 1.05 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
                duration: 0.15,
              }}
            />
          </Link>
        </LogoContainer>
        <MobileMenuButton onClick={toggleMobileMenu}>
          <HamburgerIcon open={isMobileMenuOpen}>
            <span></span>
            <span></span>
            <span></span>
          </HamburgerIcon>
        </MobileMenuButton>
        <NavLinks isOpen={isMobileMenuOpen}>
          <NavItem>
            <NavLink
              to="/"
              active={location.pathname === "/" ? "true" : "false"}
            >
              <motion.div
                whileHover={{ y: -2 }}
                animate={{
                  color:
                    location.pathname === "/"
                      ? "var(--lavender-dark)"
                      : "var(--text-dark)",
                  fontWeight: location.pathname === "/" ? "700" : "500",
                  letterSpacing: location.pathname === "/" ? "0.02em" : "0",
                }}
                transition={{ duration: 0.3 }}
              >
                Home
              </motion.div>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/meditate"
              active={location.pathname === "/meditate" ? "true" : "false"}
            >
              <motion.div
                whileHover={{ y: -2 }}
                animate={{
                  color:
                    location.pathname === "/meditate"
                      ? "var(--lavender-dark)"
                      : "var(--text-dark)",
                  fontWeight: location.pathname === "/meditate" ? "700" : "500",
                  letterSpacing:
                    location.pathname === "/meditate" ? "0.02em" : "0",
                }}
                transition={{ duration: 0.3 }}
              >
                Meditate
              </motion.div>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/sleep-sounds"
              active={location.pathname === "/sleep-sounds" ? "true" : "false"}
            >
              <motion.div
                whileHover={{ y: -2 }}
                animate={{
                  color:
                    location.pathname === "/sleep-sounds"
                      ? "var(--lavender-dark)"
                      : "var(--text-dark)",
                  fontWeight:
                    location.pathname === "/sleep-sounds" ? "700" : "500",
                  letterSpacing:
                    location.pathname === "/sleep-sounds" ? "0.02em" : "0",
                }}
                transition={{ duration: 0.3 }}
              >
                Sleep Sounds
              </motion.div>
            </NavLink>
          </NavItem>
          <NavItem>
            <ExternalNavLink
              href="https://shop.mm4all.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div
                whileHover={{ y: -2 }}
                animate={{
                  color:
                    location.pathname === "/shop"
                      ? "var(--lavender-dark)"
                      : "var(--text-dark)",
                  fontWeight: location.pathname === "/shop" ? "700" : "500",
                  letterSpacing: location.pathname === "/shop" ? "0.02em" : "0",
                }}
                transition={{ duration: 0.3 }}
              >
                Shop
              </motion.div>
            </ExternalNavLink>
          </NavItem>{" "}
          <NavItem>
            {" "}
            <NavLink
              to="/resources"
              active={location.pathname === "/resources" ? "true" : "false"}
            >
              {" "}
              <motion.div
                whileHover={{ y: -2 }}
                animate={{
                  color:
                    location.pathname === "/resources"
                      ? "var(--lavender-dark)"
                      : "var(--text-dark)",
                  fontWeight:
                    location.pathname === "/resources" ? "700" : "500",
                  letterSpacing:
                    location.pathname === "/resources" ? "0.02em" : "0",
                }}
                transition={{ duration: 0.3 }}
              >
                Resources
              </motion.div>
            </NavLink>
          </NavItem>{" "}
          <NavItem>
            {" "}
            <NavLink
              to="/about"
              active={location.pathname === "/about" ? "true" : "false"}
            >
              {" "}
              <motion.div
                whileHover={{ y: -2 }}
                animate={{
                  color:
                    location.pathname === "/about"
                      ? "var(--lavender-dark)"
                      : "var(--text-dark)",
                  fontWeight: location.pathname === "/about" ? "700" : "500",
                  letterSpacing:
                    location.pathname === "/about" ? "0.02em" : "0",
                }}
                transition={{ duration: 0.3 }}
              >
                About
              </motion.div>
            </NavLink>
          </NavItem>{" "}
          <NavItem>
            {" "}
            <NavLink
              to="/contact"
              active={location.pathname === "/contact" ? "true" : "false"}
            >
              {" "}
              <motion.div
                whileHover={{ y: -2 }}
                animate={{
                  color:
                    location.pathname === "/contact"
                      ? "var(--lavender-dark)"
                      : "var(--text-dark)",
                  fontWeight: location.pathname === "/contact" ? "700" : "500",
                  letterSpacing:
                    location.pathname === "/contact" ? "0.02em" : "0",
                }}
                transition={{ duration: 0.3 }}
              >
                Contact
              </motion.div>
            </NavLink>
          </NavItem>
        </NavLinks>
      </NavWrapper>
    </NavContainer>
  );
};

const NavContainer = styled.nav`
  background-color: rgba(245, 243, 255, 0.9);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 1rem 0;
  backdrop-filter: blur(5px);
`;

const NavWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
`;

const LogoContainer = styled.div`
  padding: 0.5rem 0;
`;

const Logo = styled.img`
  height: 50px;
  width: auto;
  transition: var(--transition);

  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;

  @media (max-width: 768px) {
    position: fixed;
    top: 80px;
    left: ${(props) => (props.isOpen ? "0" : "-100%")};
    flex-direction: column;
    width: 100%;
    height: calc(100vh - 80px);
    background-color: var(--white);
    padding: 2rem;
    transition: left 0.3s ease;
    z-index: 99;
    box-shadow: var(--shadow);
  }
`;

const ExternalNavLink = styled.a`
  color: var(--text-dark);
  font-weight: 500;
  font-size: 1.1rem;
  position: relative;
  padding: 0.5rem 0;
  text-decoration: none;
  display: block;
  ;
  transition: var(--transition);

  /* You might want to apply the same hover/active styles as NavLink if desired */
  &:hover {
    transform: translateY(-2px); /* Example hover effect */
  }
`;

const NavItem = styled.li``;

const NavLink = styled(Link)`
  color: var(--text-dark);
  font-weight: 500;
  font-size: 1.1rem;
  position: relative;
  padding: 0.5rem 0;
  text-decoration: none;
  display: block;
  ;
  transition: var(--transition);

  /* Add subtle scaling effect when active */
  &[active="true"] {
    transform: scale(1.02);
    text-shadow: 0 0 1px rgba(68, 66, 105, 0.3);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;

  @media (max-width: 768px) {
    display: block;
    z-index: 100;
  }
`;

const HamburgerIcon = styled.div`
  width: 30px;
  height: 25px;
  position: relative;

  span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: var(--lavender-darker);
    border-radius: 3px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;

    &:nth-child(1) {
      top: ${(props) => (props.open ? "10px" : "0px")};
      transform: ${(props) => (props.open ? "rotate(135deg)" : "rotate(0)")};
    }

    &:nth-child(2) {
      top: 10px;
      opacity: ${(props) => (props.open ? "0" : "1")};
    }

    &:nth-child(3) {
      top: ${(props) => (props.open ? "10px" : "20px")};
      transform: ${(props) => (props.open ? "rotate(-135deg)" : "rotate(0)")};
    }
  }
`;

export default Navbar;
