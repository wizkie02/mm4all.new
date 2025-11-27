# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MM4All (Mindful Meditation For All) is a modern React meditation website with both public pages and an admin system. The project uses Vite as the build tool and includes a PHP backend API.

## Common Commands

```bash
# Development
npm run dev          # Start development server (Vite)
npm start           # Alias for npm run dev

# Building and Testing
npm run build       # Build for production
npm run preview     # Preview production build locally
npm run lint        # Run ESLint for code quality
npm run deploy      # Build and preview (combined)
```

## Architecture Overview

### Frontend Structure
- **React 19** with functional components and hooks
- **React Router v7** for navigation with nested admin routes
- **Styled Components** for all styling (no CSS files)
- **Framer Motion** + **GSAP** + **React Spring** for animations
- **TipTap** rich text editor for content management

### Key Architectural Patterns

**Dual Application Structure**: The app functions as both a public meditation website and an admin dashboard:
- Public routes: `/`, `/meditate`, `/resources`, `/about`
- Admin routes: `/admin/*` (login, dashboard, content editor)
- Admin routes are wrapped in `AuthProvider` and use `ProtectedRoute` components

**Context-Based State Management**:
- `AuthContext` handles authentication (admin-only)
- Admin authentication only initializes on admin pages to avoid unnecessary API calls

**Service Layer Architecture**:
- `src/services/apiService.js` - Main admin API service with JWT token management
- `src/services/publicApiService.js` - Public API endpoints
- `src/services/realApiService.js` - Alternative service implementation
- Backend PHP API in `/api/` directory with JWT authentication

**Component Organization**:
- Visual effects: `CursorEffect`, `BackgroundEffect`, `BreathingExercise`
- Navigation: `PageTransition`, `ScrollToTop` 
- Layout: `Navbar`, `Footer` (conditionally rendered for non-admin pages)

### Styling System

**Global Styles** (`src/styles/GlobalStyles.js`):
- CSS custom properties for consistent theming
- Lavender color palette (`--primary-color: #A09BE7`)
- Responsive typography and animations
- Custom cursor integration with conditional activation

**Key Style Patterns**:
- `.glass-effect` utility class for glassmorphism
- Conditional custom cursor (disabled on mobile, admin pages)
- Gradient variables for consistent visual hierarchy

## YouTube API Integration

The meditation library can fetch videos from YouTube using the YouTube Data API v3:
- API key stored in `.env` as `VITE_YOUTUBE_API_KEY`
- Channel handle: `@Meditationandmindfulness-4all`
- Graceful fallback to hardcoded videos when API unavailable

## Backend Integration

**PHP API** (`/api/` directory):
- JWT-based authentication system
- Role-based permissions (super_admin, admin, editor, moderator)
- CRUD operations for posts, users, categories, tags, media, comments
- File upload handling for media management

**Database Setup**: 
- SQL setup script: `setup-admin.sql`
- Database configuration in `api/utils/db.php`

## Development Notes

**Authentication Flow**:
- Admin auth only initializes on `/admin/*` routes
- Token refresh happens automatically on page load
- Persistent login via localStorage with `admin_user` key
- Permission-based route protection with `ProtectedRoute`

**Content Management**:
- TipTap editor with extensive formatting options
- Drag-and-drop file uploads
- Real-time content preview
- Media library with bulk operations

**Performance Considerations**:
- Custom cursor disabled on mobile for performance
- Conditional component rendering based on route
- Lazy loading of admin components
- Animation utilities with hardware acceleration

## Key Files to Understand

- `src/App.jsx` - Main routing and conditional rendering logic
- `src/contexts/AuthContext.jsx` - Admin authentication management
- `src/styles/GlobalStyles.js` - Complete theming system
- `src/services/apiService.js` - API communication patterns
- `api/` - Backend API structure and authentication