import type { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import db from '../db.js';
import unique from './plugins/unique-through.js';
import { toJSONWithoutSongUrls } from './serialize.js';

const Playlist = db.define(
  'playlist',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val: unknown) {
        this.setDataValue('name', String(val).trim());
      },
    },
    artists: unique('artists').through('songs'),
  },
  {
    scopes: {
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

(Playlist.prototype as any).addAndReturnSong = async function (
  this: any,
  songId: number | string
) {
  songId = String(songId);
  const [, song] = await Promise.all([
    this.addSong(songId),
    db.model('song').scope(['defaultScope', 'populated']).findByPk(songId),
  ]);
  return song;
};

// Serialize nested songs through Song#toJSON so `url` is never exposed.
Playlist.prototype.toJSON = function toJSON(this: Model) {
  return toJSONWithoutSongUrls(this);
};

export default Playlist;
