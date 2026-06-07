'use strict';

const express = require('express');
const router = express.Router();
const http = require('http');
const https = require('https');
const { PassThrough } = require('stream');
const models = require('../../db/models');
const Song = models.Song;
const mm = require('music-metadata');
const fs = require('fs');

module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const songs = await Song.scope('defaultScope', 'populated').findAll();
    res.json(songs);
  } catch (err) {
    next(err);
  }
});

router.param('songId', async (req, res, next, id) => {
  try {
    const song = await Song.scope('defaultScope', 'populated').findByPk(id);
    if (!song) {
      const err = new Error('Song not found');
      err.status = 404;
      return next(err);
    }
    req.song = song;
    next();
  } catch (err) {
    next(err);
  }
});

router.get('/:songId', (req, res) => res.json(req.song));

// Opens a URL as a readable stream, following HTTP redirects.
function open(url) {
  const parsed = new URL(url);
  if (parsed.protocol === 'file:') {
    return fs.createReadStream(decodeURIComponent(parsed.pathname));
  }
  const pass = new PassThrough();
  function fetch(currentUrl) {
    const get = currentUrl.startsWith('https:') ? https.get : http.get;
    get(currentUrl, response => {
      const { statusCode, headers } = response;
      if (statusCode >= 300 && statusCode < 400 && headers.location) {
        response.resume(); // drain and discard the redirect body
        fetch(headers.location);
      } else {
        response.pipe(pass);
      }
    }).on('error', err => pass.destroy(err));
  }
  fetch(url);
  return pass;
}

router.get('/:songId/image', async (req, res, next) => {
  const stream = open(req.song.url);
  try {
    const metadata = await mm.parseStream(stream, undefined, { duration: false });
    stream.destroy(); // stop downloading once ID3 header is parsed
    const pic = metadata.common.picture?.[0];
    pic
      ? res.set('Content-Type', pic.format).send(Buffer.from(pic.data))
      : res.redirect('/default-album.jpg');
  } catch (err) {
    stream.destroy();
    next(err);
  }
});

router.get('/:songId/audio', (req, res) => {
  const parsedUrl = new URL(req.song.url);
  parsedUrl.protocol === 'file:'
    ? res.sendFile(decodeURIComponent(parsedUrl.pathname))
    : res.redirect(req.song.url);
});
