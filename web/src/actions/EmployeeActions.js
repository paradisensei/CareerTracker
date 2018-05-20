import axios from 'axios';
import ethLib from 'eth-lib';

import {
  fetchUserFromIPFS,
  fetchOfferFromIPFS,
  fetchContractDetailsFromIPFS
} from "../lib/ipfs";
import { decrypt } from "../lib/crypto";
import getDate from '../lib/getDate';
import { Assign } from '../lib/util';
import {
  SET_EMP_OFFERS,
  SET_CAREER_PROFILE
} from "../constants/actions";
import {
  CONTRACTS_URL,
  CONSIDER_CONTRACT_URL
} from '../properties/properties';
const abi = require('../properties/abi/ContractAbi.json');


export const setOffers = () =>
  async (dispatch, getState) => {
    const web3 = getState().web3.instance;
    const contract = getState().contract.instance;
    const address = getState().user.info.address;
    const ipfs = getState().ipfs.api;
    const pkey = getState().user.pkey;

    // Get user's new offers
    const resp = await axios.get(CONTRACTS_URL + '/emp/' + address, {
      headers: { 'Authorization': 'key' }
    });
    const offers = resp.data;

    // Get offers' orgs
    const orgHashes = await Promise.all(
      offers.map(o => contract.methods.orgInfo(o.org).call())
    );
    const orgs = await Promise.all(
      orgHashes.map(o => fetchUserFromIPFS(ipfs, o))
    );

    // Check offers authenticity using provided signatures
    const detailsHex = offers.map(o => web3.utils.sha3(o.secretDetails + o.publicDetails));
    const signatures = offers.map(o => o.orgSig);
    detailsHex.forEach((d, i) => {
      const realOrg = ethLib.account.recover(d, signatures[i]);
      if (realOrg.toLowerCase() !== offers[i].org) {
        console.log("ERROR!");
        //TODO maybe just delete this offer cause it`s invalid or raise error
      }
    });

    // Get offers' encrypted details from IPFS
    const encryptedDetails = await Promise.all(
      offers.map(o => fetchOfferFromIPFS(o.secretDetails, true, ipfs))
    );

    // Get offers' public details from IPFS
    const publicDetails = await Promise.all(
      offers.map(o => fetchOfferFromIPFS(o.publicDetails, false, ipfs))
    );

    // Decrypt offers' secret details using orgs' public keys
    const secretDetails = encryptedDetails.map(
      (d, i) => JSON.parse(decrypt(pkey, orgs[i].publicKey, d))
    );

    // Construct original offers' details combining public & secret parts
    const details = publicDetails.map((d, i) => {
      return Assign(d, secretDetails[i]);
    });

    const finalOffers = offers.map((o, i) =>
      Assign(details[i], {
        orgName: orgs[i].name,
        date: getDate(new Date(o.timestamp)),
        publicDetails: o.publicDetails,
        secretDetails: o.secretDetails
      })
    );

    // store offers
    dispatch({
      type: SET_EMP_OFFERS,
      offers: finalOffers
    });
  };

export const considerOffer = (offer, approve) =>
  (dispatch, getState) => {
    const web3 = getState().web3.instance;
    const pkey = getState().user.pkey;
    const offers = getState().employee.offers;

    const { secretDetails, publicDetails } = offer;

    // Merge secret & public details hashes and sign using emp's private key
    const detailsHex = web3.utils.sha3(secretDetails + publicDetails);
    const sig = ethLib.account.sign(detailsHex, '0x' + pkey);

    const data = new FormData();
    data.append('details', publicDetails);
    data.append('approve', approve);
    data.append('sig', sig);

    // send request to API
    fetch(CONSIDER_CONTRACT_URL, {
      method: 'POST',
      headers: { 'Authorization': "key" },
      body: data
    }).then(resp => {
      if (resp.ok) {
        dispatch({
          type: SET_EMP_OFFERS,
          offers: offers.filter(o => {
            console.log(o.publicDetails);
            console.log(publicDetails);
            console.log(o.publicDetails !== publicDetails);
            return o.publicDetails !== publicDetails
          })
        })
      } else {
        //TODO
      }
    }).catch(console.log);
  };

export const setCareerProfile = () =>
  async (dispatch, getState) => {

    const web3 = getState().web3.instance;
    const contract = getState().contract.instance;
    const address = getState().user.info.address;
    const ipfs = getState().ipfs.api;

    // get employment records
    const allEmpRecords = await contract.methods.getEmpContracts().call({from: address});

    //TODO
    // fetch actual recommendation comments from IPFS
    // promises = allEmpRecords.map(r => fetchComment(ipfs, r[3]));
    // const comments = await Promise.all(promises);

    // get associated organizations's hashes

    let detailsPromises = [];
    let promises = [];
    allEmpRecords.forEach(r => {
      const empContract = new web3.eth.Contract(abi, r);
      detailsPromises.push(empContract.methods.publicDetails().call());
      promises.push(empContract.methods.org().call())
    });
    const detailsHash = await Promise.all(detailsPromises);
    const orgAddrs = await Promise.all(promises);

    const orgHashes = await Promise.all(orgAddrs.map(
      a => contract.methods.orgInfo(a).call()
    ));

    // fetch organizations' info from IPFS
    const orgs = await Promise.all(orgHashes.map(
      hash => fetchUserFromIPFS(ipfs, hash)
    ));

    // fetch contract details from IPFS
    const details = await Promise.all(detailsHash.map(
      hash => fetchContractDetailsFromIPFS(ipfs, hash)
    ));

    const careerProfile = [];
    orgs.forEach((o, i) => {
      const det = details[i];
      // const comment = comments[i];

      careerProfile.push({
        orgName: o.name,
        position: det.position,
        date: getDate(new Date(det.start)),
        // comment: comment,
        status: 0,
        contract: 'https://etherscan.io/address/' + allEmpRecords[i]
      });
    });

    // store employee's career profile
    dispatch({
      type: SET_CAREER_PROFILE,
      careerProfile: careerProfile
    });
  };

const fetchComment = (ipfs, hash) => new Promise((resolve, reject) => {
  if (!hash) {
    resolve(null);
  }
  ipfs.files.get(hash, (err, files) => {
    resolve(files[0].content.toString());
  });
});