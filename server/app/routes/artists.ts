import express from 'express';

export default function createArtistsRouter(Artist) {
  const router = new express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const artists = await Artist.findAll();
      res.json(artists);
    } catch (err) {
      next(err);
    }
  });

  router.param('artistId', async (req, res, next, id) => {
    try {
      const artist = await Artist.findByPk(id);
      if (!artist) {
        const err = new Error('Artist not found');
        err.status = 404;
        return next(err);
      }
      req.artist = artist;
      next();
    } catch (err) {
      next(err);
    }
  });

  router.get('/:artistId', (req, res) => res.json(req.artist));

  router.get('/:artistId/albums', async (req, res, next) => {
    try {
      const albums = await req.artist.getAlbums();
      res.json(albums);
    } catch (err) {
      next(err);
    }
  });

  router.get('/:artistId/songs', async (req, res, next) => {
    try {
      const songs = await req.artist.getSongs({ include: [Artist] });
      res.json(songs);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
