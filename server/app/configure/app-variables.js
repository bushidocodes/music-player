'use strict';

var path = require('path');
var logMiddleware = require('volleyball');

var rootPath = path.join(__dirname, '../../../');
var indexPath = path.join(rootPath, './public/index.html');
var faviconPath = path.join(rootPath, './browser/favicon.ico');

var env = require(path.join(rootPath, './server/env'));

module.exports = function (app) {
  app.setValue('env', env);
  app.setValue('projectRoot', rootPath);
  app.setValue('indexHTMLPath', indexPath);
  app.setValue('faviconPath', faviconPath);
  app.setValue('log', logMiddleware);
};
