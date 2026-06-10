'use strict';

const { expect } = require('chai');

// Stub db/models before loading the router so no DB connection is attempted.
// id '0' → not found (404 path); any other id → found
const modelsPath = require.resolve('../../db/models');
require.cache[modelsPath] = {
  id: modelsPath,
  filename: modelsPath,
  loaded: true,
  exports: {
    Album: {
      scope: () => ({
        findAll: async () => [],
        findByPk: async id =>
          id == 0 ? null : { id: Number(id), title: 'Test Album', songs: [{ id: 10 }] },
      }),
    },
  },
};

const router = require('./albums');

function handler(method, path) {
  const layer = router.stack.find(
    l => l.route && l.route.path === path && l.route.methods[method]
  );
  return layer.route.stack[0].handle;
}

const albumParam = router.params.albumId[0];

describe('Album param handler', () => {
  it('passes a 404 error to next when the album does not exist', async () => {
    const req = {};
    let err;
    await albumParam(req, {}, e => { err = e; }, '0');
    expect(err).to.be.instanceOf(Error);
    expect(err.status).to.equal(404);
    expect(err.message).to.equal('Album not found');
  });

  it('attaches the album to req and calls next when found', async () => {
    const req = {};
    let nextCalled = false;
    await albumParam(req, {}, () => { nextCalled = true; }, '1');
    expect(req.album).to.include({ id: 1 });
    expect(nextCalled).to.be.true;
  });
});

describe('GET /api/albums/:albumId/image', () => {
  const getAlbumImage = handler('get', '/:albumId/image');

  it('passes a 404 error to next when the album has no songs', () => {
    const req = { album: { songs: [] } };
    let err;
    getAlbumImage(req, {}, e => { err = e; });
    expect(err).to.be.instanceOf(Error);
    expect(err.status).to.equal(404);
    expect(err.message).to.equal('Album has no songs');
  });

  it('redirects to the first song image when songs are present', () => {
    const req = { album: { songs: [{ id: 42 }] } };
    let redirectUrl;
    const res = { redirect: url => { redirectUrl = url; } };
    getAlbumImage(req, res, () => {});
    expect(redirectUrl).to.equal('/api/songs/42/image');
  });
});

describe('GET /api/albums/:albumId/songs/:songId', () => {
  const getAlbumSong = handler('get', '/:albumId/songs/:songId');

  it('responds 404 when the song is not in the album', () => {
    const req = { album: { songs: [{ id: 1 }] }, params: { songId: '999' } };
    let status;
    const res = { sendStatus: s => { status = s; }, json: () => {} };
    getAlbumSong(req, res);
    expect(status).to.equal(404);
  });

  it('responds with the song when found', () => {
    const song = { id: 1, title: 'Track 1' };
    const req = { album: { songs: [song] }, params: { songId: '1' } };
    let body;
    const res = { sendStatus: () => {}, json: b => { body = b; } };
    getAlbumSong(req, res);
    expect(body).to.equal(song);
  });
});
