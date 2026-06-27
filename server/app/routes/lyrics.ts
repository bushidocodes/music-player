import express from 'express';

const lyricsAPIPrefix = 'https://api.lyrics.ovh/v1';

export default function createLyricsRouter(fetch: typeof globalThis.fetch) {
  const router = express.Router();

  router.get('/:artist/:song', async (req, res, next) => {
    try {
      const url = `${lyricsAPIPrefix}/${encodeURIComponent(req.params.artist)}/${encodeURIComponent(req.params.song)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = (await response.json()) as { lyrics?: string | null };
      const lyric = data?.lyrics ?? null;
      res.send({ lyric });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
