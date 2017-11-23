import Web3 from 'web3';

// instantiate web3
const web3 = new Web3(Web3.givenProvider);
// instantiate contract
const contractInfo = require('../properties/CareerTrackerInfo.json');
const contract = new web3.eth.Contract(contractInfo.abi, contractInfo.address);

const initialState = {
  instance: contract
};

export default function(state = initialState) {
  return state;
}