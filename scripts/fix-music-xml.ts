#!/usr/bin/env node
/**
 * Replaces dead GCS URLs in music.xml with working archive.org URLs
 * and removes the 10 Jets Overhead tracks (not archived anywhere).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const xmlPath = path.join(__dirname, '..', 'music.xml');
let xml = fs.readFileSync(xmlPath, 'utf8');

// ── Dexter Britain — Creative Commons Volume 2 ──────────────────────────────
const ccVol2Base =
  'https://archive.org/download/Creative_Commons_Volume_2-11989';
const ccVol2: [string, string][] = [
  ['01%20The%20Tea%20Party.mp3', 'Dexter_Britain_-_01_-_The_Tea_Party.mp3'],
  ['02%20After%20Christmas.mp3', 'Dexter_Britain_-_02_-_After_Christmas.mp3'],
  [
    '03%20My%20Song%20For%20January.mp3',
    'Dexter_Britain_-_03_-_My_Song_For_January.mp3',
  ],
  ['04%20Notebook%20Reading.mp3', 'Dexter_Britain_-_04_-_Notebook_Reading.mp3'],
  [
    '05%20Seeing%20The%20Future.mp3',
    'Dexter_Britain_-_05_-_Seeing_The_Future.mp3',
  ],
  ['06%20Summers%20Coming.mp3', 'Dexter_Britain_-_06_-_Summers_Coming.mp3'],
  ['07%20Nights%20Tale.mp3', 'Dexter_Britain_-_07_-_Nights_Tale.mp3'],
  [
    '08%20Leave%20Well%20Enough%20Alone%20(Instrumental).mp3',
    'Dexter_Britain_-_08_-_Leave_Well_Enough_Alone_Instrumental.mp3',
  ],
  [
    '09%20Stop%20It%20(Instrumental).mp3',
    'Dexter_Britain_-_09_-_Stop_It_Instrumental.mp3',
  ],
  [
    '10%20Waking%20Up%20(Instrumental).mp3',
    'Dexter_Britain_-_10_-_Waking_Up_Instrumental.mp3',
  ],
  [
    '11%20Wonderland%20(Instrumental).mp3',
    'Dexter_Britain_-_11_-_Wonderland_Instrumental.mp3',
  ],
  [
    "12%20After%20The%20Week%20I've%20Had.mp3",
    'Dexter_Britain_-_12_-_After_The_Week_Ive_Had.mp3',
  ],
];
const gcsDb =
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Dexter%20Britain/Creative%20Commons%20Volume%202';
for (const [oldFile, newFile] of ccVol2) {
  xml = xml.replace(`${gcsDb}/${oldFile}`, `${ccVol2Base}/${newFile}`);
}

// ── Dexter Britain — Zenith ──────────────────────────────────────────────────
const zenithBase = 'https://archive.org/download/Zenith-14876';
const zenith: [string, string][] = [
  ['01%20Shooting%20Star.mp3', 'Dexter_Britain_-_01_-_Shooting_Star.mp3'],
  [
    '02%20The%20Stars%20Are%20Out.mp3',
    'Dexter_Britain_-_02_-_The_Stars_Are_Out.mp3',
  ],
  [
    '03%20The%20Stars%20Are%20Out%20(Interlude).mp3',
    'Dexter_Britain_-_03_-_The_Stars_Are_Out_Interlude.mp3',
  ],
];
const gcsZenith =
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Dexter%20Britain/Zenith';
for (const [oldFile, newFile] of zenith) {
  xml = xml.replace(`${gcsZenith}/${oldFile}`, `${zenithBase}/${newFile}`);
}

// ── Nine Inch Nails — Ghosts I-IV (Ghosts I section, tracks 1–9) ────────────
const ghostsBase = 'https://archive.org/download/nineinchnails_ghosts_I_IV';
const ghosts: [string, string][] = [
  ['01%201%20Ghosts%20I.mp3', '01_Ghosts_I_320kb.mp3'],
  ['02%202%20Ghosts%20I.mp3', '02_Ghosts_I_320kb.mp3'],
  ['03%203%20Ghosts%20I.mp3', '03_Ghosts_I_320kb.mp3'],
  ['04%204%20Ghosts%20I.mp3', '04_Ghosts_I_320kb.mp3'],
  ['05%205%20Ghosts%20I.mp3', '05_Ghosts_I_320kb.mp3'],
  ['06%206%20Ghosts%20I.mp3', '06_Ghosts_I_320kb.mp3'],
  ['07%207%20Ghosts%20I.mp3', '07_Ghosts_I_320kb.mp3'],
  ['08%208%20Ghosts%20I.mp3', '08_Ghosts_I_320kb.mp3'],
  ['09%209%20Ghosts%20I.mp3', '09_Ghosts_I_320kb.mp3'],
];
const gcsGhosts =
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/Ghosts%20I-IV';
for (const [oldFile, newFile] of ghosts) {
  xml = xml.replace(`${gcsGhosts}/${oldFile}`, `${ghostsBase}/${newFile}`);
}

// ── Nine Inch Nails — The Slip ────────────────────────────────────────────────
const slipBase = 'https://archive.org/download/nine_inch_nails_the_slip';
const slip: [string, string][] = [
  ['01%20999,999.mp3', '01_999999.mp3'],
  ['02%201,000,000.mp3', '02_1000000.mp3'],
  ['03%20Letting%20You.mp3', '03_letting_you.mp3'],
  ['04%20Discipline.mp3', '04_discipline.mp3'],
  ['05%20Echoplex.mp3', '05_echoplex.mp3'],
  ['06%20Head%20Down.mp3', '06_head_down.mp3'],
  ['07%20Lights%20in%20the%20Sky.mp3', '07_lights_in_the_sky.mp3'],
  ['08%20Corona%20Radiata.mp3', '08_corona_radiata.mp3'],
  [
    '09%20The%20Four%20of%20Us%20are%20Dying.mp3',
    '09_the_four_of_us_are_dying.mp3',
  ],
  ['10%20Demon%20Seed.mp3', '10_demon_seed.mp3'],
];
const gcsSlip =
  'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Nine%20Inch%20Nails/The%20Slip';
for (const [oldFile, newFile] of slip) {
  xml = xml.replace(`${gcsSlip}/${oldFile}`, `${slipBase}/${newFile}`);
}

// ── Remove Jets Overhead tracks (not archived anywhere) ──────────────────────
const jetsIds: string[] = [
  '7836',
  '7839',
  '7842',
  '7845',
  '7848',
  '7851',
  '7854',
  '7857',
  '7860',
  '7863',
];
for (const id of jetsIds) {
  const re = new RegExp(
    `\\t\\t<key>${id}<\\/key>\\r?\\n\\t\\t<dict>[\\s\\S]*?\\t\\t<\\/dict>\\r?\\n`
  );
  xml = xml.replace(re, '');
}

// ── Verify no GCS URLs remain ────────────────────────────────────────────────
const remaining = (xml.match(/juke-1379\.appspot\.com/g) || []).length;
if (remaining > 0) {
  console.error(`ERROR: ${remaining} GCS URLs still present in output`);
  process.exit(1);
}

fs.writeFileSync(xmlPath, xml);

const trackCount = (xml.match(/<key>Location<\/key>/g) || []).length;
console.log(`✓ music.xml updated: ${trackCount} tracks, 0 dead GCS URLs`);
