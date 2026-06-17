import path from 'path';
import express from 'express';
import configure from './configure/index.js';
import apiRouter from './routes/index.js';

const app = express();
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

app.use(function (err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});
