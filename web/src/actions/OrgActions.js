import axios from 'axios';
import ethLib from 'eth-lib';

import { Assign } from '../lib/util';
import {
  saveBufToIPFS,
  fetchUserFromIPFS,
  fetchContractDetailsFromIPFS
} from "../lib/ipfs";
import { encrypt, decrypt } from "../lib/crypto";
import getDate from '../lib/getDate';
import {
  SET_EMPLOYEES,
  SET_ORG_OFFERS,
  SET_PROFESSIONALS
} from '../constants/actions';
import {
  CONTRACTS_URL
} from '../properties/properties';
const abi = require('../properties/abi/ContractAbi.json');


export const setEmployees = () =>
  async (dispatch, getState) => {

    const web3 = getState().web3.instance;
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
      promises.push(contract.methods.getEmpContractsCount().call({from: e}))
    );
    const emplsRecCount = await Promise.all(promises);

    promises = [];
    staffAddr.forEach((e, i) => {
      const last = emplsRecCount[i] - 1;
      promises.push(contract.methods.empContractsOf(e, last).call());
    });
    const empLastContract = await Promise.all(promises);

    promises = [];
    empls.forEach((e, i) => {
      const empContract = new web3.eth.Contract(abi, empLastContract[i]);
      promises.push(empContract.methods.publicDetails().call());
    });
    const empDetailsHash = await Promise.all(promises);

    promises = [];
    empls.forEach((e, i) => {
      promises.push(fetchContractDetailsFromIPFS(ipfs, empDetailsHash[i]));
    });
    const empDetails = await Promise.all(promises);

    const employees = empls.map((e, i) => Assign(e, {
      address: staffAddr[i],
      position: empDetails[i]['position'],
      start: empDetails[i]['start'],
      contract: 'https://etherscan.io/address/' + empLastContract[i]
    }));

    // store employees
    dispatch({
      type: SET_EMPLOYEES,
      employees: employees
    });

  };

export const setOffers = () =>
  async (dispatch, getState) => {
    const web3 = getState().web3.instance;
    const contract = getState().contract.instance;
    const address = getState().user.info.address;
    const ipfs = getState().ipfs.api;

    // Get offers sent by org
    const resp = await axios.get(CONTRACTS_URL + '/org/' + address, {
      headers: { 'Authorization': 'key' }
    });
    const offers = resp.data;

    // Get offers' employees
    const empHashes = await Promise.all(
      offers.map(o => contract.methods.employeeInfo(o.emp).call())
    );
    const emps = await Promise.all(
      empHashes.map(o => fetchUserFromIPFS(ipfs, o))
    );

    // Check offers authenticity using provided signatures
    const detailsHex = offers.map(o => web3.utils.sha3(o.secretDetails + o.publicDetails));
    const signatures = offers.map(o => o.empSig);
    detailsHex.forEach((d, i) => {
      if (signatures[i]) {
        const realEmp = ethLib.account.recover(d, signatures[i]);
        if (realEmp.toLowerCase() !== offers[i].emp) {
          console.log("ERROR!");
          //TODO maybe just delete this offer cause it`s invalid or raise error
        }
      }
    });

    const finalOffers = offers.map((o, i) =>
      Assign({}, {
        empName: emps[i].name,
        date: getDate(new Date(o.timestamp)),
        status: o.status,
      })
    );

    // store offers
    dispatch({
      type: SET_ORG_OFFERS,
      offers: finalOffers
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
    });

    // store professionals
    dispatch({
      type: SET_PROFESSIONALS,
      professionals: professionals
    });

  };

export const makeOffer = (prof, details) =>
  async (dispatch, getState) => {
    const web3 = getState().web3.instance;
    const userAddress = getState().user.info.address;
    const professionals = getState().org.professionals;
    const ipfs = getState().ipfs.api;
    const pkey = getState().user.pkey;

    // Split contract details into public & secret parts
    const { position, start, ...secretDetails } = details;
    const publicDetails = { position, start };

    // Encrypt secret details using recipient's public key & save to IPFS
    let detailsBuf = new Buffer(JSON.stringify(secretDetails), 'utf8');
    const encryptedDetails = encrypt(pkey, prof.publicKey, detailsBuf);
    const encryptedDetailsBuf = new Buffer(encryptedDetails, 'hex');
    const secretDetailsHash = await saveBufToIPFS(encryptedDetailsBuf, ipfs);

    // Save public details to IPFS & receive its hash in return
    detailsBuf = new Buffer(JSON.stringify(publicDetails), 'utf8');
    const publicDetailsHash = await saveBufToIPFS(detailsBuf, ipfs);

    // Merge secret & public details hashes and sign using org's private key
    const detailsHex = web3.utils.sha3(secretDetailsHash + publicDetailsHash);
    const sig = ethLib.account.sign(detailsHex, '0x' + pkey);

    // Save offer info to API
    const data = new FormData();
    data.append('publicDetails', publicDetailsHash);
    data.append('secretDetails', secretDetailsHash);
    data.append('org', userAddress);
    data.append('orgSig', sig);
    data.append('emp', prof.address);

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