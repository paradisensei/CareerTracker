'use strict';

const web3 = require('./ethereum');
const owner = require('../config').contract.owner;

const Account = web3.eth.accounts.privateKeyToAccount(owner);

Object.assign(exports, Account, {
  async send(tx){
    const { rawTransaction } = await Account.signTransaction(tx);
    return await new Promise(function(resolve, reject){
      web3.eth.sendSignedTransaction(rawTransaction)
        .once('transactionHash', resolve)
        .catch(reject);
    });
  }
});