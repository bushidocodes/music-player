#!/usr/bin/env node

import { fileURLToPath } from 'url';
import status from 'node-status';
import path from 'path';
import fs from 'fs';
import { parsePlist } from './plist.js';
import db from '../server/db/db.js';
import '../server/db/models/index.js'; // Init the relations
import log from './log.js';
import { program } from 'commander';

// Polyfill for Bluebird's Promise.props(): resolves an object's promise values.
function promiseProps(obj) {
  const keys = Object.keys(obj);
  return Promise.all(keys.map(k => obj[k]))
    .then(vals => Object.fromEntries(keys.map((k, i) => [k, vals[i]])));
}

const KEY = Symbol('key');
const TRACKS = Symbol('TRACKS');
const DEFAULT_TRACK_LIMIT = 500;

program
  .usage('[options]')
  .description("Seeds the juke database with metadata from Juke's bundled music.xml library.")
  .option('-f, --force', 'Force sync (will delete everything in the db)')
  .option('-L, --limit <num>', `Limit total tracks imported to <num> (default ${DEFAULT_TRACK_LIMIT})`, parseInt)
  .option('-u, --unlimited', 'Import unlimited tracks');

function main() {
  program.parse(process.argv);
  const opts = program.opts();

  status[TRACKS] = {
    total: status.addItem('total', {color: 'magenta'}),
    skipped: status.addItem('skipped', {color: 'yellow'}),
    seeding: status.addItem('seeding', {color: 'green'}),
    seeded: status.addItem('seeded', {color: 'blue'})
  };
  status.start({ label: 'XML tracks', invert: false, interval: 125 });

  program[TRACKS] = opts.unlimited ? Infinity : opts.limit || DEFAULT_TRACK_LIMIT;

  db.sync({ force: opts.force })
    .then(() => importLibrary(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'music.xml')))
    .finally(() => {
      status.stop();
      db.close(); // else Sequelize keeps open ~10 secs, anticipating queries
    });
}

process.on('exit', bye =>
           console.log(
             [Artist, Album, Song, ArtistSong].map(
               model =>
                 `${model.table}: ${model.found} found, ` +
                 `${model.created} created, ` +
                 `${model.errors} errors`)
               .join('\n')
           ));

function importLibrary(xmlPath) {
  if (!xmlPath) return;

  const tracksById = parsePlist(fs.readFileSync(xmlPath, 'utf8')).Tracks || {};
  const tracks = [];

  for (const id of Object.keys(tracksById)) {
    const data = tracksById[id];

    status[TRACKS].total.inc(1);

    if (
      (status[TRACKS].seeding.count >= program[TRACKS]) ||
      !data.Location ||
      !data.Name ||
      !data.Artist ||
      !data.Album ||
      (data.Kind && data.Kind.indexOf('audio') === -1) ||
      (data.Kind && data.Kind.indexOf('Apple Lossless') !== -1) ||
      (data.Kind && data.Kind.indexOf('app') !== -1)
    ) {
      status[TRACKS].skipped.inc(1);
      continue;
    }

    status[TRACKS].seeding.inc(1);

    const seeding = ArtistSong({
      artistId: Artist({name: data.Artist || data['Album Artist'] || 'Unknown artist'}),
      songId: Song({
        name: data.Name,
        url: data.Location,
        genre: data.Genre,
        albumId: Album({
          name: data.Album,
          artistId: Artist({name: data['Album Artist'] || data.Artist || 'Unknown artist'})
        }),
      })
    });

    tracks.push(seeding);
    seeding.then(() => status[TRACKS].seeded.inc(1));
  }

  return Promise.all(tracks);
}

const Results = ['artists', 'albums', 'songs', 'artistSong']
      .map(table => {
          function findOrCreate(columnValues) {
             const key = keyFor(columnValues);
             if (findOrCreate[key]) {
               log.debug `cache hit for ${key}, with inner key ${findOrCreate[key][KEY]}`;
               return findOrCreate[key];
             }
             const pKeyExpr = (findOrCreate.primaryKey || ['id']).map(k => `"${k}"`).join(',');
             var keys, values;
             let self = findOrCreate[key] = promiseProps(columnValues)
                 .then(cols => {
                   keys = Object.keys(cols);
                   values = keys.map(k => cols[k]);
                   return cols;
                 })
                 .then(row => db.query(`SELECT ${pKeyExpr} from "${table}"
                                       WHERE ${keys.map(col => `"${col}"=?`).join(' AND ')}`, {
                                         replacements: values,
                                         type: 'SELECT'
                                       }))
                 .then(results => results.length? (++findOrCreate.found, results) :
                        db.query(`INSERT INTO "${table}"
                               (${keys.map(c => `"${c}"`).join(', ')}, "createdAt", "updatedAt")
                                 VALUES (${keys.map(v => '?')}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                                 RETURNING ${pKeyExpr}`, {
                                   replacements: values,
                                   type: 'SELECT'
                                 }))
                 .then(results => (++findOrCreate.created, results[0].id))
                 .catch(err => {
                   log.error `warning: ${err.message}`;
                   log.error `  in findOrCreate for ${key} into ${table}`;
                   ++findOrCreate.errors;
                   return null;
                 });

             self[KEY] = key;
             log.debug `added key ${self[KEY]}`;

             findOrCreate[key] = self;
             return self;
           }

        findOrCreate.found = 0;
        findOrCreate.created = 0;
        findOrCreate.errors = 0;
        findOrCreate.table = table;
        return findOrCreate;
      });
const Artist = Results[0],
      Album = Results[1],
      Song = Results[2],
      ArtistSong = Results[3];

ArtistSong.primaryKey = ['artistId', 'songId'];

function keyFor(obj) {
  return obj && obj[KEY] ||
    obj && typeof obj === 'object' && `{${Object.keys(obj).map(k => `${k}:${keyFor(obj[k])}`)}}` ||
    obj + '';
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
