import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaMountain, FaArrowLeft, FaHeart, FaRegHeart } from 'react-icons/fa';

import { PageLayout } from '../components/PageLayout';
import { api } from '../services/api';
import type { Track } from '../types';
import { useAuth } from '../context/AuthContext';

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
  
  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 20px;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #555;
  text-decoration: none;
  margin-bottom: 20px;
  font-weight: 600;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.5);
  padding: 10px 20px;
  border-radius: 20px;
  backdrop-filter: blur(5px);

  &:hover {
    color: var(--verde-escuro);
    background: rgba(255, 255, 255, 0.8);
    transform: translateX(-5px);
  }
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: var(--verde-escuro);
  margin-bottom: 10px;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5);

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 20px;
  color: #444;
  font-size: 1.1rem;
  flex-wrap: wrap;
  font-weight: 500;
  margin-top: 15px;
`;

const IconText = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.6);
  padding: 8px 15px;
  border-radius: 15px;
  
  svg {
    color: var(--verde-medio);
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 30px;
  margin-bottom: 40px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  border: 1px solid rgba(255, 255, 255, 0.5);

  @media (max-width: 768px) {
    height: 300px;
    border-radius: 20px;
    margin-bottom: 20px;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 50px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const Description = styled.div`
  font-size: 1.15rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 40px;
  background: rgba(255, 255, 255, 0.6);
  padding: 30px;
  border-radius: 25px;
  backdrop-filter: blur(5px);
`;

const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  }
`;

const Sidebar = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 35px;
  border-radius: 30px;
  height: fit-content;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  position: sticky;
  top: 100px;
`;

const SidebarTitle = styled.h3`
  font-size: 1.4rem;
  color: var(--verde-escuro);
  margin-bottom: 25px;
  border-bottom: 2px solid rgba(13, 175, 22, 0.2);
  padding-bottom: 15px;
  font-weight: 700;
`;

const FavoriteButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: all 0.2s;
  margin-left: 20px;
  backdrop-filter: blur(5px);

  &:hover {
    transform: scale(1.1);
    background: #fff;
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  color: #444;
  font-size: 1.05rem;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  padding-bottom: 10px;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
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

// Helper to format distance (meters to km)
const formatDistance = (meters?: number | string) => {
  if (!meters) return 'N/A';
  const m = Number(meters);
  if (isNaN(m)) return meters;
  return `${(m / 1000).toFixed(1)}km`;
};

// Helper to format route type
const formatRouteType = (type?: string) => {
  switch (type) {
    case 'ida_volta': return 'Ida e Volta';
    case 'ida': return 'Ida';
    case 'volta': return 'Volta';
    default: return type || 'N/A';
  }
};

export const TrackPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        // Try fetching with auth first
        const data = await api.get<Track>(`tracks/${id}/`);
        setTrack(data);
      } catch (error) {
        console.warn('Authenticated fetch failed, trying public access...', error);
        try {
          // Fallback to unauthenticated fetch
          const data = await api.get<Track>(`tracks/${id}/`, false);
          setTrack(data);
        } catch (err2) {
          console.error('Error fetching track details:', err2);
          setTrack(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
  }, [id]);

  const toggleFavorite = async () => {
    if (!user) {
      alert('Faça login para favoritar!');
      return;
    }
    if (!track) return;

    try {
      // Optimistic update
      setTrack(prev => prev ? { ...prev, is_favorite: !prev.is_favorite } : null);

      await api.post(`tracks/${track.id}/favorite/`, {}, true);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on error
      setTrack(prev => prev ? { ...prev, is_favorite: !prev.is_favorite } : null);
    }
  };

  if (loading) return <PageLayout><Container><GlassContainer>Carregando...</GlassContainer></Container></PageLayout>;
  if (!track) return <PageLayout><Container><GlassContainer>Trilha não encontrada.</GlassContainer></Container></PageLayout>;

  return (
    <PageLayout>
      <Container>
        <GlassContainer>
          <BackLink to="/trilhas"><FaArrowLeft /> Voltar para Trilhas</BackLink>

          <Header>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Title>{track.label}</Title>
              <FavoriteButton onClick={toggleFavorite}>
                {track.is_favorite ? <FaHeart color="#e74c3c" size={24} /> : <FaRegHeart color="#ccc" size={24} />}
              </FavoriteButton>
            </div>
            <MetaInfo>
              <IconText><FaMapMarkerAlt /> {formatDistance(track.distance)}</IconText>
              <IconText><FaClock /> {formatTime(track.duration)}</IconText>
              <IconText><FaMountain /> {track.difficulty}</IconText>
            </MetaInfo>
          </Header>

          {track.image && (
            <MainImage
              src={track.image}
              alt={track.label}
              referrerPolicy="no-referrer"
            />
          )}
          {!track.image && (
            <MainImage src="/placeholder-trail.jpg" alt={track.label} />
          )}

          <ContentGrid>
            <div>
              <Description>{track.description}</Description>

              <h3 style={{ fontSize: '1.8rem', color: 'var(--verde-escuro)', marginBottom: '20px' }}>Galeria</h3>
              <Gallery>
                {track.images && track.images.map(img => (
                  <GalleryImage key={img.id} src={img.image} alt="Gallery" />
                ))}
                {(!track.images || track.images.length === 0) && <p>Sem imagens adicionais.</p>}
              </Gallery>
            </div>

            <Sidebar>
              <SidebarTitle>Detalhes Técnicos</SidebarTitle>
              <StatRow>
                <span>Distância</span>
                <strong>{formatDistance(track.distance)}</strong>
              </StatRow>
              <StatRow>
                <span>Duração Estimada</span>
                <strong>{formatTime(track.duration)}</strong>
              </StatRow>
              <StatRow>
                <span>Dificuldade</span>
                <strong>{track.difficulty}</strong>
              </StatRow>
              <StatRow>
                <span>Ganho de Elevação</span>
                <strong>{track.elevation ? `${track.elevation}m` : 'N/A'}</strong>
              </StatRow>
              <StatRow>
                <span>Tipo de Rota</span>
                <strong>{formatRouteType(track.route_type || track.routetype)}</strong>
              </StatRow>
            </Sidebar>
          </ContentGrid>
        </GlassContainer>
      </Container>
    </PageLayout>
  );
};
