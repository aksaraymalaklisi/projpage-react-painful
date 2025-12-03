import styled from 'styled-components';
import { TrilhasCarousel } from '../components/TrilhasCarousel';

const HomeContainer = styled.main`
  width: 100%;
  position: relative;
  background-color: var(--bege);
  
  /* Subtle Pattern Background */
  background-image: radial-gradient(var(--verde-medio) 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: 0 0, 20px 20px;

  /* Decorative Blurred Circles */
  &::before {
    content: '';
    position: absolute;
    top: -100px;
    right: -100px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(47, 219, 31, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -100px;
    left: -100px;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(13, 175, 22, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
`;

export function Home() {
  return (
    <HomeContainer>
      <TrilhasCarousel />
      {/* Map component will be added here */}
    </HomeContainer>
  );
}
