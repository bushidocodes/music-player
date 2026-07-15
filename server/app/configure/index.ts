import type { RequestHandler } from 'express';
import type { ConfiguredApp } from '../types.js';
import configureAppVariables from './app-variables.js';
import configureParsingMiddleware from './parsing-middleware.js';
import configureRateLimit from './rate-limit-middleware.js';
import configureStaticMiddleware from './static-middleware.js';

export default (app: ConfiguredApp) => {
  app.setValue = app.set.bind(app);
  app.getValue = (key) => app.get(key);

  configureAppVariables(app);

  app.use(app.getValue<RequestHandler>('log'));

  configureRateLimit(app);
  configureStaticMiddleware(app);
  configureParsingMiddleware(app);
};
