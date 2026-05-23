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
npm install --legacy-peer-deps   # peer-dep conflict requires this flag (see below)
npm run seed                     # seed DB from music.xml (or your iTunes library)
npm start                        # webpack watch + nodemon on port 1337
```

On **Windows**, rebuild the native XML addon after install:

```bash
npm rebuild node-expat
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

This codebase was written against Node 6–8 era dependencies. The following issues were identified and fixed to run on Node 24 LTS:

| Issue | Fix | File |
|-------|-----|------|
| `redux-thunk@2.4.2` requires `redux@^4` but project uses `redux@3` | `npm install --legacy-peer-deps` | — |
| `pg-native` (`libpq`) has no prebuilt binary for Node 24 ABI | `native: false` in Sequelize config | `server/db/db.js` |
| `pg@6.x`: Node 24 changed `new net.Socket().readyState` from `'closed'` to `'open'`, causing `pg` to skip the TCP connect call and hang forever | One-line patch via `patch-package` | `patches/pg+6.4.2.patch` |
| `node-expat` shipped a non-Windows binary | `npm rebuild node-expat` | — |
| `npm run seed` pointed at a broken `bin/seed` stub | Fixed script to point at `bin/iTunesSeed.js` | `package.json` |

The `pg` patch is automatically applied by `postinstall` and survives `npm install` reruns.
