'use strict';

const express = require('express');
const router = express.Router();
const models = require('../../db/models');
const Album = models.Album;
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const albums = await Album.scope('defaultScope', 'songIds').findAll();
    res.json(albums);
  } catch (err) {
    next(err);
  }
});

router.param('albumId', async (req, res, next, id) => {
  try {
    const album = await Album.scope('defaultScope', 'populated').findByPk(id);
    if (!album) {
      const err = new Error('Album not found');
      err.status = 404;
      return next(err);
    }
    req.album = album;
    next();
  } catch (err) {
    next(err);
  }
});

router.get('/:albumId', (req, res) => res.json(req.album));

router.get('/:albumId/image', (req, res, next) => {
  if (!req.album.songs || req.album.songs.length === 0) {
    const err = new Error('Album has no songs');
    err.status = 404;
    return next(err);
  }
  res.redirect(`/api/songs/${req.album.songs[0].id}/image`);
});

router.get('/:albumId/songs/', (req, res) => res.json(req.album.songs));

router.get('/:albumId/songs/:songId', (req, res) => {
  const songToSend = req.album.songs.find(song => song.id === Number(req.params.songId));
  if (!songToSend) return res.sendStatus(404);
  res.json(songToSend);
});
