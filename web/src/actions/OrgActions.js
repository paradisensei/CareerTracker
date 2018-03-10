import ethLib from 'eth-lib';

import { Assign } from '../lib/util';
import { fetchUserFromIPFS } from "../lib/ipfs";
import { encrypt } from "../lib/crypto";
import {
  SET_EMPLOYEES,
  SET_PROFESSIONALS
} from '../constants/actions';
import {
  CONTRACTS_URL
} from '../properties/properties';


export const setEmployees = () =>
  async (dispatch, getState) => {

    const contract = getState().contract.instance;
    const address = getState().user.info.address;
    const ipfs = getState().ipfs.api;

    // get staff (employees)
    const staffAddr = await contract.methods.getStaff().call({from: address});

    // get hashes of staff members (employees)
    let promises = [];
    staffAddr.forEach(e =>
      promises.push(contract.methods.employeeInfo(e).call())
    );
    const empHashes = await Promise.all(promises);

    // fetch users' info from IPFS
    promises = [];
    empHashes.forEach(hash =>
      promises.push(fetchUserFromIPFS(ipfs, hash))
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
      const employee = Assign(e, {
        address: staffAddr[i], position: record[1], comment: record[3]
      });
      employees.push(employee);
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
    const ipfs = getState().ipfs.api;

    // get all employees' & staff' (employees) addresses
    const employees = await contract.methods.getEmployees().call();
    const staff = await contract.methods.getStaff().call({from: address});
    const profsAddr = employees.filter(e => !staff.includes(e));

    // get hashes of professionals
    let promises = [];
    profsAddr.forEach(p =>
      promises.push(contract.methods.employeeInfo(p).call())
    );
    const profHashes = await Promise.all(promises);

    // fetch professionals' info from IPFS
    promises = [];
    profHashes.forEach(hash =>
      promises.push(fetchUserFromIPFS(ipfs, hash))
    );
    const profs = await Promise.all(promises);

    const professionals = [];
    profs.forEach((p, i) => {
      const prof = Assign(p, { address: profsAddr[i] });
      professionals.push(prof);
    })

    // store professionals
    dispatch({
      type: SET_PROFESSIONALS,
      professionals: professionals
    });

  };

export const makeOffer = (prof, details) =>
  (dispatch, getState) => {
    const web3 = getState().web3.instance;
    const userAddress = getState().user.info.address;
    const professionals = getState().org.professionals;
    const ipfs = getState().ipfs.api;
    const pkey = getState().user.pkey;

    // 1. Sign details hash using org's private key
    const detailsHex = web3.utils.sha3(JSON.stringify(details));
    const sig = ethLib.account.sign(detailsHex, '0x' + pkey);

    // 2. Encrypt details using recipient's public key
    const detailsBuf = new Buffer(JSON.stringify(details), 'utf8');
    const encryptedDetails = encrypt(pkey, prof.publicKey, detailsBuf);
    const encryptedDetailsBuf = new Buffer(encryptedDetails, 'hex');

    // 3. Save encrypted details to IPFS & receive its hash in return
    ipfs.files.add(encryptedDetailsBuf, (err, files) => {
      const detailsHash = files[0].hash;

      const data = new FormData();
      data.append('details', detailsHash);
      data.append('org', userAddress);
      data.append('orgSig', sig);
      data.append('emp', prof.address);

      // send details info to API
      fetch(CONTRACTS_URL, {
        method: 'POST',
        headers: { 'Authorization': "key" },
        body: data
      }).then(resp => {
        if (resp.ok) {
          dispatch({
            type: SET_PROFESSIONALS,
            professionals: professionals.filter(p => p.address !== prof.address)
          })
        } else {
          //TODO
        }
      });
    });
  };

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
  };