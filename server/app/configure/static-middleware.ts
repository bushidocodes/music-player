import express from 'express';
import { createRequire } from 'module';
import path from 'path';
import favicon from 'serve-favicon';
import type { ConfiguredApp } from '../types.js';

const require = createRequire(import.meta.url);

export default function (app: ConfiguredApp) {
  const root = app.getValue<string>('projectRoot');

  const bootstrapPath = path.dirname(require.resolve('bootstrap/package.json'));
  const bootstrapIconsPath = path.dirname(
    require.resolve('bootstrap-icons/package.json')
  );

  app.use('/bootstrap', express.static(bootstrapPath));
  app.use('/bootstrap-icons', express.static(bootstrapIconsPath));

  app.use(favicon(app.getValue<string>('faviconPath')));
  app.use(express.static(path.join(root, './public')));
  app.use(express.static(path.join(root, './browser')));
}
