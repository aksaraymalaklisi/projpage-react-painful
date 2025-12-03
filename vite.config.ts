import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // DEV ONLY: Proxy is only active during `npm run dev`
    // This does NOT affect production builds - production uses direct API calls
    // Uncomment if you need to bypass CORS in development
    proxy: {
      '/api': {
        target: 'https://painful.aksaraymalaklisi.net',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  // Base path for GitHub Pages deployment (if needed)
  // base: '/projpage-react-painful/',
});
