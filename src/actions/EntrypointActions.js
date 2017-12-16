import { Assign } from '../lib/util';
import fetchUserFromIPFS from '../lib/fetchUserFromIPFS';
import {
  SET_USER
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
      const emp = await fetchUserFromIPFS(ipfs, userHash);
      user = Assign(emp, { address: address, role: EMPLOYEE });
    }

    // check if user has organization account
    userHash = await contract.methods.orgInfo(address).call();
    if (userHash) {
      const org = await fetchUserFromIPFS(ipfs, userHash);
      user = Assign(org, { address: address, role: ORG });
    }

    // dispatch action & update state
    dispatch({
      type: SET_USER,
      info: user
    });
  };