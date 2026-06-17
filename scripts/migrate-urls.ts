#!/usr/bin/env node
/**
 * Updates song URLs in the database from dead GCS links to archive.org,
 * and deletes the Jets Overhead tracks (not available on archive.org).
 * Run once after merging fix-sample-media.
 */

import db from '../server/db/db.js';

const urlMap: Record<string, string> = {
  // ── Dexter Britain — Creative Commons Volume 2 ──────────────────────────
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Dexter%20Britain/Creative%20Commons%20Volume%202/01%20The%20Tea%20Party.mp3':
    'https://archive.org/download/Creative_Commons_Volume_2-11989/Dexter_Britain_-_01_-_The_Tea_Party.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Dexter%20Britain/Creative%20Commons%20Volume%202/02%20After%20Christmas.mp3':
    'https://archive.org/download/Creative_Commons_Volume_2-11989/Dexter_Britain_-_02_-_After_Christmas.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Dexter%20Britain/Creative%20Commons%20Volume%202/03%20My%20Song%20For%20January.mp3':
    'https://archive.org/download/Creative_Commons_Volume_2-11989/Dexter_Britain_-_03_-_My_Song_For_January.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Dexter%20Britain/Creative%20Commons%20Volume%202/04%20Notebook%20Reading.mp3':
    'https://archive.org/download/Creative_Commons_Volume_2-11989/Dexter_Britain_-_04_-_Notebook_Reading.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Dexter%20Britain/Creative%20Commons%20Volume%202/05%20Seeing%20The%20Future.mp3':
    'https://archive.org/download/Creative_Commons_Volume_2-11989/Dexter_Britain_-_05_-_Seeing_The_Future.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Dexter%20Britain/Creative%20Commons%20Volume%202/06%20Summers%20Coming.mp3':
    'https://archive.org/download/Creative_Commons_Volume_2-11989/Dexter_Britain_-_06_-_Summers_Coming.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Dexter%20Britain/Creative%20Commons%20Volume%202/07%20Nights%20Tale.mp3':
    'https://archive.org/download/Creative_Commons_Volume_2-11989/Dexter_Britain_-_07_-_Nights_Tale.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Dexter%20Britain/Creative%20Commons%20Volume%202/08%20Leave%20Well%20Enough%20Alone%20(Instrumental).mp3':
    'https://archive.org/download/Creative_Commons_Volume_2-11989/Dexter_Britain_-_08_-_Leave_Well_Enough_Alone_Instrumental.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Dexter%20Britain/Creative%20Commons%20Volume%202/09%20Stop%20It%20(Instrumental).mp3':
    'https://archive.org/download/Creative_Commons_Volume_2-11989/Dexter_Britain_-_09_-_Stop_It_Instrumental.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Dexter%20Britain/Creative%20Commons%20Volume%202/10%20Waking%20Up%20(Instrumental).mp3':
    'https://archive.org/download/Creative_Commons_Volume_2-11989/Dexter_Britain_-_10_-_Waking_Up_Instrumental.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Dexter%20Britain/Creative%20Commons%20Volume%202/11%20Wonderland%20(Instrumental).mp3':
    'https://archive.org/download/Creative_Commons_Volume_2-11989/Dexter_Britain_-_11_-_Wonderland_Instrumental.mp3',
  "https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Dexter%20Britain/Creative%20Commons%20Volume%202/12%20After%20The%20Week%20I've%20Had.mp3":
    'https://archive.org/download/Creative_Commons_Volume_2-11989/Dexter_Britain_-_12_-_After_The_Week_Ive_Had.mp3',

  // ── Dexter Britain — Zenith ──────────────────────────────────────────────
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Dexter%20Britain/Zenith/01%20Shooting%20Star.mp3':
    'https://archive.org/download/Zenith-14876/Dexter_Britain_-_01_-_Shooting_Star.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Dexter%20Britain/Zenith/02%20The%20Stars%20Are%20Out.mp3':
    'https://archive.org/download/Zenith-14876/Dexter_Britain_-_02_-_The_Stars_Are_Out.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Dexter%20Britain/Zenith/03%20The%20Stars%20Are%20Out%20(Interlude).mp3':
    'https://archive.org/download/Zenith-14876/Dexter_Britain_-_03_-_The_Stars_Are_Out_Interlude.mp3',

  // ── Nine Inch Nails — Ghosts I-IV ────────────────────────────────────────
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/Ghosts%20I-IV/01%201%20Ghosts%20I.mp3':
    'https://archive.org/download/nineinchnails_ghosts_I_IV/01_Ghosts_I_320kb.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/Ghosts%20I-IV/02%202%20Ghosts%20I.mp3':
    'https://archive.org/download/nineinchnails_ghosts_I_IV/02_Ghosts_I_320kb.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/Ghosts%20I-IV/03%203%20Ghosts%20I.mp3':
    'https://archive.org/download/nineinchnails_ghosts_I_IV/03_Ghosts_I_320kb.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/Ghosts%20I-IV/04%204%20Ghosts%20I.mp3':
    'https://archive.org/download/nineinchnails_ghosts_I_IV/04_Ghosts_I_320kb.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/Ghosts%20I-IV/05%205%20Ghosts%20I.mp3':
    'https://archive.org/download/nineinchnails_ghosts_I_IV/05_Ghosts_I_320kb.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/Ghosts%20I-IV/06%206%20Ghosts%20I.mp3':
    'https://archive.org/download/nineinchnails_ghosts_I_IV/06_Ghosts_I_320kb.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/Ghosts%20I-IV/07%207%20Ghosts%20I.mp3':
    'https://archive.org/download/nineinchnails_ghosts_I_IV/07_Ghosts_I_320kb.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/Ghosts%20I-IV/08%208%20Ghosts%20I.mp3':
    'https://archive.org/download/nineinchnails_ghosts_I_IV/08_Ghosts_I_320kb.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/Ghosts%20I-IV/09%209%20Ghosts%20I.mp3':
    'https://archive.org/download/nineinchnails_ghosts_I_IV/09_Ghosts_I_320kb.mp3',

  // ── Nine Inch Nails — The Slip ────────────────────────────────────────────
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/The%20Slip/01%20999,999.mp3':
    'https://archive.org/download/nine_inch_nails_the_slip/01_999999.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/The%20Slip/02%201,000,000.mp3':
    'https://archive.org/download/nine_inch_nails_the_slip/02_1000000.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/The%20Slip/03%20Letting%20You.mp3':
    'https://archive.org/download/nine_inch_nails_the_slip/03_letting_you.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/The%20Slip/04%20Discipline.mp3':
    'https://archive.org/download/nine_inch_nails_the_slip/04_discipline.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/The%20Slip/05%20Echoplex.mp3':
    'https://archive.org/download/nine_inch_nails_the_slip/05_echoplex.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/The%20Slip/06%20Head%20Down.mp3':
    'https://archive.org/download/nine_inch_nails_the_slip/06_head_down.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/The%20Slip/07%20Lights%20in%20the%20Sky.mp3':
    'https://archive.org/download/nine_inch_nails_the_slip/07_lights_in_the_sky.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/The%20Slip/08%20Corona%20Radiata.mp3':
    'https://archive.org/download/nine_inch_nails_the_slip/08_corona_radiata.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/The%20Slip/09%20The%20Four%20of%20Us%20are%20Dying.mp3':
    'https://archive.org/download/nine_inch_nails_the_slip/09_the_four_of_us_are_dying.mp3',
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/The%20Slip/10%20Demon%20Seed.mp3':
    'https://archive.org/download/nine_inch_nails_the_slip/10_demon_seed.mp3',
};

