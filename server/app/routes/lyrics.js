import express from 'express';

const lyricsAPIPrefix = 'https://api.lyrics.ovh/v1';

export default function createLyricsRouter(axios) {
  const router = new express.Router();

  router.get('/:artist/:song', async (req, res, next) => {
    try {
      const url = `${lyricsAPIPrefix}/${encodeURIComponent(req.params.artist)}/${encodeURIComponent(req.params.song)}`;
      const response = await axios.get(url);
      const lyric = response.data?.lyrics ?? null;
      res.send({ lyric });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
