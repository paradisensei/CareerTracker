import { Assign } from '../lib/util';
import {
  ADD_USER_PENDING,
  ADDED_USER
} from "../constants/actions";
import {
  EMPLOYEE, ORG
} from '../constants/roles';


export const addUser = (user, role) =>
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
      switch (role) {
        case EMPLOYEE:
          method = contract.methods.newEmployee(...Object.values(user));
          break;
        case ORG:
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
              info: Assign(user, { address: address, role:role  })
            })
        )
        //TODO add error handling
    });

  };