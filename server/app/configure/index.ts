import configureAppVariables from './app-variables.js';
import configureStaticMiddleware from './static-middleware.js';
import configureParsingMiddleware from './parsing-middleware.js';
import type { ConfiguredApp } from '../types.js';

export default (app: ConfiguredApp) => {
  app.setValue = app.set.bind(app);
  app.getValue = (key) => app.get(key);

  configureAppVariables(app);

  app.use(app.getValue('log'));

  configureStaticMiddleware(app);
  configureParsingMiddleware(app);
};
