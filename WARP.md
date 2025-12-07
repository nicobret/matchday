# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Matchday is a modern football game organizer with a monorepo structure containing:
- **Web application** (`webapp/`): React + Vite frontend with TypeScript
- **Mobile application** (`matchday-mobile/`): React Native Expo app
- **Shared types** (`shared/`): TypeScript type definitions, primarily Supabase database schema

The application uses Supabase as its backend service for authentication, database, and storage.

## Development Commands

### Web Application (`webapp/`)

```bash
# Navigate to webapp directory
cd webapp

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Format code with Prettier
npx prettier --write .
```

### Mobile Application (`matchday-mobile/`)

```bash
# Navigate to mobile app directory
cd matchday-mobile

# Install dependencies
npm install

# Start development server
npm start
# or
npx expo start

# Run on specific platform
npm run android
npm run ios
npm run web

# Lint code
npm run lint

# Reset project structure (removes example code)
npm run reset-project
```

### Testing Individual Components

The web app uses lazy loading for major scenes. To test specific features:

```bash
# Run webapp dev server and navigate to:
# /auth/* - Authentication flows
# /account - User profile management
# /club/:id - Club management and statistics
# /game/* - Game creation and management
# /player/* - Player statistics and management
```

## Code Architecture

### Monorepo Structure

The repository follows a monorepo pattern with clear separation between platforms:

- `webapp/`: Vite-based React web application
- `matchday-mobile/`: Expo React Native mobile application  
- `shared/`: Common TypeScript types and interfaces

### Web Application Architecture

**Technology Stack:**
- **Build Tool**: Vite with SWC for fast compilation
- **Framework**: React 19 with TypeScript
- **Routing**: Wouter (lightweight router)
- **State Management**: TanStack React Query for server state
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Forms**: React Hook Form with validation
- **Authentication**: Supabase Auth with custom provider
- **Database**: Supabase PostgreSQL with auto-generated TypeScript types

**Directory Structure:**
```
webapp/src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── [other].tsx     # App-specific components
├── scenes/             # Page-level components (lazy loaded)
│   ├── auth/           # Authentication flows
│   ├── club/           # Club management
│   ├── game/           # Game management
│   ├── player/         # Player management
│   └── account/        # User account management
├── lib/                # Business logic and services
│   ├── auth/           # Authentication utilities
│   ├── club/           # Club-related services and hooks
│   ├── game/           # Game-related services and hooks
│   ├── player/         # Player-related services and hooks
│   └── [domain]/       # Domain-specific logic
└── hooks/              # Custom React hooks
```

**Key Architectural Patterns:**

1. **Repository Pattern**: Each domain (`club/`, `game/`, `player/`) contains:
   - `*.repository.ts` - Direct Supabase client interactions
   - `*.service.ts` - Business logic layer
   - `use*.ts` - React Query hooks for components

2. **Scene-based Routing**: Major application areas are lazy-loaded as "scenes"
   - Improves initial bundle size
   - Clear separation of concerns
   - Nested routing within scenes (e.g., `/club/:id/*`)

3. **Shared Type Safety**: 
   - Auto-generated Supabase types in `shared/types/supabase.ts`
   - Consistent type definitions across web and mobile apps
   - TypeScript path aliases (`@/*` for src, `shared/*` for shared types)

### Mobile Application Architecture

**Technology Stack:**
- **Framework**: Expo SDK 53+ with React Native 0.79
- **Navigation**: Expo Router with file-based routing
- **UI**: React Native components with Expo UI elements
- **Development**: TypeScript with strict mode enabled

**Key Features:**
- File-based routing system
- Cross-platform compatibility (iOS, Android, Web)
- Expo development build support
- Automatic icon and splash screen generation

### Database Schema

The application uses Supabase with the following core entities:

- **`users`**: User profiles and preferences
- **`clubs`**: Football club information
- **`club_member`**: Club membership relationships with roles
- **`games`**: Match/training session data
- **`game_player`**: Player participation and statistics
- **`season`**: Seasonal organization of games
- **`notification`**: In-app notification system

**Key Relationships:**
- Clubs have many members and games
- Games belong to clubs and seasons
- Players participate in games with tracked statistics
- Users can be members of multiple clubs with different roles

### Development Patterns

1. **Error Handling**: React Error Boundaries for graceful failures
2. **Loading States**: Suspense with lazy loading for improved UX  
3. **State Management**: React Query for server state, local state for UI
4. **Form Validation**: React Hook Form with schema validation
5. **Type Safety**: Full TypeScript coverage with strict mode
6. **Code Formatting**: Prettier with Tailwind CSS plugin

## Important Notes

- The webapp uses React 19 with advanced features like Suspense and concurrent rendering
- Both applications share the same Supabase project and type definitions
- Path aliases are configured consistently across both apps (`@/*` for local imports)
- The mobile app uses Expo's new architecture and typed routes
- Database types are auto-generated and should not be manually edited