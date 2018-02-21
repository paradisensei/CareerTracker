'use strict';

const logger = require('../config/logger')('error');
const Error = require('../models/Error');

function handler(err, req, res, next) {
  if(err.code===11000){
    err = new Error.AlreadyExistError();
  }
  let error = err;
  let isError = false;
  for(let errname in Error){
    if(err instanceof Error[errname]){
      isError = true;
      break;
    }
  }
  if(!isError){
    logger.error(err);
    error = new Error.InternalError();
  }

  res.setHeader('Content-Type', 'application/json');
  res
    .status(error.code)
    .json(error);
}

module.exports = handler;