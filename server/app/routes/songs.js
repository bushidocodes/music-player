'use strict';

const express = require('express');
const router = express.Router();
const http = require('http');
const https = require('https');
const { PassThrough } = require('stream');
const models = require('../../db/models');
const Song = models.Song;
const mm = require('music-metadata');
const fs = require('fs')

module.exports = router;

router.get('/', function (req, res, next) {
  Song.scope('defaultScope', 'populated').findAll()
  .then(songs => res.json(songs))
  .catch(next);
});

router.param('songId', function (req, res, next, id) {
  Song.scope('defaultScope', 'populated').findByPk(id)
  .then(song => {
    if (!song) {
      const err = Error('Song not found');
      err.status = 404;
      throw err
    }
    req.song = song;
    next();
    return null; // silences bluebird warning about promises inside of next
  })
  .catch(next);
});

router.get('/:songId', function (req, res) {
  res.json(req.song);
});

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

router.get('/:songId/image', function (req, res, next) {
  const stream = open(req.song.url);
  mm.parseStream(stream, undefined, { duration: false })
    .then(metadata => {
      stream.destroy(); // stop downloading once ID3 header is parsed
      const pic = metadata.common.picture?.[0];
      pic
        ? res.set('Content-Type', pic.format).send(Buffer.from(pic.data))
        : res.redirect('/default-album.jpg');
    })
    .catch(err => {
      stream.destroy();
      next(err);
    });
});

router.get('/:songId/audio', function (req, res, next) {
  const parsedUrl = new URL(req.song.url);
  parsedUrl.protocol === 'file:'
    ? res.sendFile(decodeURIComponent(parsedUrl.pathname))
    : res.redirect(req.song.url);
});
