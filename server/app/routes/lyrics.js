const express = require('express');
const router = new express.Router();
const axios = require('axios');
module.exports = router;

const lyricsAPIPrefix = 'https://api.lyrics.ovh/v1';

router.get('/:artist/:song', (req, res, next) => {
  const url = `${lyricsAPIPrefix}/${encodeURIComponent(req.params.artist)}/${encodeURIComponent(req.params.song)}`;
  axios.get(url)
    .then(response => {
      const lyric = response.data?.lyrics ?? null;
      res.send({ lyric });
    })
    .catch(next);
});
