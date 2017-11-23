import Web3 from 'web3';

const initialState = {
  instance: new Web3(Web3.givenProvider)
};

export default function(state = initialState) {
  return state;
}