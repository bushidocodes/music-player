import { expect } from 'chai';
import Sequelize from 'sequelize';
import _ from 'lodash';
import unique from './unique-through.js';

describe('unique (deep: String) through (near: String)', () => {
  const def = unique('artists').through('songs');

  it('provides a Sequelize virtual column definition', () => {
    expect(def).to.be.an('object');
    expect(def.type).to.equal(Sequelize.VIRTUAL);
    expect(def.get).to.be.a('function');
  });

  describe('defines a getter', () => {
    let allArtists;
    const [teganAndSara,
           yeahYeahYeahs,
           sleaterKinney,
           miley,
           joanJett] = allArtists = [{artist: 'Tegan and Sara', id: 0},
                                     {artist: 'The Yeah Yeah Yeahs', id: 1},
                                     {artist: 'Sleater Kinnety', id: 2},
                                     {artist: 'Miley Cyrus', id: 3},
                                     {artist: 'Joan Jett', id: 4}];

    it('returns unique (by id) instances of the deep model via the through model', () => {
      const uniqueArtists = def.get.apply({
        songs: [
          {title: 'Divided', artists: [teganAndSara]},
          {title: 'Jumpers', artists: [sleaterKinney]},
          {title: 'Heads Will Roll', artists: [yeahYeahYeahs]},
          {title: 'Maps', artists: [yeahYeahYeahs]},
          {title: 'Bad Reputation', artists: [miley, joanJett]}
        ]
      });
      expect(_.sortBy(uniqueArtists, artist => artist.id)).to.eql(allArtists);
    });

    it('returns [] when the through model has no entries', () => {
      const result = def.get.apply({ songs: [] });
      expect(result).to.eql([]);
    });

    it('caches results', () => {
      const spy = {
        getSongsCalled: 0,
        get songs() {
          ++this.getSongsCalled;
          return [
            {artists: [{id: 1}]},
            {artists: [{id: 2}]}
          ];
        }
      };
      def.get.apply(spy);
      def.get.apply(spy);
      expect(spy.getSongsCalled).to.equal(1);
    });
  });
});
