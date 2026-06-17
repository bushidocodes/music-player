import path from 'path';
import { createRequire } from 'module';
import express from 'express';
import favicon from 'serve-favicon';

const require = createRequire(import.meta.url);

export default function (app) {
  const root = app.getValue('projectRoot');

  const bootstrapPath = path.dirname(require.resolve('bootstrap/package.json'));
  const bootstrapIconsPath = path.dirname(require.resolve('bootstrap-icons/package.json'));

  app.use('/bootstrap', express.static(bootstrapPath));
  app.use('/bootstrap-icons', express.static(bootstrapIconsPath));

  app.use(favicon(app.getValue('faviconPath')));
  app.use(express.static(path.join(root, './public')));
  app.use(express.static(path.join(root, './browser')));
}
