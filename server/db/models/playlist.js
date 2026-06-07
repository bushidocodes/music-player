'use strict';

const db = require('../db');
const DataTypes = db.Sequelize;
const unique = require('./plugins/unique-through');

const Playlist = db.define('playlist', {

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    set(val) {
      this.setDataValue('name', val.trim());
    }
  },
  artists: unique('artists').through('songs')

}, {

  scopes: {
    populated: () => ({
      include: [{
        model: db.model('song').scope('defaultScope', 'populated')
      }]
    })
  }

});

Playlist.prototype.addAndReturnSong = async function (songId) {
  songId = String(songId);
  const [, song] = await Promise.all([
    this.addSong(songId),
    db.model('song').scope('defaultScope', 'populated').findByPk(songId),
  ]);
  return song;
};

module.exports = Playlist;
