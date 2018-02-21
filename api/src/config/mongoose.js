'use strict';

const mongoose = require('mongoose');
const mongoUri = require('./index').mongoUri;

mongoose.Promise = global.Promise;
mongoose.connect(mongoUri, {
  useMongoClient: true
});

module.exports = mongoose;