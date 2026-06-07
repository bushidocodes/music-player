'use strict';

const express = require('express');
const router = new express.Router();
const axios = require('axios');
module.exports = router;

const lyricsAPIPrefix = 'https://api.lyrics.ovh/v1';

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
