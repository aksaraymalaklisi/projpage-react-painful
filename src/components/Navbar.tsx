import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaMapMarkedAlt, FaUsers, FaHeart, FaInfoCircle, FaBars, FaSignInAlt, FaUserPlus, FaTimes } from 'react-icons/fa';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { User } from '../types';

const Nav = styled.nav`
  background: var(--verde-escuro);
  color: var(--branco);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 1100; /* Increased to be above Chatbot (1000) */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const DesktopAvatarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none !important;
  }
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  gap: 15px;
  min-height: 60px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 15px 20px;
    gap: 0;
    min-height: auto;
  }
`;

const TopRow = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 15px;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--branco);
  transition: opacity 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
  z-index: 101;

  &:hover {
    opacity: 0.9;
  }

  img {
    height: 50px;
    width: 50px;
    margin-right: 10px;
    border-radius: 12px;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    display: none;
  }

  @media (max-width: 1200px) {
    font-size: 1.3rem;
  }
`;

const MobileLogo = styled(Link)`
  font-size: 1.2rem;
  font-weight: bold;
  display: none;
  align-items: center;
  text-decoration: none;
  color: var(--branco);
  transition: opacity 0.2s;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    opacity: 0.9;
  }

  img {
    height: 40px;
    width: 40px;
    margin-right: 10px;
    border-radius: 12px;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--branco);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  transition: opacity 0.2s, transform 0.2s;
  border-radius: 6px;
  z-index: 101;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const NavLinks = styled.ul<{ $isOpen: boolean }>`
  display: flex;
  list-style: none;
  gap: 4px;
  margin: 0;
  padding: 0;
  flex: 1;
  justify-content: center;
  align-items: center;
  min-width: 0;

  @media (min-width: 769px) {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  li {
    margin: 0;
    flex-shrink: 1;
  }

  a {
    color: var(--branco);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 14px;
    border-radius: 8px;
    position: relative;
    border: 1px solid transparent;
    white-space: nowrap;
    font-size: 0.9rem;

    &:hover {
      color: var(--verde-claro);
      background: rgba(255, 255, 255, 0.1);
      /* UPDATED: Changed from 0.2 to 0.3 to match Auth Buttons */
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    svg {
      font-size: 0.85rem;
      flex-shrink: 0;
    }

    /* Active link indicator */
    &.active {
      background: rgba(255, 255, 255, 0.15);
      border-color: var(--verde-medio);
      color: var(--verde-claro);
    }
  }

  @media (max-width: 1024px) {
    gap: 3px;
    
    a {
      padding: 10px 8px;
      font-size: 0.85rem;
      gap: 4px;
      
      span {
        display: none;
      }
      
      svg {
        margin: 0;
        font-size: 0.9rem;
      }
    }
  }

  @media (max-width: 900px) {
    gap: 2px;
    
    a {
      padding: 10px 6px;
    }
  }

  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    flex-direction: column;
    width: 100%;
    margin-top: 20px;
    gap: 8px;
    padding: 20px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    li {
      display: block !important;
      width: 100%;
    }

    a {
      width: 100%;
      padding: 14px 20px;
      border-radius: 10px;
      justify-content: flex-start;
      font-size: 1rem;
      gap: 8px;
      
      span {
        display: inline;
      }
      
      svg {
        font-size: 1rem;
      }
    }
  }
`;

const AuthButtons = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    gap: 8px;
  }

  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    flex-direction: column;
    width: 100%;
    margin-top: 10px;
    gap: 12px;
    padding-bottom: 10px;
  }
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #e0e7ef;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2.5px solid var(--verde-medio);
  overflow: hidden;
  position: relative;
  transition: box-shadow 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  z-index: 101;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.13);
    transform: scale(1.05);
    border-color: var(--verde-claro);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .plus {
    font-size: 1.8rem;
    color: var(--verde-medio);
    font-weight: bold;
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
  }
`;

const AvatarMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 180px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);

  button {
    background: none;
    border: none;
    padding: 12px 20px;
    text-align: left;
    font-size: 0.95rem;
    color: #222;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;

    &:hover {
      background: #f4f8fb;
    }

    &:first-child {
      border-bottom: 1px solid #eee;
    }
  }
`;

