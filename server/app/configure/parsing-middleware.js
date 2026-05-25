'use strict';

var express = require('express');

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
