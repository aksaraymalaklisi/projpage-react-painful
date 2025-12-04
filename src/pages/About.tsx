import React from 'react';
import styled from 'styled-components';
import { PageLayout } from '../components/PageLayout';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--verde-escuro);
  margin-bottom: 30px;
  text-align: center;
`;

const Section = styled.section`
  margin-bottom: 40px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--verde-medio);
  margin-bottom: 15px;
`;

const Text = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 15px;
`;

export const About: React.FC = () => {
  return (
    <PageLayout>
      <Container>
        <Title>Sobre o Green Trail</Title>

        <Section>
          <SectionTitle>Nossa Missão</SectionTitle>
          <Text>
            O Green Trail nasceu da paixão por explorar a natureza e superar limites.
            Nosso objetivo é conectar entusiastas de trilhas, promover o ecoturismo consciente
            e fornecer as melhores ferramentas para você descobrir novos caminhos.
          </Text>
        </Section>

        <Section>
          <SectionTitle>A Comunidade</SectionTitle>
          <Text>
            Acreditamos que a melhor parte da aventura é compartilhar.
            Nossa comunidade é um espaço para trocar experiências, dicas e fotos
            das trilhas mais incríveis da região.
          </Text>
        </Section>

        <Section>
          <SectionTitle>Tecnologia</SectionTitle>
          <Text>
            Utilizamos tecnologia de ponta para garantir que você tenha acesso
            a mapas detalhados, informações precisas e uma experiência fluida,
            seja no desktop ou no mobile.
          </Text>
        </Section>
      </Container>
    </PageLayout>
  );
};
