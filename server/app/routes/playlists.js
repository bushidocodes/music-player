'use strict';

const express = require('express');
const router = new express.Router();
const models = require('../../db/models');
const Playlist = models.Playlist;
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const playlists = await Playlist.findAll();
    res.json(playlists);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const name = req.body && req.body.name && String(req.body.name).trim();
  if (!name) {
    const err = new Error('name is required and must be a non-empty string');
    err.status = 400;
    return next(err);
  }
  try {
    const playlist = await Playlist.create({ name });
    res.status(201).json(playlist);
  } catch (err) {
    next(err);
  }
});

router.param('playlistId', async (req, res, next, id) => {
  try {
    const playlist = await Playlist.scope('populated').findByPk(id);
    if (!playlist) {
      const err = new Error('Playlist not found');
      err.status = 404;
      return next(err);
    }
    req.playlist = playlist;
    next();
  } catch (err) {
    next(err);
  }
});

router.get('/:playlistId', (req, res) => res.json(req.playlist));

router.put('/:playlistId', async (req, res, next) => {
  const name = req.body && req.body.name && String(req.body.name).trim();
  if (!name) {
    const err = new Error('name is required and must be a non-empty string');
    err.status = 400;
    return next(err);
  }
  try {
    const playlist = await req.playlist.update({ name });
    res.status(200).json(playlist);
  } catch (err) {
    next(err);
  }
});

router.delete('/:playlistId', async (req, res, next) => {
  try {
    await req.playlist.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.get('/:playlistId/songs', (req, res) => res.json(req.playlist.songs));

router.post('/:playlistId/songs', async (req, res, next) => {
  const id = req.body.id || req.body.song.id;
  try {
    const song = await req.playlist.addAndReturnSong(id);
    res.status(201).json(song);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(409).send('Song is already in the playlist.');
    } else {
      next(err);
    }
  }
});

router.get('/:playlistId/songs/:songId', (req, res) => {
  const requestedSong = req.playlist.songs.find(song => song.id === Number(req.params.songId));
  if (!requestedSong) res.sendStatus(404);
  else res.json(requestedSong);
});

router.delete('/:playlistId/songs/:songId', async (req, res, next) => {
  try {
    await req.playlist.removeSong(req.params.songId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});
