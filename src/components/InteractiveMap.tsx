import { useEffect, useState, useRef } from 'react';
import { WeatherWidget } from './WeatherWidget';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-gpx';
import styled from 'styled-components';
import { renderToStaticMarkup } from 'react-dom/server';
import { FaMountain, FaFlagCheckered, FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaClock, FaSpinner } from 'react-icons/fa';
import type { Track } from '../types';

// Fix for default Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapSection = styled.section`
  padding: 0 0 40px;
  position: relative;
  z-index: 1;
  height: 750px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    height: 500px;
    padding-bottom: 40px;
  }
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 40px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  border: 1px solid rgba(13, 175, 22, 0.2);
  position: relative;

  .leaflet-container {
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    font-family: 'Inter', sans-serif;
  }

  /* Custom Popup Styles */
  .leaflet-popup-content-wrapper {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    padding: 0;
    overflow: hidden;
  }

  .leaflet-popup-tip {
    background: rgba(255, 255, 255, 0.95);
  }

  .leaflet-popup-content {
    margin: 0;
    width: 280px !important;
  }
`;

const FloatingNav = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 15px 30px;
  border-radius: 50px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  width: 90%;
  max-width: 500px;

  &:hover {
    box-shadow: 0 15px 40px rgba(0,0,0,0.2);
    transform: translateX(-50%) translateY(-2px);
  }
`;

// ... (existing styled components)

// ... (inside InteractiveMap component)



const NavButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--verde-claro);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 10px rgba(46, 204, 113, 0.3);

  &:hover {
    background: var(--verde-medio);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const TrailInfo = styled.div`
  text-align: center;
  min-width: 200px;
`;

const TrailName = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--verde-escuro);
`;

const TrailDifficulty = styled.span<{ $level: string }>`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${props => {
        const level = props.$level?.toLowerCase() || '';
        if (level.includes('fácil') || level.includes('facil') || level.includes('easy')) return '#27ae60';
        if (level.includes('moderado') || level.includes('médio') || level.includes('moderate')) return '#f39c12';
        return '#c0392b';
    }};
`;

const PopupContent = styled.div`
  padding: 20px;
`;

const PopupTitle = styled.h3`
  margin: 0 0 5px;
  color: var(--verde-escuro);
  font-size: 1.1rem;
`;

const PopupDesc = styled.p`
  margin: 0 0 10px;
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
`;

const PopupStats = styled.div`
  display: flex;
  gap: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #444;
  border-top: 1px solid #eee;
  padding-top: 10px;
  
  div {
    display: flex;
    align-items: center;
    gap: 5px;
    
    svg {
      color: var(--verde-claro);
    }
  }
`;

const LoadingSpinner = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  color: var(--verde-escuro);
  font-size: 1.2rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Custom Icons
const createCustomIcon = (color: string, iconComponent: React.ReactNode) => {
    const iconHtml = renderToStaticMarkup(
        <div style={{
            color: color,
            fontSize: '24px',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {iconComponent}
        </div>
    );

    return L.divIcon({
        html: iconHtml,
        className: 'custom-marker-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });
};

const DifficultyIcon = (level: string) => {
    let color = '#3498db';
    const l = level?.toLowerCase() || '';
    if (l.includes('fácil') || l.includes('facil') || l.includes('easy')) color = '#2ecc71';
    else if (l.includes('moderado') || l.includes('médio') || l.includes('moderate')) color = '#f39c12';
    else if (l.includes('difícil') || l.includes('dificil') || l.includes('hard')) color = '#e74c3c';

    return createCustomIcon(color, <FaMapMarkerAlt />);
};

const StartIcon = createCustomIcon('#0b6832ff', <FaMapMarkerAlt />);
const EndIcon = createCustomIcon('#bd392bff', <FaFlagCheckered />);

// Component to handle GPX loading and map centering
const GPXLayer = ({ track, onLoaded }: { track: Track | null, onLoaded: () => void }) => {
    const map = useMap();
    const gpxLayerRef = useRef<any>(null);
    const markersRef = useRef<L.Marker[]>([]);

    useEffect(() => {
        // Cleanup function to remove GPX layer and custom markers
        const cleanup = () => {
            if (gpxLayerRef.current) {
                map.removeLayer(gpxLayerRef.current);
                gpxLayerRef.current = null;
            }
            markersRef.current.forEach(m => map.removeLayer(m));
            markersRef.current = [];
        };

        if (!track || (!track.gpx && !track.url)) {
            cleanup();
            return;
        }

        const gpxUrl = track.gpx || track.url;
        if (!gpxUrl) return;

        // Cache buster to avoid CORS issues with cached responses
        const urlWithCacheBuster = `${gpxUrl}${gpxUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;

        cleanup(); // Ensure clean state before loading

        // @ts-ignore - leaflet-gpx types might be missing
        const gpx = new L.GPX(urlWithCacheBuster, {
            async: true,
            markers: {
                startIcon: null,
                endIcon: null,
                wptIcons: {}
            },
            polyline_options: {
                color: '#2ecc71',
                opacity: 0.8,
                weight: 5,
                lineCap: 'round'
            }
        }).on('loaded', (e: any) => {
            const gpxLayer = e.target;
            map.fitBounds(gpxLayer.getBounds(), { padding: [50, 50] });

            // Manually find start and end points by inspecting layers
            let startPoint: L.LatLng | null = null;
            let endPoint: L.LatLng | null = null;

            gpxLayer.eachLayer((layer: any) => {
                if (layer instanceof L.Polyline) {
                    const latlngs = layer.getLatLngs();
                    if (latlngs.length > 0) {
                        // Handle nested arrays (multi-polyline)
                        const points = Array.isArray(latlngs[0]) ? (latlngs as any).flat(Infinity) : latlngs;

                        if (points.length > 0) {
                            if (!startPoint) startPoint = points[0];
                            endPoint = points[points.length - 1];
                        }
                    }
                }
            });

            if (startPoint) {
                const startMarker = L.marker(startPoint, { icon: StartIcon }).addTo(map);
                startMarker.bindPopup(`<b>Início</b><br/>${track.label || 'Trilha'}`);
                markersRef.current.push(startMarker);
            }

            if (endPoint) {
                const endMarker = L.marker(endPoint, { icon: EndIcon }).addTo(map);
                endMarker.bindPopup(`<b>Fim</b><br/>${track.label || 'Trilha'}`);
                markersRef.current.push(endMarker);
            }

            onLoaded();
        }).addTo(map);

        gpxLayerRef.current = gpx;

        return cleanup;
    }, [track, map, onLoaded]);

    return null;
};

