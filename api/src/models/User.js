'use strict';

const mongoose = require('mongoose');
const Hidden = require('mongoose-hidden')();

const Error = require('../models/Error');

/**
 * @swagger
 * definitions:
 *
 *   User:
 *     type: object
 *     description: Объект пользователя
 *     properties:
 *       address:
 *         type: string
 *       name:
 *         type: string
 *       surname:
 *         type: string
 *       email:
 *         type: string
 *       inn:
 *         type: number
 *       role:
 *          type: string
 *          enum: [emp, org]
 */
const UserSchema = new mongoose.Schema({
  address: {
    type: String,
    unique: true,
    index: true,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  surname: {
    type: String,
    required: true
  },

  email: {
    type: String,
    unique: true
  },

  inn: {
    type: Number,
    unique: true,
    required: true
  },

  role: {
    type: String,
    required: true
  }
});

/**
 * Plugins
 */
UserSchema.plugin(Hidden);

/**
 * Methods
 */
UserSchema.method({
});

/**
 * Statics
 */
UserSchema.static({
  async byAddress(address){
    const user = await this.findOne({ address });
    if(!user){
      throw new Error.NotFoundError();
    }
    return user;
  },

  getUser(address){
    return this.findOne({ ethAddress: address });
  },

  getUsers(){
    return this.find({});
  }
});

module.exports = mongoose.model('User', UserSchema);