import db from '../db.js';
import unique from './plugins/unique-through.js';

const DataTypes = db.Sequelize;

export default db.define('album', {
  name: {
    type: DataTypes.STRING(1e4), // eslint-disable-line new-cap
    allowNull: false,
    set(val) {
      this.setDataValue('name', val.trim());
    }
  },
  artists: unique('artists').through('songs')
}, {
  scopes: {
    songIds: () => ({
      include: [{
        model: db.model('song'),
        attributes: ['id']
      }]
    }),
    populated: () => ({
      include: [{
        model: db.model('song').scope('defaultScope', 'populated')
      }]
    })
  }
});
