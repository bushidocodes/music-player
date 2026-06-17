import express from 'express';
import type { AxiosInstance } from 'axios';

const lyricsAPIPrefix = 'https://api.lyrics.ovh/v1';

export default function createLyricsRouter(axios: AxiosInstance) {
  const router = express.Router();

  router.get('/:artist/:song', async (req, res, next) => {
    try {
      const url = `${lyricsAPIPrefix}/${encodeURIComponent(req.params.artist)}/${encodeURIComponent(req.params.song)}`;
      const response = await axios.get<{ lyrics?: string | null }>(url);
      const lyric = response.data?.lyrics ?? null;
      res.send({ lyric });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
