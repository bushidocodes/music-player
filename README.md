# Juke

A full-stack music streaming app built at Fullstack Academy. React + Redux frontend, Express/PostgreSQL backend.

## Prerequisites

- **Node.js** v24 LTS (see [Node 24 compatibility notes](#node-24-compatibility) below)
- **PostgreSQL** 14+ running locally

### PostgreSQL setup (local dev)

Install PostgreSQL (e.g. `winget install PostgreSQL.PostgreSQL.17` on Windows, `brew install postgresql` on macOS) then configure it for passwordless local connections by setting the auth method to `trust` in `pg_hba.conf`. Create the database and a role matching your OS username:

```bash
psql -U postgres -c "CREATE DATABASE juke;"
psql -U postgres -c "CREATE ROLE <your-username> WITH LOGIN SUPERUSER;"
```

## Setup

```bash
npm install          # install dependencies
npm run db-init      # create the juke PostgreSQL database (one-time)
npm run seed         # seed DB from the bundled music.xml library
npm start            # Vite (:3000) + tsx-watched API (:1337)
```

## Commands

| Command | Description |
|---------|-------------|
| `npm start` | Vite dev server (:3000) + tsx-watched API (:1337) |
| `npm run db-init` | Create the juke PostgreSQL database (one-time setup) |
| `npm run seed` | Seed database from the bundled `music.xml` library |
| `npm run seed -- --force` | Re-seed, dropping existing data |
| `npm run seed -- --unlimited` | Import all tracks from `music.xml` (default cap: 500 tracks) |
| `npm test` | Server-side tests (Vitest) |
| `npm run typecheck` | Type-check the browser and server TypeScript projects |
| `npm run build` | Production build (Vite → `public/`) |

## Node 24 compatibility

The codebase is written in TypeScript, bundled with Vite, and tested with Vitest, on modern dependencies (`pg@8`, `@reduxjs/toolkit`, `react-router-dom@6`) that run on Node 24 LTS without patches or workarounds. The server runs directly from TypeScript via `tsx`.
