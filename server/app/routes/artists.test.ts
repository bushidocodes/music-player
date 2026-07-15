import { describe, expect, it } from 'vitest';
import createArtistsRouter from './artists.js';

const mockArtist = {
  findAll: async () => [{ id: 1, name: 'Test Artist' }],
  findByPk: async (id) =>
    id == 0 ? null : { id: Number(id), name: 'Test Artist' },
};

const router = createArtistsRouter(mockArtist);

function handler(method, path) {
  const layer = router.stack.find(
    (l) => l.route && l.route.path === path && l.route.methods[method]
  );
  return layer.route.stack[0].handle;
}

const artistParam = router.params.artistId[0];

describe('Artist param handler', () => {
  it('passes a 404 error to next when the artist does not exist', async () => {
    const req = {};
    let err;
    await artistParam(
      req,
      {},
      (e) => {
        err = e;
      },
      '0'
    );
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(404);
    expect(err.message).toBe('Artist not found');
  });

  it('attaches the artist to req and calls next when found', async () => {
    const req = {};
    let nextCalled = false;
    await artistParam(
      req,
      {},
      () => {
        nextCalled = true;
      },
      '1'
    );
    expect(req.artist).toMatchObject({ id: 1, name: 'Test Artist' });
    expect(nextCalled).toBe(true);
  });
});

describe('GET /api/artists/:artistId/albums', () => {
  const getArtistAlbums = handler('get', '/:artistId/albums');

  it("responds with the artist's albums", async () => {
    const albums = [{ id: 1, title: 'Abbey Road' }];
    const req = { artist: { getAlbums: async () => albums } };
    let body;
    await getArtistAlbums(
      req,
      {
        json: (b) => {
          body = b;
        },
      },
      () => {}
    );
    expect(body).toBe(albums);
  });

  it('forwards database errors to the error handler', async () => {
    const dbErr = new Error('DB connection lost');
    const req = {
      artist: {
        getAlbums: async () => {
          throw dbErr;
        },
      },
    };
    let err;
    await getArtistAlbums(req, {}, (e) => {
      err = e;
    });
    expect(err).toBe(dbErr);
  });
});

describe('GET /api/artists/:artistId/songs', () => {
  const getArtistSongs = handler('get', '/:artistId/songs');

  it("responds with the artist's songs", async () => {
    const songs = [{ id: 1, title: 'Come Together' }];
    const req = { artist: { getSongs: async () => songs } };
    let body;
    await getArtistSongs(
      req,
      {
        json: (b) => {
          body = b;
        },
      },
      () => {}
    );
    expect(body).toBe(songs);
  });

  it('forwards database errors to the error handler', async () => {
    const dbErr = new Error('DB timeout');
    const req = {
      artist: {
        getSongs: async () => {
          throw dbErr;
        },
      },
    };
    let err;
    await getArtistSongs(req, {}, (e) => {
      err = e;
    });
    expect(err).toBe(dbErr);
  });
});
