// get our express server as module, and start it up
const app = require('./api/index');
const express = require('express');
const path = require('path');

// for production server
if (process.env.ENVIRONMENT == 'PRODUCTION') {
  app.use(express.static(path.join(__dirname + '/dist/')));
}

