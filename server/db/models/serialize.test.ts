import { describe, it, expect } from 'vitest';
import { toJSONWithoutSongUrls } from './serialize.js';

// Minimal stand-in for a Sequelize instance's get(): get({ plain: true })
// returns the plained tree (whose nested songs still carry url), while
// get('songs') returns the loaded Song instances (whose toJSON strips url).
function fakeInstance(plain, songInstances) {
  return {
    get(arg) {
      return arg === 'songs' ? songInstances : plain;
    },
  };
}

describe('toJSONWithoutSongUrls', () => {
  it('re-serializes nested songs via their own toJSON, dropping url', () => {
    const plain = {
      id: 1,
      name: 'Album',
      songs: [{ id: 10, name: 'A', url: 'file:///secret/a.mp3' }],
    };
    const songs = [{ id: 10, toJSON: () => ({ id: 10, name: 'A' }) }];

    const json = toJSONWithoutSongUrls(fakeInstance(plain, songs));

    expect(json.songs).toEqual([{ id: 10, name: 'A' }]);
    expect(json.songs[0]).not.toHaveProperty('url');
    expect(json.name).toBe('Album');
  });

  it('leaves an instance without loaded songs unchanged', () => {
    const plain = { id: 1, name: 'Album' };
    const json = toJSONWithoutSongUrls(fakeInstance(plain, undefined));
    expect(json).toEqual({ id: 1, name: 'Album' });
  });
});
