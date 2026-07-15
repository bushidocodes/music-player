#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../server/db/db.js';
import { parsePlist } from './plist.js';
import '../server/db/models/index.js'; // Init the relations
import { program } from 'commander';
import log from './log.js';

// Polyfill for Bluebird's Promise.props(): resolves an object's promise values.
// pragmatic any: resolves a heterogeneous map of (possibly-promise) DB values
function promiseProps(obj: Record<string, any>): Promise<Record<string, any>> {
  const keys = Object.keys(obj);
  return Promise.all(keys.map((k) => obj[k])).then((vals) =>
    Object.fromEntries(keys.map((k, i) => [k, vals[i]]))
  );
}

const KEY = Symbol('key');
const DEFAULT_TRACK_LIMIT = 500;

const counts = { total: 0, skipped: 0, seeding: 0, seeded: 0 };
let progressInterval: ReturnType<typeof setInterval> | null = null;

function startProgress() {
  progressInterval = setInterval(() => {
    process.stdout.write(
      `\rXML tracks — total: ${counts.total}  skipped: ${counts.skipped}  seeding: ${counts.seeding}  seeded: ${counts.seeded}  `
    );
  }, 125);
}

function stopProgress() {
  clearInterval(progressInterval as ReturnType<typeof setInterval>);
  process.stdout.write('\n');
}

program
  .usage('[options]')
  .description(
    "Seeds the juke database with metadata from Juke's bundled music.xml library."
  )
  .option('-f, --force', 'Force sync (will delete everything in the db)')
  .option(
    '-L, --limit <num>',
    `Limit total tracks imported to <num> (default ${DEFAULT_TRACK_LIMIT})`,
    parseInt
  )
  .option('-u, --unlimited', 'Import unlimited tracks');

let trackLimit: number;

function main() {
  program.parse(process.argv);
  const opts = program.opts();

  trackLimit = opts.unlimited ? Infinity : opts.limit || DEFAULT_TRACK_LIMIT;
  startProgress();

  db.sync({ force: opts.force })
    .then(() =>
      importLibrary(
        path.resolve(
          path.dirname(fileURLToPath(import.meta.url)),
          '..',
          'music.xml'
        )
      )
    )
    .finally(() => {
      stopProgress();
      db.close(); // else Sequelize keeps open ~10 secs, anticipating queries
    });
}

process.on('exit', () =>
  console.log(
    [Artist, Album, Song, ArtistSong]
      .map(
        (model) =>
          `${model.table}: ${model.found} found, ` +
          `${model.created} created, ` +
          `${model.errors} errors`
      )
      .join('\n')
  )
);

function importLibrary(xmlPath: string) {
  if (!xmlPath) return;

  // pragmatic any: parsePlist returns heterogeneous plist values; Tracks is a dynamic map
  const tracksById: Record<string, any> =
    (parsePlist(fs.readFileSync(xmlPath, 'utf8')) as any).Tracks || {};
  const tracks: Promise<any>[] = [];

  for (const id of Object.keys(tracksById)) {
    const data = tracksById[id];

    counts.total++;

    if (
      counts.seeding >= trackLimit ||
      !data.Location ||
      !data.Name ||
      !data.Artist ||
      !data.Album ||
      (data.Kind && data.Kind.indexOf('audio') === -1) ||
      (data.Kind && data.Kind.indexOf('Apple Lossless') !== -1) ||
      (data.Kind && data.Kind.indexOf('app') !== -1)
    ) {
      counts.skipped++;
      continue;
    }

    counts.seeding++;

    const seeding = ArtistSong({
      artistId: Artist({
        name: data.Artist || data['Album Artist'] || 'Unknown artist',
      }),
      songId: Song({
        name: data.Name,
        url: data.Location,
        genre: data.Genre,
        albumId: Album({
          name: data.Album,
          artistId: Artist({
            name: data['Album Artist'] || data.Artist || 'Unknown artist',
          }),
        }),
      }),
    });

    tracks.push(seeding);
    seeding.then(() => counts.seeded++);
  }

  return Promise.all(tracks);
}

// pragmatic any: findOrCreate is a callable that also carries mutable stat counters,
// a primaryKey/table descriptor, a KEY symbol, and an in-flight promise cache keyed
// by computed string keys — typing this precisely would require restructuring the logic.
type FindOrCreate = {
  (columnValues: Record<string, any>): Promise<any> & { [KEY]?: string };
  found: number;
  created: number;
  errors: number;
  table: string;
  primaryKey?: string[];
  [key: string]: any;
};

const Results: FindOrCreate[] = [
  'artists',
  'albums',
  'songs',
  'artistSong',
].map((table) => {
  // pragmatic any: `findOrCreate` is both a callable and a stat/cache holder;
  // the typed `FindOrCreate` alias above lets the body's self-references and
  // KEY-symbol indexing resolve without restructuring the promise chain.
  const findOrCreate = ((columnValues: Record<string, any>): any => {
    const key = keyFor(columnValues);
    if (findOrCreate[key]) {
      log.debug`cache hit for ${key}, with inner key ${findOrCreate[key][KEY]}`;
      return findOrCreate[key];
    }
    const pKeyExpr = (findOrCreate.primaryKey || ['id'])
      .map((k: string) => `"${k}"`)
      .join(',');
    var keys: string[], values: any[];
    const self: any = (findOrCreate[key] = promiseProps(columnValues)
      .then((cols) => {
        keys = Object.keys(cols);
        values = keys.map((k) => cols[k]);
        return cols;
      })
      .then(() =>
        db.query(
          `SELECT ${pKeyExpr} from "${table}"
                                       WHERE ${keys.map((col) => `"${col}"=?`).join(' AND ')}`,
          {
            replacements: values,
            type: 'SELECT' as any,
          }
        )
      )
      .then((results: any) =>
        results.length
          ? (++findOrCreate.found, results)
          : db.query(
              `INSERT INTO "${table}"
                               (${keys.map((c) => `"${c}"`).join(', ')}, "createdAt", "updatedAt")
                                 VALUES (${keys.map(() => '?')}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                                 RETURNING ${pKeyExpr}`,
              {
                replacements: values,
                type: 'SELECT' as any,
              }
            )
      )
      .then((results: any) => (++findOrCreate.created, results[0].id))
      .catch((err: any) => {
        log.error`warning: ${err.message}`;
        log.error`  in findOrCreate for ${key} into ${table}`;
        ++findOrCreate.errors;
        return null;
      }));

    self[KEY] = key;
    log.debug`added key ${self[KEY]}`;

    findOrCreate[key] = self;
    return self;
  }) as FindOrCreate;

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

// pragmatic any: keyFor recurses over arbitrary (possibly KEY-tagged) plist objects
function keyFor(obj: any): string {
  return (
    (obj && obj[KEY]) ||
    (obj &&
      typeof obj === 'object' &&
      `{${Object.keys(obj).map((k) => `${k}:${keyFor(obj[k])}`)}}`) ||
    obj + ''
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
