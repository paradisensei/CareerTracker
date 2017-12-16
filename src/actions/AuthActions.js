import { Assign } from '../lib/util';
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

    // get current user
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    // save raw user info to IPFS & receive its hash in return
    const hash = await saveUserToIPFS(user, ipfs);

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
    }

const saveUserToIPFS = (user, ipfs) => {
  const userBuf = Buffer.from(JSON.stringify(user), 'utf8');

  return new Promise((resolve, reject) => {
    ipfs.files.add(userBuf, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files[0].hash);
      }
    });
  });
}