import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaMountain, FaChevronRight, FaChevronLeft } from 'react-icons/fa';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { api } from '../services/api';
import type { Track, TrailResponse } from '../types';

const CarouselSection = styled.section`
  padding: 40px 0 80px;
  background: transparent;
  position: relative;
  z-index: 1;
`;

const GlassContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 40px;
  padding: 60px 0; /* Removed side padding for full-width carousel */
  border: 1px solid rgba(13, 175, 22, 0.3); /* Subtle green border */
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  max-width: 1400px;
  margin: 0 auto;
  overflow: hidden; /* Ensure carousel stays within rounded corners */
  
  @media (max-width: 768px) {
    padding: 40px 0;
    border-radius: 30px;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 0 20px;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  color: var(--verde-escuro);
  margin-bottom: 20px;
  font-weight: 800;
  letter-spacing: -1px;
  position: relative;
  display: inline-block;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.8);
  
  /* Decorative Underline */
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 6px;
    background: var(--verde-medio);
    margin: 10px auto 0;
    border-radius: 3px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const SectionSubtitle = styled.p`
  color: #444;
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
`;

const CarouselContainer = styled.div`
  width: 100%;
  position: relative;
  
  /* Foggy Gradients */
  &::before, &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 50px; /* Smaller width */
    z-index: 2;
    pointer-events: none;
    /* Fade vertically */
    mask-image: linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%);
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.95) 0%, transparent 100%); /* Stronger opacity */
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, rgba(255, 255, 255, 0.95) 0%, transparent 100%); /* Stronger opacity */
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }
  
  .swiper {
    width: 100%;
    padding-top: 20px;
    padding-bottom: 60px;
  }

  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 340px;
    height: 520px;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    background: #fff;
    position: relative;
    
    /* Premium border effect */
    border: 1px solid rgba(255, 255, 255, 0.1);

    @media (max-width: 768px) {
      width: 280px;
      height: 420px;
      border-radius: 20px;
    }
  }

  .swiper-pagination-bullet {
    background: var(--verde-medio);
    opacity: 0.5;
    width: 10px;
    height: 10px;
    transition: all 0.3s;
  }

  .swiper-pagination-bullet-active {
    opacity: 1;
    width: 24px;
    border-radius: 5px;
  }
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  color: var(--verde-escuro);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 20; /* Higher than fog (z-index: 2) */
  font-size: 1.2rem;

  &:hover {
    background: var(--verde-escuro);
    color: #fff;
    transform: translateY(-50%) scale(1.15);
    box-shadow: 0 8px 25px rgba(13, 175, 22, 0.3);
    border-color: var(--verde-escuro);
  }

  &.prev {
    left: 20px;
  }

  &.next {
    right: 20px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const CardImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  /* Gradient Overlay - Darkened for better readability */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80%;
    background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 70%, transparent 100%);
    pointer-events: none;
  }
`;

const DifficultyBadge = styled.span<{ $level: string }>`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #fff;
  background: ${props => {
    const level = props.$level?.toLowerCase() || '';
    if (level.includes('fácil') || level.includes('facil') || level.includes('easy')) return 'rgba(46, 204, 113, 0.9)';
    if (level.includes('moderado') || level.includes('médio') || level.includes('moderate')) return 'rgba(243, 156, 18, 0.9)';
    if (level.includes('difícil') || level.includes('dificil') || level.includes('hard')) return 'rgba(231, 76, 60, 0.9)';
    return 'rgba(52, 152, 219, 0.9)';
  }};
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  z-index: 10;
  letter-spacing: 1px;
`;

const CardContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 25px;
  z-index: 2;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardTitle = styled.h3`
  font-size: 1.6rem;
  margin: 0;
  font-weight: 700;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
`;

const CardDescription = styled.p`
  font-size: 0.9rem;
  opacity: 0.95;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
`;

const CardStats = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 5px;
  padding-top: 15px;
  border-top: 1px solid rgba(255,255,255,0.2);
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  
  svg {
    color: var(--verde-claro);
    font-size: 1rem;
  }
`;

const ViewButton = styled.button`
  position: absolute;
  bottom: 25px;
  right: 25px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: var(--verde-claro);
  border: none;
  color: var(--branco);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  z-index: 20;

  &:hover {
    transform: scale(1.1);
    background: var(--verde-medio);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.2rem;
  color: var(--verde-escuro);
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

  if (m >= 1000) return `${(m / 1000).toFixed(1)}km`;
  return `${m}m`;
};

export function TrilhasCarousel() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await api.get<TrailResponse>('tracks/');
        if (response.results) {
          setTracks(response.results);
        } else if (Array.isArray(response)) {
          setTracks(response);
        }
      } catch (error) {
        console.error('Error fetching tracks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  if (loading) {
    return (
      <CarouselSection>
        <LoadingContainer>Carregando trilhas...</LoadingContainer>
      </CarouselSection>
    );
  }

  if (tracks.length === 0) {
    return null;
  }

  return (
    <CarouselSection>
      <GlassContainer>
        <SectionHeader>
          <SectionTitle>Explore Nossas Trilhas</SectionTitle>
          <SectionSubtitle>
            Descubra as mais belas paisagens de Maricá através de nossas rotas selecionadas
          </SectionSubtitle>
        </SectionHeader>

        <CarouselContainer>
          <NavButton className="prev" onClick={() => swiperInstance?.slidePrev()} aria-label="Anterior">
            <FaChevronLeft />
          </NavButton>

          <NavButton className="next" onClick={() => swiperInstance?.slideNext()} aria-label="Próximo">
            <FaChevronRight />
          </NavButton>

          <Swiper
            onSwiper={setSwiperInstance}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView={'auto'}
            coverflowEffect={{
              rotate: 35,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            navigation={false} // Disable default navigation
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            className="mySwiper"
          >
            {tracks.map((track) => (
              <SwiperSlide key={track.id}>
                <CardImageContainer>
                  <img
                    src={track.image || track.imageUrl || track.photo || 'https://via.placeholder.com/340x520?text=Sem+Imagem'}
                    alt={track.label || track.title}
                    referrerPolicy="no-referrer"
                  />
                  <DifficultyBadge $level={track.difficulty || track.dificuldade || 'Médio'}>
                    {track.difficulty || track.dificuldade || 'Médio'}
                  </DifficultyBadge>
                </CardImageContainer>

                <CardContent>
                  <CardTitle>{track.label || track.title}</CardTitle>
                  <CardDescription>
                    {track.description || track.descricao || 'Sem descrição disponível.'}
                  </CardDescription>

                  <CardStats>
                    <StatItem>
                      <FaClock />
                      <span>{formatTime(track.duration || track.time || track.tempo)}</span>
                    </StatItem>
                    <StatItem>
                      <FaMountain />
                      <span>{formatDistance(track.distance || track.distancia)}</span>
                    </StatItem>
                  </CardStats>

                  <ViewButton onClick={() => navigate(`/trilhas/${track.id}`)} aria-label="Ver detalhes">
                    <FaChevronRight />
                  </ViewButton>
                </CardContent>
              </SwiperSlide>
            ))}
          </Swiper>
        </CarouselContainer>
      </GlassContainer>
    </CarouselSection>
  );
}
