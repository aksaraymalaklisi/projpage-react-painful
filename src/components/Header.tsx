import styled, { keyframes } from 'styled-components';
import { FaTree } from 'react-icons/fa';

// 1. Subtle Background Pulse
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// 2. Simple Entrance Fade
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeaderSection = styled.header`
  background: linear-gradient(
    -45deg, 
    var(--verde-escuro),
    var(--verde-medio), 
    var(--verde-escuro)
  );
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  
  color: var(--branco);
  padding: 110px 0 140px;
  text-align: center;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
  margin-bottom: -50px;
  position: relative;
  overflow: hidden;

  /* Texture: Subtle dot pattern */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 30px 30px;
    opacity: 0.3;
    pointer-events: none;
  }

  /* Lighting: Large subtle glow in top left corner */
  &::after {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
    top: -200px;
    left: -100px;
    border-radius: 50%;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 80px 0 100px;
    clip-path: polygon(0 0, 100% 0, 100% 92%, 0 100%);
  }
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  /* UPDATED: Removed the float animation, kept the entrance fade */
  animation: ${fadeInUp} 0.8s ease-out;
  
  svg {
    color: var(--verde-claro);
  }
`;

const HeaderTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 20px;
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.1;
  /* Entrance delay */
  animation: ${fadeInUp} 0.8s ease-out 0.2s backwards;

  /* Subtle text gradient (Silver/White) */
  background: linear-gradient(to right, #ffffff, #e0f2f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const HeaderDesc = styled.p`
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.9;
  line-height: 1.7;
  font-weight: 400;
  /* Longer entrance delay */
  animation: ${fadeInUp} 0.8s ease-out 0.4s backwards;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 0 20px;
  }
`;

export function Header() {
  return (
    <HeaderSection>
      <HeaderContainer>
        <Badge>
          <FaTree /> Ecoturismo & Aventura
        </Badge>
        <HeaderTitle>Green Trail</HeaderTitle>
        <HeaderDesc>
          Descubra rotas incríveis em meio à natureza preservada. 
          O seu guia definitivo para explorar a Região dos Lagos.
        </HeaderDesc>
      </HeaderContainer>
    </HeaderSection>
  );
}