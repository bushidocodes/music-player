import { DataTypes } from 'sequelize';
import db from '../db.js';
import unique from './plugins/unique-through.js';

export default db.define('album', {
  name: {
    type: DataTypes.STRING(1e4),
    allowNull: false,
    set(val: unknown) {
      this.setDataValue('name', String(val).trim());
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
        model: db.model('song').scope(['defaultScope', 'populated'])
      }]
    })
  }
});
