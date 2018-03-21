'use strict';

const {
  NODE_ENV = 'development',

  PORT = 8080,
  API_KEY = 'key',
  HOST_URI = 'localhost:8080',

  MONGO_URI = '',

  ETHEREUM_RPC = '',

  CONTRACT_ADDRESS = '',
  CONTRACT_OWNER = ''
} = process.env;

module.exports = {
  env: NODE_ENV,

  port: PORT,
  apiKey: API_KEY,
  hostUri: HOST_URI,

  mongoUri: MONGO_URI,

  ethereumRpc: ETHEREUM_RPC,

  contract: {
    address: CONTRACT_ADDRESS,
    owner: CONTRACT_OWNER
  }
};