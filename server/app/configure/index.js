import configureAppVariables from './app-variables.js';
import configureStaticMiddleware from './static-middleware.js';
import configureParsingMiddleware from './parsing-middleware.js';

export default (app) => {
  app.setValue = app.set.bind(app);
  app.getValue = (key) => app.get(key);

  configureAppVariables(app);

  app.use(app.getValue('log'));

  configureStaticMiddleware(app);
  configureParsingMiddleware(app);
};
