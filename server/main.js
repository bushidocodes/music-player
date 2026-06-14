import chalk from 'chalk';
import http from 'http';
import app from './app/index.js';
import startDb from './db/index.js';

const server = http.createServer();

const startServer = () => {
  const PORT = process.env.PORT || 1337;
  server.listen(PORT, () => {
    console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
  });
};

startDb
  .then(() => { server.on('request', app); })
  .then(startServer)
  .catch(err => {
    console.error(chalk.red(err.stack));
    process.exit(1);
  });
