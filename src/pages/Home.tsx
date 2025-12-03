import styled from 'styled-components';

const HomeContainer = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 60vh;

  @media (max-width: 768px) {
    padding: 30px 15px;
  }
`;

const WelcomeSection = styled.section`
  text-align: center;
  margin-bottom: 60px;

  h2 {
    color: var(--verde-escuro);
    font-size: 2.5rem;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.2rem;
    color: #555;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.8;

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
`;

export function Home() {
  return (
    <HomeContainer>
      <WelcomeSection>
        <h2>Bem-vindo ao Green Trail</h2>
        <p>
          Explore trilhas ecológicas incríveis na Região dos Lagos. Descubra rotas
          desafiadoras, paisagens deslumbrantes e conecte-se com a natureza.
        </p>
      </WelcomeSection>
      {/* Trail carousel and map components will be added here */}
    </HomeContainer>
  );
}
