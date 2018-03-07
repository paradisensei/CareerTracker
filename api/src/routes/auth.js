'use strict';

const AccessDenied = require('../models/Error').AccessDeniedError;

/**
 * @swagger
 *   securityDefinitions:
 *     BasicAuth:
 *       type: apiKey
 *       name: Authorization
 *       in: header
 */
function BasicAuth(req, def, token, callback){
  console.log(req);
  console.log('--------------------------');
  console.log(def);
  console.log();
  if (token === '!') {
    return callback();
  }
  return req.res
    .status(403)
    .json(new AccessDenied());
}

module.exports = { BasicAuth };