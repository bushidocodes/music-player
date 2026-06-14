import { expect } from 'chai';
import createSongsRouter from './songs.js';

const mockSong = {
  scope: () => ({
    findAll: async () => [],
    findByPk: async id =>
      id == 0 ? null : { id: Number(id), title: 'Test Song', url: 'https://example.com/song.mp3' },
  }),
};

const router = createSongsRouter(mockSong);

function handler(method, path) {
  const layer = router.stack.find(
    l => l.route && l.route.path === path && l.route.methods[method]
  );
  return layer.route.stack[0].handle;
}

const songParam = router.params.songId[0];

describe('Song param handler', () => {
  it('passes a 404 error to next when the song does not exist', async () => {
    const req = {};
    let err;
    await songParam(req, {}, e => { err = e; }, '0');
    expect(err).to.be.instanceOf(Error);
    expect(err.status).to.equal(404);
    expect(err.message).to.equal('Song not found');
  });

  it('attaches the song to req and calls next when found', async () => {
    const req = {};
    let nextCalled = false;
    await songParam(req, {}, () => { nextCalled = true; }, '1');
    expect(req.song).to.include({ id: 1 });
    expect(nextCalled).to.be.true;
  });
});

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
