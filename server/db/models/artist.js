'use strict';

const db = require('../db');
const DataTypes = db.Sequelize;

const Artist = db.define('artist', {

  name: {
    type: DataTypes.STRING(1e4), // eslint-disable-line new-cap
    allowNull: false,
    set(val) {
      this.setDataValue('name', val.trim());
    }
  }

});

Artist.prototype.getAlbums = function () {
  return db.model('album').scope('defaultScope', 'populated').findAll({
    include: [{
      model: db.model('song'),
      include: [{
        model: db.model('artist'),
        where: { id: this.id }
      }]
    }]
  });
};

module.exports = Artist;
