import db from './db.js';
import chalk from 'chalk';
import './models/index.js';

const syncedDbPromise = db.sync();

syncedDbPromise.then(() => {
  console.log(chalk.green('Sequelize models synced to PostgreSQL'));
});

export default syncedDbPromise;
