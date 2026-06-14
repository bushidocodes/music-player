import db from './db.js';
import { styleText } from 'node:util';
import './models/index.js';

const syncedDbPromise = db.sync();

syncedDbPromise.then(() => {
  console.log(styleText('green', 'Sequelize models synced to PostgreSQL'));
});

export default syncedDbPromise;
