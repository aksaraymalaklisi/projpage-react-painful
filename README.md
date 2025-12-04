# Painful - Aplicação de Trilhas

Uma aplicação moderna em React 19 + TypeScript para exibir e gerenciar trilhas de caminhada em Maricá, Rio de Janeiro.

## Funcionalidades

- 🗺️ Mapas interativos com visualização de trilhas GPX
- 🤖 Chatbot com IA para assistência e informações sobre trilhas
- 🔐 Autenticação de usuário segura e perfis
- 🎠 Carrossel 3D para exibição de trilhas
- 🌤️ Integração com previsão do tempo (Removido)
- ⭐ Sistema de favoritos
- 👥 Funcionalidades de comunidade

## Tecnologias Utilizadas

- **React 19.2.0** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Vite 7.2.4** - Ferramenta de build
- **React Router** - Roteamento
- **Styled Components** - Estilização CSS-in-JS
- **Leaflet & React Leaflet** - Mapas interativos
- **React Markdown** - Renderização de mensagens do bot
- **React Icons** - Ícones vetoriais

## Como instalar

### Pré-requisitos

- Node.js 18+ e npm

### Instalação

1. Instale as dependências:
```bash
npm install
```

2. Crie um arquivo `.env` (copie do `.env.example`):
```bash
cp .env.example .env
```

3. Atualize o arquivo `.env` com suas chaves de API:
```
VITE_API_BASE_URL=https://painful.aksaraymalaklisi.net/api/
```

### Desenvolvimento

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou a porta definida pelo Vite).

### Build

Compilar para produção:
```bash
npm run build
```

Visualizar o build de produção:
```bash
npm run preview
```

## Estrutura do Projeto

```
src/
├── components/     # Componentes de UI reutilizáveis (incluindo Chatbot)
├── pages/         # Componentes de página (Login, Register, Home, etc.)
├── hooks/         # Hooks customizados do React
├── services/     # Serviços de API e clientes
├── context/       # Contextos do React (AuthContext)
├── types/         # Definições de tipos TypeScript
├── utils/         # Funções utilitárias
├── styles/        # Estilos globais
└── assets/        # Ativos estáticos
```

## Integração com API e Chatbot

A aplicação utiliza um cliente de API centralizado (`src/services/api.ts`) que gerencia:
- Tokens de autenticação (JWT)
- Refresh automático de tokens
- Interceptação de erros

### Chatbot
O Chatbot conecta-se via WebSocket para fornecer assistência em tempo real. Ele requer que o usuário esteja logado para ser acessado.

## Variáveis de Ambiente

- `VITE_API_BASE_URL` - URL base da API Backend
- `VITE_ENV` - Modo do ambiente (development/production)
