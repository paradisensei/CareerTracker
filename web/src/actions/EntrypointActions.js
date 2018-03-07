import { Assign } from '../lib/util';
import { fetchObjectFromIPFS } from "../lib/ipfs";
import {
  SET_USER,
  SET_PKEY
} from "../constants/actions";
import {
  EMPLOYEE, ORG
} from '../constants/roles';


export const setUser = () =>
  async (dispatch, getState) => {

    const web3 = getState().web3.instance;
    const contract = getState().contract.instance;
    const ipfs = getState().ipfs.api;

    // get current user's address
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    let user = null;

    // check if user has employee account
    let userHash = await contract.methods.employeeInfo(address).call();
    if (userHash) {
      const ans = await fetchObjectFromIPFS(ipfs, userHash);
      user = Assign(ans, { address: address, role: EMPLOYEE });
    } else {
      // check if user has organization account
      userHash = await contract.methods.orgInfo(address).call();
      if (userHash) {
        const ans = await fetchObjectFromIPFS(ipfs, userHash);
        console.log(ans);
        user = Assign(ans, { address: address, role: ORG });
      }
    }

    // dispatch action & update state
    dispatch({
      type: SET_USER,
      info: user
    });
  };

export const setPkey = (pkey) =>
  async (dispatch, getState) => {
    // dispatch action & update state
    dispatch({
      type: SET_PKEY,
      pkey: pkey
    });
  };