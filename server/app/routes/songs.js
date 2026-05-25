'use strict';

const express = require('express');
const router = express.Router();
const urlParse = require('url').parse;
const http = require('http');
const https = require('https');
const { PassThrough } = require('stream');
const models = require('../../db/models');
const Song = models.Song;
const mm = require('music-metadata');
const fs = require('fs')

module.exports = router;

router.get('/', function (req, res, next) {
  Song.scope('defaultScope', 'populated').findAll({ where: req.query })
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

function open(url) {
  const parsed = urlParse(url);
  if (parsed.protocol === 'file:') {
    return fs.createReadStream(decodeURIComponent(parsed.path));
  }
  const pass = new PassThrough();
  const get = parsed.protocol === 'https:' ? https.get : http.get;
  get(url, response => response.pipe(pass)).on('error', err => pass.destroy(err));
  return pass;
}

router.get('/:songId/image', function (req, res, next) {
  mm.parseStream(open(req.song.url))
    .then(metadata => {
      const pic = metadata.common.picture?.[0];
      pic
        ? res.set('Content-Type', pic.format).send(Buffer.from(pic.data))
        : res.redirect('/default-album.jpg');
    })
    .catch(next);
});

router.get('/:songId/audio', function (req, res, next) {
  const url = urlParse(req.song.url)
  url.protocol === 'file:'?
    res.sendFile(decodeURIComponent(url.path))
    : res.redirect(req.song.url)
});
