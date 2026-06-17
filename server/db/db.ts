import { styleText } from 'node:util';
import { Sequelize } from 'sequelize';
import { DATABASE_URI } from '../env/index.js';

console.log(styleText('yellow', 'Opening connection to PostgreSQL'));

const db = new Sequelize(DATABASE_URI, {
  logging: false,
});

export default db;
