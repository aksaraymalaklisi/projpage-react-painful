import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaClock, FaMountain, FaHeart, FaRegHeart } from 'react-icons/fa';
// import { config } from '../config'; // Removed unused import
import { PageLayout } from '../components/PageLayout';
import { api } from '../services/api';
import type { Track, TrailResponse } from '../types';
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

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: var(--verde-escuro);
  margin-bottom: 20px;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5);

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 15px;
  }
`;

const SearchBar = styled.div`
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 18px 25px 18px 55px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transition: all 0.3s;
  color: #333;

  &:focus {
    outline: none;
    background: #fff;
    border-color: var(--verde-medio);
    box-shadow: 0 8px 25px rgba(13, 175, 22, 0.15);
  }
  
  &::placeholder {
    color: #888;
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 25px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--verde-medio);
  font-size: 1.1rem;
  z-index: 1;
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

const FavoriteButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.2s, background 0.2s;
  z-index: 2;
  backdrop-filter: blur(4px);

  &:hover {
    transform: scale(1.1);
    background: #fff;
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

const CardDescription = styled.p`
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 20px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

const Trilhas: React.FC = () => {
  const { user } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        // Try fetching with auth first (default)
        const data = await api.get<TrailResponse | Track[]>('tracks/');

        let tracksData: Track[] = [];
        if (Array.isArray(data)) {
          tracksData = data;
        } else if ((data as any).results && Array.isArray((data as any).results)) {
          tracksData = (data as any).results;
        }
        setTracks(tracksData);
      } catch (error) {
        console.warn('Authenticated fetch failed, trying public access...', error);
        try {
          // Fallback to unauthenticated fetch
          const data = await api.get<TrailResponse | Track[]>('tracks/', false);

          let tracksData: Track[] = [];
          if (Array.isArray(data)) {
            tracksData = data;
          } else if ((data as any).results && Array.isArray((data as any).results)) {
            tracksData = (data as any).results;
          }
          setTracks(tracksData);
        } catch (err2) {
          console.error('Error fetching tracks:', err2);
          setTracks([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const toggleFavorite = async (e: React.MouseEvent, trackId: number) => {
    e.preventDefault(); // Prevent card navigation
    if (!user) {
      alert('Faça login para favoritar!');
      return;
    }

    try {
      // Optimistic update
      setTracks(prev => prev.map(t =>
        t.id === trackId ? { ...t, is_favorite: !t.is_favorite } : t
      ));

      await api.post(`tracks/${trackId}/favorite/`, {}, true);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on error
      setTracks(prev => prev.map(t =>
        t.id === trackId ? { ...t, is_favorite: !t.is_favorite } : t
      ));
    }
  };

  const filteredTracks = tracks.filter(track =>
    (track.label || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (track.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout>
      <Container>
        <GlassContainer>
          <Header>
            <Title>Explore as Trilhas</Title>
            <SearchBar>
              <SearchIcon />
              <SearchInput
                type="text"
                placeholder="Busque por nome, dificuldade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>
          </Header>

          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--verde-escuro)', fontSize: '1.2rem' }}>Carregando...</p>
          ) : (
            <Grid>
              {filteredTracks.map(track => (
                <Card key={track.id} to={`/trilhas/${track.id}`}>
                  <FavoriteButton onClick={(e) => toggleFavorite(e, Number(track.id))}>
                    {track.is_favorite ? <FaHeart color="red" /> : <FaRegHeart color="#ccc" />}
                  </FavoriteButton>
                  <CardImage
                    $bg={track.image || '/placeholder-trail.jpg'}
                    as="img" // Render CardImage as an img tag
                    src={track.image || '/placeholder-trail.jpg'} // Use src for img tag
                    alt={track.label || 'Trail image'}
                    referrerPolicy="no-referrer"
                  />
                  <CardContent>
                    <CardTitle>{track.label || 'Sem título'}</CardTitle>
                    <CardDescription>
                      {track.description || track.descricao || 'Sem descrição disponível.'}
                    </CardDescription>
                    <CardFooter>
                      <IconText><FaMapMarkerAlt /> {(Number(track.distance || 0) / 1000).toFixed(1)}km</IconText>
                      <IconText><FaClock /> {formatTime(track.duration)}</IconText>
                      <IconText><FaMountain /> {track.difficulty}</IconText>
                    </CardFooter>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          )}
        </GlassContainer>
      </Container>
    </PageLayout>
  );
};

export default Trilhas;
