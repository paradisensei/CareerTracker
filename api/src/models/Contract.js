'use strict';

const mongoose = require('mongoose');
const Hidden = require('mongoose-hidden')();

const Contract = require('../rpc/contract');

const Error = require('../models/Error');

/**
 * @swagger
 * definitions:
 *
 *   Contract:
 *     type: object
 *     description: Объект оффера/контракта между компанией и работником
 *     properties:
 *       publicDetails:
 *         type: string
 *       secretDetails:
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
  publicDetails: {
    type: String,
    required: true
  },

  secretDetails: {
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
  async consider(approve, sig){
    this.empSig = sig;
    if (approve) {
      this.status = 'approved';
      const txId = await Contract.publishContract(
        this.emp, this.org, this.secretDetails, this.publicDetails, this.orgSig, sig
      );
      console.log(txId);
    } else {
      this.status = 'declined';
    }
    await this.save();
  }
});

/**
 * Statics
 */
ContractSchema.static({
  byDetails(publicDetails){
    const c = this.findOne({ publicDetails });
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