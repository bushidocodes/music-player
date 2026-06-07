'use strict';

const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');

module.exports = function (app) {

  const root = app.getValue('projectRoot');

  const publicPath = path.join(root, './public');
  const browserPath = path.join(root, './browser');

  // Serve only the specific node_modules packages referenced in browser/index.html
  app.use('/bootstrap', express.static(path.join(root, './node_modules/bootstrap')));
  app.use('/bootstrap-icons', express.static(path.join(root, './node_modules/bootstrap-icons')));

  app.use(favicon(app.getValue('faviconPath')));
  app.use(express.static(publicPath));
  app.use(express.static(browserPath));

};
