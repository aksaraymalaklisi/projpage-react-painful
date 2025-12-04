/**
 * Application configuration
 * Centralized configuration for API endpoints and environment variables
 * 
 * Note: In development, Vite proxy (if enabled) handles /api/* requests.
 * In production, this uses the full backend URL directly.
 */

const getApiBaseUrl = (): string => {
  // In development, if proxy is enabled, use relative URL
  // In production, always use the full backend URL
  if (import.meta.env.DEV) {
    // If you have the proxy enabled in vite.config.ts, you can use '/api/'
    // Otherwise, use the full URL
    return import.meta.env.VITE_API_BASE_URL || '/api/';
  }

  // Production: always use full URL
  return import.meta.env.VITE_API_BASE_URL || 'https://painful.aksaraymalaklisi.net/api/';
};

export const config = {
  api: {
    baseUrl: getApiBaseUrl().endsWith('/') ? getApiBaseUrl() : `${getApiBaseUrl()}/`,
  },
  env: {
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    mode: import.meta.env.MODE,
  },
} as const;
