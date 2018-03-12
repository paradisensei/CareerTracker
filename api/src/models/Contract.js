'use strict';

const mongoose = require('mongoose');
const Hidden = require('mongoose-hidden')();

const Error = require('../models/Error');

/**
 * @swagger
 * definitions:
 *
 *   Contract:
 *     type: object
 *     description: Объект оффера/контракта между компанией и работником
 *     properties:
 *       details:
 *         type: string
 *       org:
 *         type: string
 *       orgSig:
 *         type: string
 *       emp:
 *         type: string
 *       empSig:
 *         type: string
 *       timestamp:
 *         type: string
 *       status:
 *          type: string
 *          enum: [approved, declined]
 */
const ContractSchema = new mongoose.Schema({
  details: {
    type: String,
    required: true
  },

  org: {
    type: String,
    required: true,
    index: true
  },

  orgSig: {
    type: String,
    required: true
  },

  emp: {
    type: String,
    required: true,
    index: true
  },

  empSig: {
    type: String
  },

  timestamp: {
    type: Date,
    default: Date.now
  },

  status: {
    type: String,
    default: null
  }
});

/**
 * Plugins
 */
ContractSchema.plugin(Hidden);

/**
 * Methods
 */
ContractSchema.method({



});

/**
 * Statics
 */
ContractSchema.static({
  byDetails(details){
    const c = this.findOne({ details });
    if (!c) {
      throw new Error.NotFoundError();
    }
    return c;
  },

  getOrgContracts(address){
    return this.find({ org: address });
  },

  getEmpContracts(address){
    return this.find({
      emp: address,
      status: null
    });
  }
});

module.exports = mongoose.model('Contract', ContractSchema);