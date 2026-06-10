'use strict';

const { expect } = require('chai');

// Stub db/models before loading the router so no DB connection is attempted.
const modelsPath = require.resolve('../../db/models');
require.cache[modelsPath] = {
  id: modelsPath,
  filename: modelsPath,
  loaded: true,
  exports: {
    Artist: {
      findAll: async () => [{ id: 1, name: 'Test Artist' }],
      // id '0' → not found (404 path); any other id → found
      findByPk: async id => id == 0 ? null : { id: Number(id), name: 'Test Artist' },
    },
  },
};

const router = require('./artists');

function handler(method, path) {
  const layer = router.stack.find(
    l => l.route && l.route.path === path && l.route.methods[method]
  );
  return layer.route.stack[0].handle;
}

const artistParam = router.params.artistId[0];

describe('Artist param handler', () => {
  it('passes a 404 error to next when the artist does not exist', async () => {
    const req = {};
    let err;
    await artistParam(req, {}, e => { err = e; }, '0');
    expect(err).to.be.instanceOf(Error);
    expect(err.status).to.equal(404);
    expect(err.message).to.equal('Artist not found');
  });

  it('attaches the artist to req and calls next when found', async () => {
    const req = {};
    let nextCalled = false;
    await artistParam(req, {}, () => { nextCalled = true; }, '1');
    expect(req.artist).to.include({ id: 1, name: 'Test Artist' });
    expect(nextCalled).to.be.true;
  });
});

describe('GET /api/artists/:artistId/albums', () => {
  const getArtistAlbums = handler('get', '/:artistId/albums');

  it('responds with the artist\'s albums', async () => {
    const albums = [{ id: 1, title: 'Abbey Road' }];
    const req = { artist: { getAlbums: async () => albums } };
    let body;
    await getArtistAlbums(req, { json: b => { body = b; } }, () => {});
    expect(body).to.equal(albums);
  });

  it('forwards database errors to the error handler', async () => {
    const dbErr = new Error('DB connection lost');
    const req = { artist: { getAlbums: async () => { throw dbErr; } } };
    let err;
    await getArtistAlbums(req, {}, e => { err = e; });
    expect(err).to.equal(dbErr);
  });
});

describe('GET /api/artists/:artistId/songs', () => {
  const getArtistSongs = handler('get', '/:artistId/songs');

  it('responds with the artist\'s songs', async () => {
    const songs = [{ id: 1, title: 'Come Together' }];
    const req = { artist: { getSongs: async () => songs } };
    let body;
    await getArtistSongs(req, { json: b => { body = b; } }, () => {});
    expect(body).to.equal(songs);
  });

  it('forwards database errors to the error handler', async () => {
    const dbErr = new Error('DB timeout');
    const req = { artist: { getSongs: async () => { throw dbErr; } } };
    let err;
    await getArtistSongs(req, {}, e => { err = e; });
    expect(err).to.equal(dbErr);
  });
});
