import { DataTypes } from 'sequelize';
import { describe, expect, it } from 'vitest';
import unique from './unique-through.js';

describe('unique (deep: String) through (near: String)', () => {
  const def = unique('artists').through('songs');

  it('provides a Sequelize virtual column definition', () => {
    expect(typeof def).toBe('object');
    expect(def.type).toBe(DataTypes.VIRTUAL);
    expect(typeof def.get).toBe('function');
  });

  describe('defines a getter', () => {
    let allArtists;
    const [teganAndSara, yeahYeahYeahs, sleaterKinney, miley, joanJett] =
      (allArtists = [
        { artist: 'Tegan and Sara', id: 0 },
        { artist: 'The Yeah Yeah Yeahs', id: 1 },
        { artist: 'Sleater Kinnety', id: 2 },
        { artist: 'Miley Cyrus', id: 3 },
        { artist: 'Joan Jett', id: 4 },
      ]);

    it('returns unique (by id) instances of the deep model via the through model', () => {
      const uniqueArtists = def.get.apply({
        songs: [
          { title: 'Divided', artists: [teganAndSara] },
          { title: 'Jumpers', artists: [sleaterKinney] },
          { title: 'Heads Will Roll', artists: [yeahYeahYeahs] },
          { title: 'Maps', artists: [yeahYeahYeahs] },
          { title: 'Bad Reputation', artists: [miley, joanJett] },
        ],
      });
      expect([...uniqueArtists].sort((a, b) => a.id - b.id)).toEqual(
        allArtists
      );
    });

    it('returns [] when the through model has no entries', () => {
      const result = def.get.apply({ songs: [] });
      expect(result).toEqual([]);
    });

    it('returns [] when the through association is not loaded', () => {
      const result = def.get.apply({});
      expect(result).toEqual([]);
    });

    it('caches results', () => {
      const spy = {
        getSongsCalled: 0,
        get songs() {
          ++this.getSongsCalled;
          return [{ artists: [{ id: 1 }] }, { artists: [{ id: 2 }] }];
        },
      };
      def.get.apply(spy);
      def.get.apply(spy);
      expect(spy.getSongsCalled).toBe(1);
    });
  });
});
