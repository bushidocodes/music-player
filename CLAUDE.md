# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run seed         # Seed database with music.xml / iTunes library data
npm start            # Dev server: Vite (:3000) + tsx-watched API (:1337)
npm test             # Run server-side tests (Vitest)
npm run typecheck    # Type-check both the browser and server TS projects
npm run lint         # Biome (lint + format check)
npm run build        # Production build (Vite → public/)
```

PostgreSQL must be running with trust auth for local connections and a role matching your OS username. See README.md for setup steps.

## Architecture

**Juke** is a full-stack **TypeScript** music streaming app: React + Redux frontend, Express/PostgreSQL backend, built with Vite.

### Frontend (`browser/react/`)

- **Entry**: `browser/react/index.tsx` — mounts React Router v6 (hash history) with Redux Provider
- **Store**: `browser/react/store.ts` — Redux Toolkit `configureStore`; exports `RootState` / `AppDispatch` / `AppThunk`. Pre-typed hooks live in `hooks.ts`; shared domain entities, state slices, and the action union are in `types.ts`.
- **Pattern**: containers (smart, Redux-connected via `useAppSelector` / `useAppDispatch`) in `containers/`, presentational components in `components/`
- **Action flow**: `action-creators/` dispatch async thunks (client uses `fetch` via `apiFetch`) → `reducers/` update state slices: `albums`, `artists`, `playlists`, `player`, `lyrics`, `songs`

### Backend (`server/`)

- **Entry**: `server/start.ts` → `server/main.ts` (HTTP server + Express mount). Run directly from `.ts` via `tsx` — no build step.
- **Routes**: `server/app/routes/` — RESTful API at `/api/{albums,artists,songs,playlists,lyrics}`. Route factories receive a Sequelize model typed via the structural `*Repository` interfaces in `db/models/types.ts`.
- **Database**: Sequelize + PostgreSQL; models in `server/db/models/`
  - Song ↔ Album (many-to-one), Song ↔ Artist (many-to-many), Song ↔ Playlist (many-to-many)
- The rows attached to `req` by the param handlers (`req.album` / `req.song` / `req.artist` / `req.playlist`) are declared in `server/types/express.d.ts`.

### TypeScript / Build

- Vite bundles `browser/react/index.tsx` → `public/` (hashed assets, served statically by Express). The server runs directly from `.ts` via `tsx`, so there is no separate server build step.
- Two strict `tsconfig`s share `tsconfig.base.json`: the root `tsconfig.json` covers the Node side (`server/`, `bin/`, `scripts/`, NodeNext resolution — keep `.js` import specifiers), and `browser/tsconfig.json` covers the DOM/bundler side (`browser/react/`). `npm run typecheck` runs both. Test files (`*.test.ts`) are excluded from the strict typecheck and run under Vitest.
