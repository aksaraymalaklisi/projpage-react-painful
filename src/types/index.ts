/**
 * TypeScript type definitions for the application
 */

// User types
export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  phone?: string;
  profile?: {
    name?: string;
    picture?: string;
  };
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password?: string;
  name?: string;
  phone?: string;
  cpf?: string;
}

// Trail types
export interface Trail {
  id: string | number;
  title: string;
  label?: string;
  description?: string;
  descricao?: string;
  image?: string;
  photo?: string;
  imageUrl?: string;
  thumbnail?: string;
  difficulty?: string;
  dificuldade?: string;
  time?: string;
  duration?: string;
  tempo?: string;
  distance?: string;
  distancia?: string;
  elevation?: string;
  routetype?: 'ida' | 'ida_volta';
  pos?: [number, number]; // [lat, lng]
  url?: string;
  gpx?: string;
  details?: string[];
  highlights?: string;
  destaques?: string;
}

export interface TrailResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: Trail[];
}

export type Track = Trail;

// Weather types
export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  tempMax: number;
  tempMin: number;
  description: string;
  tempIcon: string;
  windSpeed: number;
  humidity: number;
}

export interface ForecastDay {
  date: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  wind: number;
}

// Community types
export interface CommunitySubmission {
  name: string;
  email?: string;
  title: string;
  type: 'relato' | 'sugestao' | 'acao';
  message: string;
  created_at?: string;
}

// Rating types
export interface Rating {
  id: string | number;
  track: number;
  comment: string;
  score: number;
  user?: User;
  created_at?: string;
}

// API Error types
export interface ApiError {
  message: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string[]>;
}

