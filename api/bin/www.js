#!/usr/bin/env node
'use strict';

const app = require('../src/app.js');
const mongoose = require('../src/config/mongoose');
const logger = require('../src/config/logger')('app');
const port = require('../src/config').port;

mongoose.connection.on('connected', function () {  
  app.listen(port, () =>
    logger.info(`Started on port ${port}`)
  );
});

function graceful(){
  mongoose.connection.close(function(){
    process.exit(0);
  });
}

process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);