async function run() {
  let updated = 0, deleted = 0, notFound = 0;

  for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
    // pragmatic any: db.query returns [result, metadata]; result shape is driver-specific
    const [result] = (await db.query(
      `UPDATE songs SET url = :newUrl, "updatedAt" = NOW() WHERE url = :oldUrl`,
      { replacements: { oldUrl, newUrl } }
    )) as unknown as [{ rowCount: number }, unknown];
    if (result.rowCount > 0) updated++;
    else notFound++;
  }

  // pragmatic any: db.query returns [result, metadata]; result shape is driver-specific
  const [delResult] = (await db.query(
    `DELETE FROM songs WHERE url LIKE '%juke-1379.appspot.com%Jets%Overhead%'`
  )) as unknown as [{ rowCount: number }, unknown];
  deleted = delResult.rowCount;

  await db.query(`
    DELETE FROM artists WHERE id NOT IN (
      SELECT DISTINCT "artistId" FROM "artistSong"
    )
  `);
  await db.query(`
    DELETE FROM albums WHERE id NOT IN (
      SELECT DISTINCT "albumId" FROM songs WHERE "albumId" IS NOT NULL
    )
  `);

  // pragmatic any: COUNT(*) row shape is driver-specific
  const [[{ count }]] = (await db.query(`SELECT COUNT(*) as count FROM songs`)) as [
    Array<{ count: string }>,
    unknown,
  ];
  console.log(`✓ Updated ${updated} URLs, deleted ${deleted} Jets Overhead songs`);
  if (notFound) console.log(`  (${notFound} old URLs not found — already updated or missing)`);
  console.log(`  ${count} songs remain in database`);
  db.close();
}

// pragmatic any: preserve original `err.message` access without altering runtime behavior
run().catch((err: any) => { console.error(err.message); db.close(); process.exit(1); });
