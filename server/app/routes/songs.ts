import express from 'express';
import http from 'http';
import https from 'https';
import { PassThrough } from 'stream';
import { parseStream } from 'music-metadata';
import fs from 'fs';

const MAX_REDIRECTS = 10;
function open(url) {
  const parsed = new URL(url);
  if (parsed.protocol === 'file:') {
    return fs.createReadStream(decodeURIComponent(parsed.pathname));
  }
  const pass = new PassThrough();
  function fetch(currentUrl, redirectCount) {
    if (redirectCount > MAX_REDIRECTS) {
      pass.destroy(new Error(`Too many redirects (max ${MAX_REDIRECTS})`));
      return;
    }
    const get = currentUrl.startsWith('https:') ? https.get : http.get;
    get(currentUrl, response => {
      const { statusCode, headers } = response;
      if (statusCode >= 300 && statusCode < 400 && headers.location) {
        response.resume();
        fetch(headers.location, redirectCount + 1);
      } else {
        response.pipe(pass);
      }
    }).on('error', err => pass.destroy(err));
  }
  fetch(url, 0);
  return pass;
}

export default function createSongsRouter(Song) {
  const router = express.Router();

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

  router.get('/:songId/image', async (req, res, next) => {
    const stream = open(req.song.url);
    try {
      const metadata = await parseStream(stream, undefined, { duration: false });
      stream.destroy();
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

  return router;
}
