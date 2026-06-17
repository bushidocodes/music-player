import path from 'path';
import express from 'express';
import type { ErrorRequestHandler } from 'express';
import configure from './configure/index.js';
import apiRouter from './routes/index.js';
import type { ConfiguredApp } from './types.js';

const app = express() as unknown as ConfiguredApp;
export default app;

configure(app);

app.use('/api', apiRouter);

app.use(function (req, res, next) {
  if (path.extname(req.path).length > 0) {
    res.status(404).end();
  } else {
    next(null);
  }
});

app.get('/*', function (req, res) {
  res.sendFile(app.get('indexHTMLPath'));
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
};
app.use(errorHandler);
