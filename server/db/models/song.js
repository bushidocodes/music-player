import db from '../db.js';

const DataTypes = db.Sequelize;

const Song = db.define('song', {
  name: {
    type: DataTypes.STRING(1e4), // eslint-disable-line new-cap
    allowNull: false,
    set(val) {
      this.setDataValue('name', val.trim());
    }
  },
  genre: {
    type: DataTypes.STRING,
  },
  url: {
    type: DataTypes.STRING(1e4), // eslint-disable-line new-cap
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

Song.prototype.toJSON = function toJSON() {
  const plain = this.get({ plain: true });
  delete plain.url;
  return plain;
};

export default Song;
