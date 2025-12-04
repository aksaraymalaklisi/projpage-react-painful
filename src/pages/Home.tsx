import { useEffect, useState } from 'react';
import { TrilhasCarousel } from '../components/TrilhasCarousel';
import { InteractiveMap } from '../components/InteractiveMap';
import { api } from '../services/api';
import type { Track, TrailResponse } from '../types';

import { PageLayout } from '../components/PageLayout';

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
    <PageLayout>
      <TrilhasCarousel />
      {tracks.length > 0 && <InteractiveMap tracks={tracks} />}
    </PageLayout>
  );
}
