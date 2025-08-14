# Overview

ScrimHandler is a comprehensive esports scrim finder and team management platform designed with a Discord-inspired dark gaming theme. The application enables competitive gaming teams to find, schedule, and manage scrimmages (practice matches) while providing team profiles, rating systems, and user management capabilities. Built as a full-stack web application, it targets the esports community by offering a centralized platform for competitive team coordination and match scheduling.

# User Preferences

Preferred communication style: Simple, everyday language.
UI Color Scheme: White/black/blue only (no other colors)
Navigation: Only Scrims and Chat tabs (removed other tabs)
Features Required: Date/time selection, map filtering, MR24 game format options, multiple choice server selection

# System Architecture

## Frontend Architecture
The client-side application is built using React 18 with TypeScript for type safety and modern development practices. The UI framework leverages Tailwind CSS for styling with Shadcn UI components providing a consistent design system. Wouter handles client-side routing as a lightweight alternative to React Router, while TanStack Query manages server state and data fetching with built-in caching and synchronization. The design follows a mobile-first approach with responsive layouts optimized for both desktop and mobile gaming scenarios.

## Backend Architecture
The server-side implementation uses Express.js with TypeScript to provide a RESTful API architecture. The application follows a layered architecture pattern with clear separation between route handlers, business logic (storage layer), and data access. Authentication is handled through Replit's built-in authentication system with session management using PostgreSQL-backed sessions. The storage layer abstracts database operations through a defined interface, making the system testable and maintainable.

## Database Design
The application uses PostgreSQL as the primary database with Drizzle ORM providing type-safe database operations and schema management. The schema includes core entities for users, teams, team members, scrims, and reviews with proper foreign key relationships. Session storage is implemented using connect-pg-simple for reliable user session management. The database design supports the core workflows of team creation, scrim scheduling, and rating systems.

## State Management
Client-side state is managed through TanStack Query for server state with React's built-in state management for local UI state. The application uses query keys for efficient caching and automatic background refetching. Authentication state is managed globally through custom hooks that integrate with the Replit Auth system.

## Styling and Design System
The application implements a dark gaming theme inspired by Discord's design language, using CSS custom properties for consistent theming. Tailwind CSS provides utility-first styling with custom color variables for the gaming aesthetic (discord-darker, discord-dark, discord-accent). The component library is built on Radix UI primitives through Shadcn UI, ensuring accessibility and consistent behavior across the application.

## Build and Development Setup
The development environment uses Vite as the build tool with TypeScript configuration supporting path aliases for clean imports. The build process separates client and server builds, with the client building to a static distribution and the server bundling with esbuild. Hot module replacement is configured for efficient development workflows.

# External Dependencies

## Authentication Service
- **Replit Auth**: Integrated OAuth authentication system providing secure user login and session management
- **OpenID Connect**: Standard protocol implementation for authentication flows

## Database and ORM
- **PostgreSQL**: Primary relational database for data persistence (configured via Neon serverless)
- **Drizzle ORM**: Type-safe database operations with automatic migrations
- **@neondatabase/serverless**: Serverless PostgreSQL connection pooling

## UI Framework and Styling
- **Radix UI**: Accessible component primitives for complex UI components
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library providing consistent iconography

## Data Fetching and State Management
- **TanStack Query**: Server state management with caching and synchronization
- **Wouter**: Lightweight client-side routing library

## Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **express-session**: Session middleware for user authentication state

## Development Tools
- **Vite**: Fast build tool with hot module replacement
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast JavaScript bundler for server-side code

## Hosting Platform
- **Replit**: Full-stack hosting platform with integrated database provisioning and authentication services