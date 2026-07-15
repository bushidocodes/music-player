import type { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import db from '../db.js';
import unique from './plugins/unique-through.js';
import { toJSONWithoutSongUrls } from './serialize.js';

const Album = db.define(
  'album',
  {
    name: {
      type: DataTypes.STRING(1e4),
      allowNull: false,
      set(val: unknown) {
        this.setDataValue('name', String(val).trim());
      },
    },
    artists: unique('artists').through('songs'),
  },
  {
    scopes: {
      songIds: () => ({
        include: [
          {
            model: db.model('song'),
            attributes: ['id'],
          },
        ],
      }),
      populated: () => ({
        include: [
          {
            model: db.model('song').scope(['defaultScope', 'populated']),
          },
        ],
      }),
    },
  }
);

// Serialize nested songs through Song#toJSON so `url` is never exposed (the
// default toJSON would plain them straight from dataValues, leaking it).
Album.prototype.toJSON = function toJSON(this: Model) {
  return toJSONWithoutSongUrls(this);
};

export default Album;
