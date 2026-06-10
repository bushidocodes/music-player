'use strict';

const { expect } = require('chai');

// Stub db/models before loading the router so no DB connection is attempted.
const modelsPath = require.resolve('../../db/models');
require.cache[modelsPath] = {
  id: modelsPath,
  filename: modelsPath,
  loaded: true,
  exports: {
    Song: {
      scope: () => ({ findAll: async () => [], findByPk: async () => null }),
    },
  },
};

const router = require('./songs');

function handler(method, path) {
  const layer = router.stack.find(
    l => l.route && l.route.path === path && l.route.methods[method]
  );
  return layer.route.stack[0].handle;
}

describe('GET /api/songs/:songId/audio', () => {
  const getAudio = handler('get', '/:songId/audio');

  it('redirects to the URL for remote songs', () => {
    const req = { song: { url: 'https://example.com/song.mp3' } };
    let redirectUrl;
    const res = { redirect: url => { redirectUrl = url; } };
    getAudio(req, res);
    expect(redirectUrl).to.equal('https://example.com/song.mp3');
  });

  it('calls sendFile with the decoded local path for file:// songs', () => {
    const req = { song: { url: 'file:///home/user/music/song.mp3' } };
    let sentPath;
    const res = { sendFile: p => { sentPath = p; } };
    getAudio(req, res);
    expect(sentPath).to.equal('/home/user/music/song.mp3');
  });
});
