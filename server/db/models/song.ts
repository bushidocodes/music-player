import { DataTypes, Model } from 'sequelize';
import db from '../db.js';

const Song = db.define('song', {
  name: {
    type: DataTypes.STRING(1e4),
    allowNull: false,
    set(val: unknown) {
      this.setDataValue('name', String(val).trim());
    }
  },
  genre: {
    type: DataTypes.STRING,
  },
  url: {
    type: DataTypes.STRING(1e4),
    allowNull: false
  },
}, {
  defaultScope: {
    attributes: {
      include: ['albumId'],
    },
  },
  scopes: {
    populated: () => ({
      include: [{
        model: db.model('artist')
      }]
    })
  },
});

Song.prototype.toJSON = function toJSON(this: Model) {
  const plain = this.get({ plain: true }) as Record<string, unknown>;
  delete plain.url;
  return plain;
};

export default Song;
