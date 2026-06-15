import { describe, it, expect } from 'vitest';
import createLyricsRouter from './lyrics.js';

const axiosStub = { get: async () => ({ data: {} }) };
const router = createLyricsRouter(axiosStub);

const getLyrics = router.stack.find(
  l => l.route && l.route.path === '/:artist/:song' && l.route.methods.get
).route.stack[0].handle;

describe('GET /api/lyrics/:artist/:song', () => {
  it('returns the lyric string when the external API finds a match', async () => {
    axiosStub.get = async () => ({ data: { lyrics: 'Hello from the other side' } });
    const req = { params: { artist: 'Adele', song: 'Hello' } };
    let sent;
    await getLyrics(req, { send: b => { sent = b; } }, () => {});
    expect(sent).toEqual({ lyric: 'Hello from the other side' });
  });

  it('returns null lyric when the API response has no lyrics field', async () => {
    axiosStub.get = async () => ({ data: {} });
    const req = { params: { artist: 'Unknown', song: 'Unknown' } };
    let sent;
    await getLyrics(req, { send: b => { sent = b; } }, () => {});
    expect(sent).toEqual({ lyric: null });
  });

  it('forwards API errors to the error handler', async () => {
    const apiErr = new Error('Service unavailable');
    axiosStub.get = async () => { throw apiErr; };
    const req = { params: { artist: 'Adele', song: 'Hello' } };
    let err;
    await getLyrics(req, {}, e => { err = e; });
    expect(err).toBe(apiErr);
  });

  it('URL-encodes special characters in the artist and song names', async () => {
    let capturedUrl;
    axiosStub.get = async url => { capturedUrl = url; return { data: { lyrics: '' } }; };
    const req = { params: { artist: 'AC/DC', song: 'Back in Black' } };
    await getLyrics(req, { send: () => {} }, () => {});
    expect(capturedUrl).toContain('AC%2FDC');
    expect(capturedUrl).toContain('Back%20in%20Black');
  });
});
