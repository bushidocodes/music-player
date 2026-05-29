'use strict';

var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');

module.exports = function (app) {

  var root = app.getValue('projectRoot');

  var publicPath = path.join(root, './public');
  var browserPath = path.join(root, './browser');

  // Serve only the specific node_modules packages referenced in browser/index.html
  app.use('/bootstrap', express.static(path.join(root, './node_modules/bootstrap')));
  app.use('/bootstrap-icons', express.static(path.join(root, './node_modules/bootstrap-icons')));

  app.use(favicon(app.getValue('faviconPath')));
  app.use(express.static(publicPath));
  app.use(express.static(browserPath));

};
