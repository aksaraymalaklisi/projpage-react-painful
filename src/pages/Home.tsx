import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TrilhasCarousel } from '../components/TrilhasCarousel';
import { InteractiveMap } from '../components/InteractiveMap';
import { api } from '../services/api';
import type { Track, TrailResponse } from '../types';

const HomeContainer = styled.main`
  width: 100%;
  position: relative;
  background-color: var(--bege);
  overflow: hidden;
  
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
  const [tracks, setTracks] = useState<Track[]>([]);

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
        console.error('Error fetching tracks for map:', error);
      }
    };

    fetchTracks();
  }, []);

  return (
    <HomeContainer>
      <TrilhasCarousel />
      {tracks.length > 0 && <InteractiveMap tracks={tracks} />}
    </HomeContainer>
  );
}
