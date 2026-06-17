import { styleText } from 'node:util';
import Sequelize from 'sequelize';
import { DATABASE_URI } from '../env/index.js';

console.log(styleText('yellow', 'Opening connection to PostgreSQL'));

export default new Sequelize(DATABASE_URI, {
  logging: false,
});