// Component to handle map view updates when NO GPX is available
const MapCentering = ({ center, hasGpx }: { center: [number, number], hasGpx: boolean }) => {
    const map = useMap();
    useEffect(() => {
        // Only center manually if there is no GPX to fit bounds to
        if (!hasGpx) {
            map.setView(center, 13, { animate: true });
        }
    }, [center, hasGpx, map]);
    return null;
};

interface InteractiveMapProps {
    tracks: Track[];
}

export function InteractiveMap({ tracks }: InteractiveMapProps) {
    const [selectedTrackIndex, setSelectedTrackIndex] = useState<number>(0);
    const [isGpxLoading, setIsGpxLoading] = useState(false);

    const selectedTrack = tracks[selectedTrackIndex];
    const hasGpx = !!(selectedTrack?.gpx || selectedTrack?.url);

    const handleNext = () => {
        setSelectedTrackIndex((prev) => (prev + 1) % tracks.length);
        if (tracks[(selectedTrackIndex + 1) % tracks.length].gpx || tracks[(selectedTrackIndex + 1) % tracks.length].url) {
            setIsGpxLoading(true);
        }
    };

    const handlePrev = () => {
        const newIndex = (selectedTrackIndex - 1 + tracks.length) % tracks.length;
        setSelectedTrackIndex(newIndex);
        if (tracks[newIndex].gpx || tracks[newIndex].url) {
            setIsGpxLoading(true);
        }
    };

    const handleMarkerClick = (index: number) => {
        setSelectedTrackIndex(index);
        if (tracks[index].gpx || tracks[index].url) {
            setIsGpxLoading(true);
        }
    };

    // Default center (Maricá)
    const defaultCenter: [number, number] = [-22.9194, -42.8186];

    // Determine center based on selected track
    const center = selectedTrack?.pos
        ? [selectedTrack.pos[0], selectedTrack.pos[1]] as [number, number]
        : defaultCenter;

    return (
        <MapSection>
            <MapWrapper>
                <MapContainer
                    center={center}
                    zoom={13}
                    scrollWheelZoom={false}
                >
                    {/* CartoDB Voyager Tiles - Clean & Premium */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />

                    {/* Render all track start markers */}
                    {tracks.map((track, index) => (
                        track.pos && (
                            <Marker
                                key={track.id}
                                position={[track.pos[0], track.pos[1]]}
                                icon={DifficultyIcon(track.difficulty || '')}
                                eventHandlers={{
                                    click: () => handleMarkerClick(index)
                                }}
                            >
                                <Popup>
                                    <PopupContent>
                                        <PopupTitle>{track.label || track.title}</PopupTitle>
                                        <PopupDesc>{track.description || track.descricao}</PopupDesc>
                                        <PopupStats>
                                            <div><FaMountain /> <span>{track.distance}m</span></div>
                                            <div><FaClock /> <span>{track.duration}min</span></div>
                                        </PopupStats>
                                    </PopupContent>
                                </Popup>
                            </Marker>
                        )
                    ))}

                    {/* GPX Layer for selected track */}
                    <GPXLayer
                        track={selectedTrack}
                        onLoaded={() => setIsGpxLoading(false)}
                    />

                    {/* Helper to update view when center changes (only if no GPX) */}
                    <MapCentering center={center} hasGpx={hasGpx} />

                </MapContainer>

                {/* Floating Navigation Control */}
                <FloatingNav>
                    <NavButton onClick={handlePrev} aria-label="Trilha Anterior">
                        <FaChevronLeft />
                    </NavButton>

                    <TrailInfo>
                        <TrailName>
                            {selectedTrack?.label || selectedTrack?.title || 'Selecione uma trilha'}
                        </TrailName>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '4px' }}>
                            <TrailDifficulty $level={selectedTrack?.difficulty || ''}>
                                {selectedTrack?.difficulty || 'Nível N/A'}
                            </TrailDifficulty>
                            <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <FaMountain size={12} color="var(--verde-medio)" />
                                {selectedTrack?.distance ? `${selectedTrack.distance}m` : 'N/A'}
                            </span>
                            {isGpxLoading && <LoadingSpinner />}
                        </div>
                    </TrailInfo>

                    <NavButton onClick={handleNext} aria-label="Próxima Trilha">
                        <FaChevronRight />
                    </NavButton>
                </FloatingNav>

                <WeatherWidget />

            </MapWrapper>
        </MapSection>
    );
}

