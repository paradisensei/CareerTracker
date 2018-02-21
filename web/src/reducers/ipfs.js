import ipfsAPI from 'ipfs-api';
import {
  IPFS_API_SERVER
} from '../properties/properties';

const initialState = {
  api: ipfsAPI(IPFS_API_SERVER)
};

export default function(state = initialState) {
  return state;
}