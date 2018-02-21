'use strict';

const log4js = require('log4js');

log4js.configure({
  appenders: {
    out: {
      type: 'stdout'
    }
  },
  categories: {
    default: {
      appenders: ['out'], 
      level: 'debug' 
    } 
  }
});

const loggers = {
};

module.exports = function logger(namespace = 'default'){
  const isNamespace = !!loggers[namespace];
  if(!isNamespace){
    loggers[namespace] = log4js.getLogger(namespace);
  }
  return loggers[namespace];
};