import chalk from 'chalk';
import Sequelize from 'sequelize';
import { DATABASE_URI } from '../env/index.js';

console.log(chalk.yellow('Opening connection to PostgreSQL'));

export default new Sequelize(DATABASE_URI, {
  logging: false,
});
