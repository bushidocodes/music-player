const express = require('express');
const router = new express.Router();
const axios = require('axios');
const parser = require('xml2json');
module.exports = router;

const lyricsAPIPrefix = 'http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect';

router.get('/:artist/:song', (req, res, next) => {
  axios.get(`${lyricsAPIPrefix}?artist=${req.params.artist}&song=${req.params.song}`)
    .then(response => {
      const lyric = parser.toJson(response.data, {object: true}).GetLyricResult.Lyric;
      res.send({lyric});
    })
    .catch(next);
});
