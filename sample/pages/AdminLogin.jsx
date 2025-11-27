import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import logoImg from '../assets/mm_horizontal.png';
const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password, formData.rememberMe);
      
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  return (
    <LoginContainer>
      <BackgroundPattern />
      <LoginCard
        as={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Logo>
          <LogoImage src={logoImg} alt="MM4All" />
          <LogoText>Admin Portal</LogoText>
          <LogoSubtext>Mindful Management Dashboard</LogoSubtext>
        </Logo>
        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Email Address</FormLabel>
            <InputWrapper>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <FormInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </InputWrapper>
          </FormGroup>
          <FormGroup>
            <FormLabel>Password</FormLabel>
            <InputWrapper>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <FormInput
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your secure password"
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
            </InputWrapper>
          </FormGroup>
          <CheckboxGroup>
            <CheckboxInput
              type="checkbox"
              name="rememberMe"
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
            />
            <CheckboxLabel htmlFor="rememberMe">
              Remember me for 30 days
            </CheckboxLabel>
          </CheckboxGroup>
          {error && (
            <ErrorMessage
              as={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </ErrorMessage>
          )}
          <LoginButton
            type="submit"
            disabled={loading || !formData.email || !formData.password}
            as={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </LoginButton>
        </LoginForm>
        <LoginFooter>
          <FooterLink href="/admin/forgot-password">
            Forgot your password?
          </FooterLink>
          <FooterText>
            Secure access to MM4All administration
          </FooterText>
        </LoginFooter>
      </LoginCard>
    </LoginContainer>
  );
};
const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 20%, rgba(var(--lavender-rgb), 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(var(--lavender-rgb), 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(var(--lavender-rgb), 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
`;
const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius);
  padding: 3rem;
  width: 100%;
  max-width: 440px;
  box-shadow: var(--shadow);
  border: 1px solid rgba(var(--lavender-rgb), 0.1);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const LogoImage = styled.img`
  height: 70px;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 2px 8px rgba(var(--lavender-rgb), 0.2));
  width: auto;
  aspect-ratio: auto;
  display: block;
  max-width: 100%;
  object-fit: contain;
`;

const LogoText = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--lavender-darker);
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
`;

const LogoSubtext = styled.p`
  font-size: 0.95rem;
  color: var(--lavender-dark);
  margin: 0;
  font-weight: 400;
`;
const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FormLabel = styled.label`
  font-weight: 600;
  color: var(--lavender-darker);
  font-size: 0.95rem;
  letter-spacing: -0.01em;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1.25rem;
  color: var(--lavender-dark);
  z-index: 2;
  font-size: 1.1rem;
`;
const FormInput = styled.input`
  width: 100%;
  padding: 1.25rem 1.25rem 1.25rem 3.5rem;
  border: 2px solid var(--tertiary-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-dark);
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: var(--lavender);
    box-shadow: 0 0 0 3px rgba(var(--lavender-rgb), 0.15);
    background: rgba(255, 255, 255, 1);
  }

  &::placeholder {
    color: var(--lavender-dark);
    font-weight: 400;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1.25rem;
  background: none;
  border: none;
  color: var(--lavender-dark);
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 8px;
  transition: var(--transition);
  z-index: 2;

  &:hover {
    color: var(--lavender);
    background: rgba(var(--lavender-rgb), 0.1);
  }
`;
const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const CheckboxInput = styled.input`
  width: 20px;
  height: 20px;
  accent-color: var(--lavender);
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 0.95rem;
  color: var(--lavender-darker);
  cursor: pointer;
  user-select: none;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #fed7d7 0%, #fbb6ce 100%);
  border: 1px solid #f687b3;
  color: #c53030;
  padding: 1.25rem;
  border-radius: var(--border-radius);
  font-size: 0.95rem;
  text-align: center;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(197, 48, 48, 0.1);
`;
const LoginButton = styled.button`
  width: 100%;
  padding: 1.25rem;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 16px rgba(var(--lavender-rgb), 0.3);
  letter-spacing: -0.01em;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(var(--lavender-rgb), 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: 0 4px 16px rgba(var(--lavender-rgb), 0.2);
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
const LoginFooter = styled.div`
  margin-top: 2.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FooterLink = styled.a`
  color: var(--lavender);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
  font-size: 0.95rem;

  &:hover {
    color: var(--lavender-dark);
    text-decoration: underline;
  }
`;

const FooterText = styled.p`
  color: var(--lavender-dark);
  font-size: 0.9rem;
  margin: 0;
  font-weight: 400;
`;
export default AdminLogin;
