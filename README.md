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
npm install      # install dependencies
npm run seed     # seed DB from music.xml (or your iTunes library)
npm start        # webpack watch + nodemon on port 1337
```

## Commands

| Command | Description |
|---------|-------------|
| `npm start` | Webpack watch + Nodemon dev server on port 1337 |
| `npm run seed` | Seed database from `music.xml` / iTunes library |
| `npm run seed -- --force` | Re-seed, dropping existing data |
| `npm run seed -- --unlimited` | Import full iTunes library (default cap: 500 tracks) |
| `npm test` | Server-side Mocha tests |
| `npm run test:player` | Browser/player tests via Testem |

## Node 24 compatibility

Dependencies have been updated to modern versions (`pg@8`, `@reduxjs/toolkit`, `react-router-dom@6`, `webpack@5`) that run on Node 24 LTS without patches or workarounds. A plain `npm install` is sufficient.
