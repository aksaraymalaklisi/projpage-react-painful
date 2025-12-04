import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaHeart, FaMapMarkerAlt, FaClock, FaMountain } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { PageLayout } from '../components/PageLayout';
import { api } from '../services/api';
import type { TrailResponse, Track } from '../types';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const GlassContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 40px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  min-height: 600px;

  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 20px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: var(--verde-escuro);
  margin-bottom: 15px;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    flex-direction: column;
    gap: 8px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const Card = styled(Link)`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.12);
    border-color: var(--verde-claro);
  }
`;

const CardImage = styled.div<{ $bg: string }>`
  height: 220px;
  background-image: url(${props => props.$bg});
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30%;
    background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
  }
`;

const CardContent = styled.div`
  padding: 25px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h3`
  font-size: 1.4rem;
  color: var(--verde-escuro);
  margin-bottom: 10px;
  font-weight: 700;
  line-height: 1.3;
`;

const CardFooter = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.9rem;
  border-top: 1px solid rgba(0,0,0,0.05);
  padding-top: 15px;
  font-weight: 500;
`;

const IconText = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    color: var(--verde-medio);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px;
  color: #555;
  font-size: 1.3rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  margin-top: 20px;
`;

// Helper to format time (minutes to Xh Ym)
const formatTime = (minutes?: number | string) => {
  if (!minutes) return 'N/A';
  const mins = Number(minutes);
  if (isNaN(mins)) return minutes;

  const h = Math.floor(mins / 60);
  const m = mins % 60;

  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0) return `${h}h`;
  return `${m}min`;
};

export const Favorites: React.FC = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        // Fetch tracks with favorited=true filter
        const data = await api.get<TrailResponse>('tracks/?favorited=true', true);
        if (data.results) {
          setFavorites(data.results);
        } else if (Array.isArray(data)) {
          setFavorites(data);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (!user) {
    return (
      <PageLayout>
        <Container>
          <GlassContainer>
            <Header>
              <Title>Seus Favoritos</Title>
              <p style={{ fontSize: '1.1rem', color: '#444' }}>Faça login para ver suas trilhas favoritas.</p>
            </Header>
          </GlassContainer>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Container>
        <GlassContainer>
          <Header>
            <Title>Seus Favoritos <FaHeart color="#e74c3c" /></Title>
            <p style={{ fontSize: '1.1rem', color: '#444' }}>As trilhas que você mais ama.</p>
          </Header>

          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--verde-escuro)', fontSize: '1.2rem' }}>Carregando...</p>
          ) : favorites.length > 0 ? (
            <Grid>
              {favorites.map(track => (
                <Card key={track.id} to={`/trilhas/${track.id}`}>
                  <CardImage $bg={track.image || '/placeholder-trail.jpg'} />
                  <CardContent>
                    <CardTitle>{track.label}</CardTitle>
                    <CardFooter>
                      <IconText><FaMapMarkerAlt /> {(Number(track.distance || 0) / 1000).toFixed(1)}km</IconText>
                      <IconText><FaClock /> {formatTime(track.duration)}</IconText>
                      <IconText><FaMountain /> {track.difficulty}</IconText>
                    </CardFooter>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          ) : (
            <EmptyState>
              Você ainda não tem favoritos. Explore as trilhas e marque as que gostar!
            </EmptyState>
          )}
        </GlassContainer>
      </Container>
    </PageLayout>
  );
};
