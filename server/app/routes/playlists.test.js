'use strict';

const { expect } = require('chai');

// Stub db/models before loading the router so no DB connection is attempted.
// Both this file and playlists.js live in the same directory, so require.resolve
// produces the same absolute path from either file's perspective.
const modelsPath = require.resolve('../../db/models');
require.cache[modelsPath] = {
  id: modelsPath,
  filename: modelsPath,
  loaded: true,
  exports: { Playlist: {} },
};

const router = require('./playlists');

// Pull the POST /:playlistId/songs handler off the Express router stack.
const layer = router.stack.find(
  l => l.route && l.route.path === '/:playlistId/songs' && l.route.methods.post
);
const addSongToPlaylist = layer.route.stack[0].handle;

describe('POST /api/playlists/:playlistId/songs', () => {
  describe('when body contains neither id nor song', () => {
    it('passes a 400 error to next', async () => {
      const req = { body: {} };
      const res = {};
      let capturedErr;
      const next = err => { capturedErr = err; };

      await addSongToPlaylist(req, res, next);

      expect(capturedErr).to.be.instanceOf(Error);
      expect(capturedErr.message).to.equal('Request body must include either id or song');
      expect(capturedErr.status).to.equal(400);
    });
  });

  describe('when body includes id', () => {
    it('does not call next with an error', async () => {
      const req = {
        body: { id: 1 },
        playlist: { addAndReturnSong: async () => ({ id: 1, title: 'Test Song' }) },
      };
      const res = { status: () => res, json: () => {} };
      let capturedErr;
      const next = err => { capturedErr = err; };

      await addSongToPlaylist(req, res, next);

      expect(capturedErr).to.be.undefined;
    });
  });

  describe('when body includes song', () => {
    it('does not call next with an error', async () => {
      const req = {
        body: { song: { id: 2 } },
        playlist: { addAndReturnSong: async () => ({ id: 2, title: 'Another Song' }) },
      };
      const res = { status: () => res, json: () => {} };
      let capturedErr;
      const next = err => { capturedErr = err; };

      await addSongToPlaylist(req, res, next);

      expect(capturedErr).to.be.undefined;
    });
  });
});
