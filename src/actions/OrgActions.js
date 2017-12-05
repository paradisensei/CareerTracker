import { Assign } from '../lib/util';
import {
  SET_EMPLOYEES,
  SET_PROFESSIONALS
} from '../constants/actions';


export const setEmployees = () =>
  async (dispatch, getState) => {

    const contract = getState().contract.instance;
    const address = getState().user.info.address;

    // get staff (employees)
    const staffAddr = await contract.methods.getStaff().call({from: address});

    // get information about staff (employees)
    let promises = [];
    staffAddr.forEach(e =>
      promises.push(contract.methods.employeeInfo(e).call())
    );
    const empls = await Promise.all(promises);

    // get last employment record for every employee
    promises = [];
    staffAddr.forEach(e =>
      promises.push(contract.methods.getEmpRecordsCount().call({from: e}))
    );
    const emplsRecCount = await Promise.all(promises);

    promises = [];
    staffAddr.forEach((e, i) => {
      const last = emplsRecCount[i] - 1;
      promises.push(contract.methods.empRecordsOf(e, last).call());
    });
    const emplsRec = await Promise.all(promises);


    const employees = [];
    empls.forEach((e, i) => {
      const record = emplsRec[i];
      employees.push({
        address: staffAddr[i],
        name: e[0],
        email: e[1],
        city: e[2],
        passport: Number(e[3]),
        position: record[1],
        comment: record[3]
      });
    })

    // store employees
    dispatch({
      type: SET_EMPLOYEES,
      employees: employees
    });

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

    // store professionals
    dispatch({
      type: SET_PROFESSIONALS,
      professionals: professionals
    });

  };

export const makeOffer = (prof) =>
  (dispatch, getState) => {

    const contract = getState().contract.instance;
    const userAddress = getState().user.info.address;
    const professionals = getState().org.professionals;

    contract.methods.makeOffer(prof.address, prof.profession)
      .send({from: userAddress})
      .on('transactionHash', hash =>
        dispatch({
          type: SET_PROFESSIONALS,
          professionals: professionals.filter(p => p.address !== prof.address)
        })
      );
  }

export const addComment = (address, comment) =>
  (dispatch, getState) => {

    const contract = getState().contract.instance;
    const userAddress = getState().user.info.address;
    const employees = getState().org.employees;
    const ipfs = getState().ipfs.api;

    // if comment is not empty
    if (comment) {
      // save comment to IPFS & receive its hash in return
      const commentBuf = Buffer.from(comment, 'utf8');
      ipfs.files.add(commentBuf, (err, files) => {
        const commentHash = files[0].hash;

        // save comment's hash to blockchain
        contract.methods.comment(address, commentHash)
          .send({from: userAddress})
          .on('transactionHash', hash => {
            const updatedEmployees = employees.map(e => {
              if (e.address === address) {
                return Assign(e, { comment: comment })
              }
              return e;
            });
            dispatch({
              type: SET_EMPLOYEES,
              employees: updatedEmployees
            });
          });
      });
    }
  }