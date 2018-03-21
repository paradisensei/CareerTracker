'use strict';

const web3 = require('./ethereum');
const contractAbi = require('../config/abi/contractAbi.json');
const contractAddress = require('../config').contract.address;
const account = require('./account');

const contract = new web3.eth.Contract(contractAbi, contractAddress);
const Methods = contract.methods;

function fromOwner(methodName, ...args){
  const method = Methods[methodName](...args);
  return async function(){
    const gas = await method.estimateGas({ from: account.address });
    const tx = {
      to: contractAddress,
      gasLimit: gas,
      data: method.encodeABI()
    };
    return account.send(tx);
  };
}

Object.assign(exports, {
  account,
  contract,
  methods: Methods,
  address: contractAddress,

  publishContract(emp, org, secretDetails, publicDetails, orgSig, empSig){
    return fromOwner(
      'publishContract',
      emp, org, secretDetails, publicDetails, orgSig, empSig
    )();
  }

});