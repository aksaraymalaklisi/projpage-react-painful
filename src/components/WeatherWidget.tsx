import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaSun, FaCloud, FaCloudRain, FaSnowflake, FaBolt, FaSmog, FaWind, FaTint } from 'react-icons/fa';

const WidgetContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  padding: 15px 20px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  border: 1px solid rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 140px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.2);
    background: rgba(255, 255, 255, 0.95);
  }

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    padding: 10px 15px;
    min-width: auto;
  }
`;

const MainInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Temp = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--verde-escuro);
`;

const IconWrapper = styled.div`
  font-size: 1.5rem;
  color: #f39c12; // Default sunny color
  display: flex;
  align-items: center;
`;

const Details = styled.div`
  display: flex;
  gap: 12px;
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
  border-top: 1px solid rgba(0,0,0,0.05);
  padding-top: 8px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    color: var(--verde-medio);
  }
`;

const LocationName = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #888;
  font-weight: 600;
  margin-bottom: -4px;
`;

interface WeatherData {
    temperature: number;
    weathercode: number;
    windspeed: number;
}

export function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Maricá Coordinates
                const res = await fetch(
                    'https://api.open-meteo.com/v1/forecast?latitude=-22.9194&longitude=-42.8186&current_weather=true'
                );
                const data = await res.json();
                setWeather(data.current_weather);
            } catch (error) {
                console.error('Failed to fetch weather:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();

        // Refresh every 30 mins
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const getWeatherIcon = (code: number) => {
        // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
        if (code === 0) return <FaSun style={{ color: '#f39c12' }} />;
        if (code >= 1 && code <= 3) return <FaCloud style={{ color: '#95a5a6' }} />;
        if (code >= 45 && code <= 48) return <FaSmog style={{ color: '#7f8c8d' }} />;
        if (code >= 51 && code <= 67) return <FaCloudRain style={{ color: '#3498db' }} />;
        if (code >= 71 && code <= 77) return <FaSnowflake style={{ color: '#ecf0f1' }} />;
        if (code >= 80 && code <= 82) return <FaCloudRain style={{ color: '#3498db' }} />;
        if (code >= 95 && code <= 99) return <FaBolt style={{ color: '#f1c40f' }} />;
        return <FaSun />;
    };

    if (loading || !weather) return null;

    return (
        <WidgetContainer>
            <LocationName>Maricá, RJ</LocationName>
            <MainInfo>
                <IconWrapper>{getWeatherIcon(weather.weathercode)}</IconWrapper>
                <Temp>{Math.round(weather.temperature)}°C</Temp>
            </MainInfo>
            <Details>
                <DetailItem>
                    <FaWind /> {weather.windspeed}km/h
                </DetailItem>
                {/* Humidity isn't in 'current_weather' by default in basic OpenMeteo call without extra params, 
            keeping it simple or we could add hourly params. For now just wind is good for hiking. */}
            </Details>
        </WidgetContainer>
    );
}
