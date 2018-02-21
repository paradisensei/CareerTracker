'use strict';

const {
  NODE_ENV = 'development',

  PORT = 8080,
  API_KEY = 'key',
  HOST_URI = 'localhost:8080',

  MONGO_URI = '',
} = process.env;

module.exports = {
  env: NODE_ENV,

  port: PORT,
  apiKey: API_KEY,
  hostUri: HOST_URI,

  mongoUri: MONGO_URI,
};