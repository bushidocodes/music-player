import { DataTypes } from 'sequelize';
import db from '../db.js';

const Artist = db.define('artist', {
  name: {
    type: DataTypes.STRING(1e4),
    allowNull: false,
    set(val: unknown) {
      this.setDataValue('name', String(val).trim());
    },
  },
});

// getAlbums is a custom finder, not a standard Sequelize association mixin.
(Artist.prototype as any).getAlbums = async function (this: { id: number }) {
  return db
    .model('album')
    .scope(['defaultScope', 'populated'])
    .findAll({
      include: [
        {
          model: db.model('song'),
          include: [
            {
              model: db.model('artist'),
              where: { id: this.id },
            },
          ],
        },
      ],
    });
};

export default Artist;
