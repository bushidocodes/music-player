import { styleText } from 'node:util';
import http from 'http';
import app from './app/index.js';
import startDb from './db/index.js';

const server = http.createServer();

const startServer = () => {
  const PORT = process.env.PORT || 1337;
  server.listen(PORT, () => {
    console.log(styleText('blue', 'Server started on port') + ' ' + styleText('magenta', String(PORT)));
  });
};

startDb
  .then(() => { server.on('request', app); })
  .then(startServer)
  .catch(err => {
    console.error(styleText('red', err.stack));
    process.exit(1);
  });
