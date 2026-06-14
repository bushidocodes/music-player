import path from 'path';
import express from 'express';
import favicon from 'serve-favicon';

export default function (app) {
  const root = app.getValue('projectRoot');

  const publicPath = path.join(root, './public');
  const browserPath = path.join(root, './browser');

  app.use('/bootstrap', express.static(path.join(root, './node_modules/bootstrap')));
  app.use('/bootstrap-icons', express.static(path.join(root, './node_modules/bootstrap-icons')));

  app.use(favicon(app.getValue('faviconPath')));
  app.use(express.static(publicPath));
  app.use(express.static(browserPath));
}
