import { Assign } from '../lib/util';
import {
  ADD_USER_PENDING,
  ADDED_USER
} from "../constants/actions";


export const addUser = (user, type) =>
  (dispatch, getState) => {

    dispatch({
      type: ADD_USER_PENDING
    });

    const web3 = getState().web3.instance;
    const contract = getState().contract.instance;

    // Add new user
    web3.eth.getAccounts().then(accounts => {
      const address = accounts[0];

      let method;
      switch (type) {
        case 'employee':
          method = contract.methods.newEmployee(...Object.values(user));
          break;
        case 'org':
          method = contract.methods.newOrg(...Object.values(user));
          break;
        default:
          //TODO
      }

      method.send({from: address})
        .then(
          receipt =>
            dispatch({
              type: ADDED_USER,
              info: Assign(user, { address: address })
            })
        )
        //TODO add error handling
    });

  };