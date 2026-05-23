# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install --legacy-peer-deps   # Install dependencies (flag required: redux@3/redux-thunk peer conflict)
npm run seed                     # Seed database with music.xml / iTunes library data
npm start                        # Start dev server (Webpack watch + Nodemon on port 1337)
npm test                         # Run server-side tests
npm run test:player              # Run browser/player tests
```

On **Windows**, run `npm rebuild node-expat` after install (native addon ships non-Windows binary).

PostgreSQL must be running with trust auth for local connections and a role matching your OS username. See README.md for setup steps.

## Architecture

**Juke** is a full-stack music streaming app: React + Redux frontend, Express/PostgreSQL backend, bundled with Webpack 1.

### Frontend (`browser/react/`)

- **Entry**: `browser/react/index.js` — mounts React Router (v3, hash history) and Redux Provider
- **Store**: `browser/react/store.js` — Redux with thunk + logger middleware
- **Pattern**: containers (smart, Redux-connected) in `containers/`, presentational components in `components/`
- **Action flow**: `action-creators/` dispatch async thunks via Axios → `constants.js` action types → `reducers/` update state slices: `albums`, `artists`, `playlists`, `player`, `lyrics`, `songs`

### Backend (`server/`)

- **Entry**: `server/start.js` (Babel register) → `server/main.js` (HTTP server + Express mount)
- **Routes**: `server/app/routes/` — RESTful API at `/api/{albums,artists,songs,playlists,lyrics}`
- **Database**: Sequelize + PostgreSQL; models in `server/db/models/`
  - Song ↔ Album (many-to-one), Song ↔ Artist (many-to-many), Song ↔ Playlist (many-to-many)

### Build

Webpack 1 bundles `browser/react/index.js` → `public/bundle.js`. Uses Babel with ES2015 + React presets for both client and server code.

## Node 24 compatibility patches

Three source-level fixes were applied to make this codebase run on Node 24 LTS:

1. **`server/db/db.js`** — `native: false`: disables `pg-native`, whose `libpq` C addon has no prebuilt binary for Node 24's ABI (v137).
2. **`patches/pg+6.4.2.patch`** — fixes `pg@6`'s `connection.js`: Node 24 changed `new net.Socket().readyState` from `'closed'` to `'open'`, causing `pg` to skip its TCP connect call and hang silently. The patch replaces the `readyState` check with `!stream.remoteAddress`. Applied automatically via `postinstall`.
3. **`package.json` seed script** — points at `bin/iTunesSeed.js` directly (the `bin/seed` stub was broken).
