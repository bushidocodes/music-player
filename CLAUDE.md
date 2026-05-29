# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run seed         # Seed database with music.xml / iTunes library data
npm start            # Start dev server (Webpack watch + Nodemon on port 1337)
npm test             # Run server-side tests
npm run test:player  # Run browser/player tests
```

PostgreSQL must be running with trust auth for local connections and a role matching your OS username. See README.md for setup steps.

## Architecture

**Juke** is a full-stack music streaming app: React + Redux frontend, Express/PostgreSQL backend, bundled with Webpack 5.

### Frontend (`browser/react/`)

- **Entry**: `browser/react/index.js` — mounts React Router v6 (hash history) with Redux Provider
- **Store**: `browser/react/store.js` — Redux Toolkit `configureStore` with logger middleware
- **Pattern**: containers (smart, Redux-connected) in `containers/`, presentational components in `components/`
- **Action flow**: `action-creators/` dispatch async thunks via Axios → `reducers/` update state slices: `albums`, `artists`, `playlists`, `player`, `lyrics`, `songs`

### Backend (`server/`)

- **Entry**: `server/start.js` (Babel register) → `server/main.js` (HTTP server + Express mount)
- **Routes**: `server/app/routes/` — RESTful API at `/api/{albums,artists,songs,playlists,lyrics}`
- **Database**: Sequelize + PostgreSQL; models in `server/db/models/`
  - Song ↔ Album (many-to-one), Song ↔ Artist (many-to-many), Song ↔ Playlist (many-to-many)

### Build

Webpack 5 bundles `browser/react/index.js` → `public/bundle.js`. Uses Babel with `@babel/preset-env` + `@babel/preset-react` for both client and server code.
