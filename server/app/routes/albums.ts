import express from 'express';
import type { AlbumRepository } from '../../db/models/types.js';
import { HttpError } from '../http-error.js';

export default function createAlbumsRouter(Album: AlbumRepository) {
  const router = express.Router();

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
        return next(new HttpError('Album not found', 404));
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
      return next(new HttpError('Album has no songs', 404));
    }
    res.redirect(`/api/songs/${req.album.songs[0].id}/image`);
  });

  router.get('/:albumId/songs/', (req, res) => res.json(req.album.songs));

  router.get('/:albumId/songs/:songId', (req, res) => {
    const songToSend = req.album.songs.find(
      (song) => song.id === Number(req.params.songId)
    );
    if (!songToSend) return res.sendStatus(404);
    res.json(songToSend);
  });

  return router;
}
