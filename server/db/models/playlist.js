import db from '../db.js';
import unique from './plugins/unique-through.js';

const DataTypes = db.Sequelize;

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

export default Playlist;
