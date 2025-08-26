# Technology Stack

## Core Technologies

- **Frontend Framework**: React 18 with TypeScript (strict mode)
- **Build Tool**: Vite 4.5+ with React plugin
- **Styling**: Tailwind CSS 3.3+ with custom design system
- **Routing**: React Router DOM 6.20+
- **Animation**: Framer Motion 10.16+
- **Charts**: Chart.js 4.4+ with React Chart.js 2

## Development Tools

- **Package Manager**: npm with package-lock.json
- **Linting**: ESLint with TypeScript and React hooks plugins
- **Formatting**: Prettier (single quotes, 100 char width, 2 spaces)
- **Testing**: Jest with jsdom environment, React Testing Library
- **Type Checking**: TypeScript 5.2+ with strict configuration

## Data Processing

- **CSV Parsing**: PapaParse 5.4+
- **Machine Learning**: Custom TypeScript implementations (no external ML libraries)

## Common Commands

```bash
# Development
npm run dev          # Start dev server on port 3000
npm run build        # TypeScript compile + Vite build
npm run preview      # Preview production build

# Code Quality
npm run lint         # ESLint check
npm run format       # Prettier formatting
npm test             # Jest test suite
npm test -- --coverage  # Test with coverage

# Production
npm run build        # Build for deployment
```

## Build Configuration

- **Output**: `dist/` directory with source maps
- **Base Path**: Relative (`./`) for flexible deployment
- **Assets**: Organized in `assets/` subdirectory
- **Dev Server**: Auto-opens browser on localhost:3000