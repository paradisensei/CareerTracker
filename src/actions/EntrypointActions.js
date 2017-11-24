import {
  SET_USER
} from "../constants/actions";


export const setUser = () =>
  (dispatch, getState) => {

    const web3 = getState().web3.instance;
    const contract = getState().contract.instance;

    // Find current user
    let account;
    let user = null;
    web3.eth.getAccounts()
      .then(accounts => {
        account = accounts[0];
        return Promise.all([
          contract.methods.employeeInfo(account).call(),
          contract.methods.orgInfo(account).call
        ]);
      })
      .then(([employee, org]) => {
        // check if employee or org
        if (employee[1]) {
          user = {
            address: account,
            role: 'employee',
            name: employee[0],
            email: employee[1],
            city: employee[2],
            passport: Number(employee[3]),
            profession: employee[4]
          }
        } else if (org[0]) {
          user = {
            address: account,
            role: 'org',
            name: org[0],
            city: org[1],
            inn: org[2],
            sphere: org[3]
          };
        }

        // dispatch action & update state
        dispatch({
          type: SET_USER,
          info: user
        });
      })
      .catch(console.log);

  };