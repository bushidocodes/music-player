'use strict';
/* eslint-disable global-require */

const chalk = require('chalk');

// Requires in ./db/index.js -- which returns a promise that represents
// sequelize syncing its models to the postgreSQL database.
const startDb = require('./db');

// Create a node server instance! cOoL!
const server = require('http').createServer();

const createApplication = () => {
    const app = require('./app');
    server.on('request', app); // Attach the Express application.
};

const startServer = () => {
    const PORT = process.env.PORT || 1337;
    server.listen(PORT, () => {
        console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
    });
};

startDb
    .then(createApplication)
    .then(startServer)
    .catch(err => {
        console.error(chalk.red(err.stack));
        process.exit(1);
    });