// Modern button styles with better visual hierarchy
const LoginButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: transparent;
  color: var(--branco);
  padding: 10px 20px;
  border-radius: 10px;
  /* UPDATED: 1px width, 0.3 opacity */
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    transition: left 0.3s ease;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 0.85rem;
    flex-shrink: 0;
  }

  span {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 1024px) {
    padding: 10px 16px;
    font-size: 0.85rem;
    gap: 6px;
  }

  @media (max-width: 900px) {
    padding: 10px 14px;
    font-size: 0.8rem;
    
    span {
      display: none;
    }
    
    svg {
      margin: 0;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    padding: 12px 24px;
    font-size: 1rem;
    
    span {
      display: inline;
    }
  }
`;

const SignupButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--verde-medio), var(--verde-claro));
  color: var(--branco);
  padding: 10px 20px;
  border-radius: 10px;
  /* UPDATED: Added border to match Login and NavLinks */
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(13, 175, 22, 0.3);
  white-space: nowrap;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--verde-claro), var(--verde-medio));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  span {
    position: relative;
    z-index: 1;
  }

  svg {
    position: relative;
    z-index: 1;
    font-size: 0.85rem;
    flex-shrink: 0;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(13, 175, 22, 0.4);
    /* Brighten border slightly on hover */
    border-color: rgba(255, 255, 255, 0.5);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(13, 175, 22, 0.3);
  }

  @media (max-width: 1024px) {
    padding: 10px 16px;
    font-size: 0.85rem;
    gap: 6px;
  }

  @media (max-width: 900px) {
    padding: 10px 14px;
    font-size: 0.8rem;
    
    span {
      display: none;
    }
    
    svg {
      margin: 0;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    padding: 12px 24px;
    font-size: 1rem;
    
    span {
      display: inline;
    }
  }
`;

interface NavbarProps {
  onLoginClick?: () => void;
}

export function Navbar({ onLoginClick }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, updateUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
        setShowAvatarMenu(false);
      }
    };

    if (showAvatarMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAvatarMenu]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleAvatarClick = () => {
    setShowAvatarMenu(!showAvatarMenu);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Create preview immediately
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const base64Photo = readerEvent.target?.result as string;
      const updatedUser: User = {
        ...user,
        profile: {
          ...user.profile,
          picture: base64Photo,
        },
      };
      updateUser(updatedUser);
    };
    reader.readAsDataURL(file);

    // Upload to backend
    const formData = new FormData();
    formData.append('picture', file);

    try {
      const userData = await api.patch<User>('users/me/', formData, true);
      const updatedUser: User = {
        ...user,
        profile: {
          ...user.profile,
          picture: userData.profile?.picture
            ? (userData.profile.picture.startsWith('http')
              ? userData.profile.picture
              : `${import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, '')}${userData.profile.picture.startsWith('/') ? '' : '/'}${userData.profile.picture}`)
            : user.profile?.picture,
        },
      };
      updateUser(updatedUser);
    } catch (error) {
      console.error('Failed to upload photo:', error);
      // Photo is already saved locally, so we keep it
    }
  };

  const handleLogout = () => {
    logout();
    setShowAvatarMenu(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const handleAddPhoto = () => {
    fileInputRef.current?.click();
    setShowAvatarMenu(false);
  };

  return (
    <Nav>
      <NavContainer>
        {/* Mobile: Top row with logo and hamburger */}
        <TopRow>
          <MobileLogo to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/favicon.png" alt="Green Trail" />
            <span>Green Trail</span>
          </MobileLogo>

          {!user && (
            <MenuToggle
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </MenuToggle>
          )}

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <MenuToggle
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
              </MenuToggle>
              <div style={{ position: 'relative' }} ref={avatarMenuRef}>
                <UserAvatar onClick={handleAvatarClick} title={user.name || 'Usuário'}>
                  {user.profile?.picture ? (
                    <img src={user.profile.picture} alt="Avatar" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="plus">+</span>
                  )}
                </UserAvatar>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                {showAvatarMenu && (
                  <AvatarMenu>
                    <button onClick={handleAddPhoto}>
                      {user.profile?.picture ? 'Alterar foto' : 'Adicionar foto'}
                    </button>
                    <button onClick={handleLogout}>Sair</button>
                  </AvatarMenu>
                )}
              </div>
            </div>
          )}
        </TopRow>

        {/* Desktop: Logo (hidden on mobile) */}
        <Logo to="/" onClick={() => setIsMobileMenuOpen(false)}>
          <img src="/favicon.png" alt="Green Trail" />
          <span>Green Trail</span>
        </Logo>

        {/* Desktop: Nav links */}
        <NavLinks $isOpen={isMobileMenuOpen}>
          {/* Home button commented out - users can click logo to go home */}
          {/* <li>
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={location.pathname === '/' ? 'active' : ''}
            >
              <FaHome /> <span>Home</span>
            </Link>
          </li> */}
          <li>
            <Link
              to="/trilhas"
              onClick={() => setIsMobileMenuOpen(false)}
              className={location.pathname === '/trilhas' ? 'active' : ''}
            >
              <FaMapMarkedAlt /> <span>Trilhas</span>
            </Link>
          </li>
          <li>
            <Link
              to="/community"
              onClick={() => setIsMobileMenuOpen(false)}
              className={location.pathname === '/community' ? 'active' : ''}
            >
              <FaUsers /> <span>Comunidade</span>
            </Link>
          </li>
          <li>
            <Link
              to="/favorites"
              onClick={() => setIsMobileMenuOpen(false)}
              className={location.pathname === '/favorites' ? 'active' : ''}
            >
              <FaHeart /> <span>Favoritos</span>
            </Link>
          </li>
          {/* Contact button removed - it only scrolls, not a real page */}
          <li>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={location.pathname === '/about' ? 'active' : ''}
            >
              <FaInfoCircle /> <span>Sobre</span>
            </Link>
          </li>
        </NavLinks>

        {/* Desktop: Auth buttons or Avatar */}
        {!user ? (
          <AuthButtons $isOpen={isMobileMenuOpen}>
            <LoginButton onClick={onLoginClick || (() => navigate('/login'))}>
              <FaSignInAlt /> <span>Entrar</span>
            </LoginButton>
            <SignupButton onClick={() => navigate('/register')}>
              <FaUserPlus /> <span>Cadastre-se</span>
            </SignupButton>
          </AuthButtons>
        ) : (
          <DesktopAvatarContainer ref={avatarMenuRef}>
            <UserAvatar onClick={handleAvatarClick} title={user.name || 'Usuário'}>
              {user.profile?.picture ? (
                <img src={user.profile.picture} alt="Avatar" referrerPolicy="no-referrer" />
              ) : (
                <span className="plus">+</span>
              )}
            </UserAvatar>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
            {showAvatarMenu && (
              <AvatarMenu>
                <button onClick={handleAddPhoto}>
                  {user.profile?.picture ? 'Alterar foto' : 'Adicionar foto'}
                </button>
                <button onClick={handleLogout}>Sair</button>
              </AvatarMenu>
            )}
          </DesktopAvatarContainer>
        )}
      </NavContainer>
    </Nav>
  );
}
