import {
  SET_EMPLOYEES, SET_PROFESSIONALS
} from '../constants/actions';

export const setEmployees = () =>
  (dispatch, getState) => {

    const contract = getState().contract.instance;
    const address = getState().user.info.address;

    // get staff (employees)
    contract.methods.getStaff().call({from: address})
      .then(staff => {
        // get information about staff (employees)
        let promises = [];
        staff.forEach(e =>
          promises.push(contract.methods.employeeInfo(e).call())
        );
        return Promise.all(promises);
      })
      .then(staff => {
        const employees = [];

        staff.forEach(e => {
          employees.push({
            name: e[0],
            email: e[1],
            city: e[2],
            passport: Number(e[3]),
            profession: e[4]
          });
        })

        // store employees
        dispatch({
          type: SET_EMPLOYEES,
          employees: employees
        });
      })

  };

export const setProfessionals = () =>
  async (dispatch, getState) => {

    const contract = getState().contract.instance;
    const address = getState().user.info.address;

    // get all employees' & staff' (employees) addresses
    const employees = await contract.methods.getEmployees().call();
    const staff = await contract.methods.getStaff().call({from: address});
    const profsAddr = employees.filter(e => !staff.includes(e));

    // get information about professionals
    let promises = [];
    profsAddr.forEach(p =>
      promises.push(contract.methods.employeeInfo(p).call())
    );
    const profs = await Promise.all(promises);

    const professionals = [];
    profs.forEach((p, i) => {
      professionals.push({
        address: profsAddr[i],
        name: p[0],
        email: p[1],
        city: p[2],
        passport: Number(p[3]),
        profession: p[4]
      });
    })

    // store employees
    dispatch({
      type: SET_PROFESSIONALS,
      professionals: professionals
    });

  };

export const makeOffer = (address) =>
  (dispatch, getState) => {

    const contract = getState().contract.instance;
    const userAddress = getState().user.info.address;
    const professionals = getState().org.professionals;

    // update professionals
    dispatch({
      type: SET_PROFESSIONALS,
      professionals: professionals.filter(p => p.address !== address)
    });

    //TODO get position from user input
    contract.methods.makeOffer(address, 'Developer')
      .send({from: userAddress}, (e, result) => {});
  }