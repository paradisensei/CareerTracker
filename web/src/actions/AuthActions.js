import ethUtil from 'ethereumjs-util';

import { Assign } from '../lib/util';
import { saveBufToIPFS } from "../lib/ipfs";

import {
  ADD_USER_PENDING,
  ADDED_USER
} from "../constants/actions";
import {
  EMPLOYEE, ORG
} from '../constants/roles';


export const addUser = (user, role) =>
  async (dispatch, getState) => {

    const web3 = getState().web3.instance;
    const contract = getState().contract.instance;
    const ipfs = getState().ipfs.api;
    const pkey = getState().user.pkey;

    // get current user
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    // get current user's public key
    const publicKey = ethUtil.bufferToHex(ethUtil.privateToPublic('0x' + pkey));

    // save raw user info to IPFS & receive its hash in return
    Assign(user, { publicKey: publicKey });
    const userBuf = Buffer.from(JSON.stringify(user), 'utf8');
    const hash = await saveBufToIPFS(userBuf, ipfs);

    // construct necessary method based on user type
    let method;
    if (role === EMPLOYEE) {
      method = contract.methods.newEmployee(hash);
    } else if (role === ORG) {
      method = contract.methods.newOrg(hash);
    }

    method.send({from: address})
      .on('transactionHash', hash =>
        dispatch({
          type: ADD_USER_PENDING
        })
      )
      .on('receipt', receipt =>
        dispatch({
          type: ADDED_USER,
          info: Assign(user, { address: address, role:role  })
        })
      );
      //TODO add error handling
    };