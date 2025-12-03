# Projpage React - Hiking Trails Application

A modern React 19 + TypeScript application for displaying and managing hiking trails in Maricá, Rio de Janeiro.

## Features

- 🗺️ Interactive maps with GPX track visualization
- 🎠 3D carousel for trail display
- 🌤️ Weather integration
- 👤 User authentication and profiles
- ⭐ Favorites system
- 👥 Community features

## Tech Stack

- **React 19.2.0** - UI library
- **TypeScript** - Type safety
- **Vite 7.2.4** - Build tool
- **React Router** - Routing
- **Styled Components** - CSS-in-JS
- **Leaflet** - Interactive maps
- **React Leaflet** - React bindings for Leaflet

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update the `.env` file with your API keys:
```
VITE_API_BASE_URL=https://painful.aksaraymalaklisi.net/api/
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── services/     # API services and clients
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── styles/        # Global styles
└── assets/        # Static assets
```

## API Integration

The application uses a centralized API client (`src/services/api.ts`) that handles:
- Authentication token management
- Automatic token refresh
- Error handling
- Request/response interceptors

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_OPENWEATHER_API_KEY` - OpenWeatherMap API key
- `VITE_ENV` - Environment mode (development/production)

## License

MIT
