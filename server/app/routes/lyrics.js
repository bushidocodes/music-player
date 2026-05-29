const express = require('express');
const router = new express.Router();
const axios = require('axios');
const parser = require('xml2json');
module.exports = router;

const lyricsAPIPrefix = 'https://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect';

router.get('/:artist/:song', (req, res, next) => {
  const url = `${lyricsAPIPrefix}?artist=${encodeURIComponent(req.params.artist)}&song=${encodeURIComponent(req.params.song)}`;
  axios.get(url)
    .then(response => {
      const result = parser.toJson(response.data, {object: true});
      const lyric = result && result.GetLyricResult ? result.GetLyricResult.Lyric : null;
      res.send({lyric});
    })
    .catch(next);
});
