import Web3 from 'web3';
import {
  CONTRACT_ADDRESS
} from '../properties/properties';
const abi = require('../properties/abi/CareerTrackerAbi.json');

// instantiate web3
const web3 = new Web3(Web3.givenProvider);
// instantiate contract
const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

const initialState = {
  instance: contract
};

export default function(state = initialState) {
  return state;
}