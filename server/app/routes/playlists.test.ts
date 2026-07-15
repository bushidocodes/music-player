import { describe, expect, it } from 'vitest';
import createPlaylistsRouter from './playlists.js';

const mockPlaylist = {
  findAll: async () => [],
  create: async (data) => ({ id: 1, ...data }),
  scope: () => ({
    findByPk: async (id) =>
      id == 0
        ? null
        : {
            id: Number(id),
            name: 'Test Playlist',
            songs: [{ id: 10, title: 'Song A' }],
            update: async (data) => ({ id: 1, ...data }),
            destroy: async () => {},
            addAndReturnSong: async (songId) => ({ id: songId }),
            removeSong: async () => {},
          },
  }),
};

const router = createPlaylistsRouter(mockPlaylist);

function handler(method, path) {
  const layer = router.stack.find(
    (l) => l.route && l.route.path === path && l.route.methods[method]
  );
  return layer.route.stack[0].handle;
}

const playlistParam = router.params.playlistId[0];

describe('Playlist param handler', () => {
  it('passes a 404 error to next when the playlist does not exist', async () => {
    const req = {};
    let err;
    await playlistParam(
      req,
      {},
      (e) => {
        err = e;
      },
      '0'
    );
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(404);
    expect(err.message).toBe('Playlist not found');
  });

  it('attaches the playlist to req and calls next when found', async () => {
    const req = {};
    let nextCalled = false;
    await playlistParam(
      req,
      {},
      () => {
        nextCalled = true;
      },
      '1'
    );
    expect(req.playlist).toMatchObject({ id: 1 });
    expect(nextCalled).toBe(true);
  });
});

describe('POST /api/playlists', () => {
  const createPlaylist = handler('post', '/');

  it('passes a 400 error to next when name is missing', async () => {
    let err;
    await createPlaylist({ body: {} }, {}, (e) => {
      err = e;
    });
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(400);
  });

  it('passes a 400 error to next when name is blank', async () => {
    let err;
    await createPlaylist({ body: { name: '   ' } }, {}, (e) => {
      err = e;
    });
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(400);
  });

  it('responds 201 with the new playlist when name is valid', async () => {
    let status, body;
    const res = {
      status: (s) => {
        status = s;
        return res;
      },
      json: (b) => {
        body = b;
      },
    };
    await createPlaylist({ body: { name: 'Road Trip' } }, res, () => {});
    expect(status).toBe(201);
    expect(body).toMatchObject({ name: 'Road Trip' });
  });
});

describe('PUT /api/playlists/:playlistId', () => {
  const updatePlaylist = handler('put', '/:playlistId');

  it('passes a 400 error to next when name is missing', async () => {
    let err;
    await updatePlaylist({ body: {}, playlist: {} }, {}, (e) => {
      err = e;
    });
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(400);
  });

  it('passes a 400 error to next when name is blank', async () => {
    let err;
    await updatePlaylist({ body: { name: '  ' }, playlist: {} }, {}, (e) => {
      err = e;
    });
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(400);
  });
});

describe('GET /api/playlists/:playlistId/songs/:songId', () => {
  const getSong = handler('get', '/:playlistId/songs/:songId');

  it('responds 404 when the song is not in the playlist', () => {
    let status;
    const req = { playlist: { songs: [{ id: 1 }] }, params: { songId: '999' } };
    const res = {
      sendStatus: (s) => {
        status = s;
      },
      json: () => {},
    };
    getSong(req, res);
    expect(status).toBe(404);
  });

  it('responds with the song when found', () => {
    const song = { id: 1, title: 'Song A' };
    let body;
    const req = { playlist: { songs: [song] }, params: { songId: '1' } };
    const res = {
      sendStatus: () => {},
      json: (b) => {
        body = b;
      },
    };
    getSong(req, res);
    expect(body).toBe(song);
  });
});

describe('POST /api/playlists/:playlistId/songs', () => {
  const addSong = handler('post', '/:playlistId/songs');

  it('passes a 400 error to next when body contains neither id nor song', async () => {
    let err;
    await addSong({ body: {} }, {}, (e) => {
      err = e;
    });
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Request body must include either id or song');
    expect(err.status).toBe(400);
  });

  it('does not call next with an error when body includes id', async () => {
    const req = {
      body: { id: 1 },
      playlist: { addAndReturnSong: async () => ({ id: 1 }) },
    };
    const res = { status: () => res, json: () => {} };
    let err;
    await addSong(req, res, (e) => {
      err = e;
    });
    expect(err).toBeUndefined();
  });

  it('does not call next with an error when body includes song', async () => {
    const req = {
      body: { song: { id: 2 } },
      playlist: { addAndReturnSong: async () => ({ id: 2 }) },
    };
    const res = { status: () => res, json: () => {} };
    let err;
    await addSong(req, res, (e) => {
      err = e;
    });
    expect(err).toBeUndefined();
  });

  it('responds 409 when the song is already in the playlist', async () => {
    const uniqueErr = Object.assign(new Error('already exists'), {
      name: 'SequelizeUniqueConstraintError',
    });
    const req = {
      body: { id: 1 },
      playlist: {
        addAndReturnSong: async () => {
          throw uniqueErr;
        },
      },
    };
    let status, body;
    const res = {
      status: (s) => {
        status = s;
        return res;
      },
      send: (b) => {
        body = b;
      },
    };
    await addSong(req, res, () => {});
    expect(status).toBe(409);
    expect(body).toBe('Song is already in the playlist.');
  });
});
