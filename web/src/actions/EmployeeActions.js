import axios from 'axios';
import ethLib from 'eth-lib';

import {
  fetchUserFromIPFS,
  fetchOfferFromIPFS
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


export const setOffers = () =>
  async (dispatch, getState) => {
    const web3 = getState().web3.instance;
    const contract = getState().contract.instance;
    const address = getState().user.info.address;
    const ipfs = getState().ipfs.api;
    const pkey = getState().user.pkey;

    // 1. get user's new offers
    const resp = await axios.get(CONTRACTS_URL + '/emp/' + address, {
      headers: { 'Authorization': 'key' }
    });
    const offers = resp.data;

    // 2. get offers' encrypted details from IPFS
    const encryptedDetails = await Promise.all(
      offers.map(o => fetchOfferFromIPFS(ipfs, o.details))
    );

    // 3. get offers' orgs
    const orgHashes = await Promise.all(
      offers.map(o => contract.methods.orgInfo(o.org).call())
    );
    const orgs = await Promise.all(
      orgHashes.map(oh => fetchUserFromIPFS(ipfs, oh))
    );

    // 4. decrypt offers' details using orgs' public keys
    const details = [];
    encryptedDetails.forEach((d, i) => {
      details.push(
        JSON.parse(decrypt(pkey, orgs[i].publicKey, d))
      )
    });

    // 5. check offers authenticity using provided signatures
    const detailsHex = details.map(d => web3.utils.sha3(JSON.stringify(d)));
    const signatures = offers.map(o => o.orgSig);
    detailsHex.forEach((d, i) => {
      const realOrg = ethLib.account.recover(d, signatures[i]);
      if (realOrg.toLowerCase() !== offers[i].org) {
        console.log("ERROR!");
        //TODO maybe just delete this offer cause it`s invalid or raise error
      }
    });

    const finalOffers = offers.map((o, i) =>
      Assign(details[i], {
        orgName: orgs[i].name,
        date: getDate(new Date(o.timestamp)),
        details: o.details
      })
    );

    // store offers
    dispatch({
      type: SET_EMP_OFFERS,
      offers: finalOffers
    });
  };

export const considerOffer = (details, approve) =>
  (dispatch, getState) => {
    const web3 = getState().web3.instance;
    const pkey = getState().user.pkey;
    const offers = getState().employee.offers;

    // sign considered offer details
    const detailsHex = web3.utils.sha3(JSON.stringify(details));
    const sig = ethLib.account.sign(detailsHex, '0x' + pkey);

    const data = new FormData();
    data.append('details', details);
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
          offers: offers.filter(o => o.details !== details)
        })
      } else {
        //TODO
      }
    }).catch(console.log);
  };

export const setCareerProfile = () =>
  async (dispatch, getState) => {

    const contract = getState().contract.instance;
    const address = getState().user.info.address;
    const ipfs = getState().ipfs.api;

    // get employment records
    const count = await contract.methods.getEmpRecordsCount().call({from: address});

    let promises = [];
    for (let i = 0; i < count; i++) {
      promises.push(contract.methods.empRecordsOf(address, i).call());
    }
    const allEmpRecords = await Promise.all(promises);

    // fetch actual recommendation comments from IPFS
    promises = allEmpRecords.map(r => fetchComment(ipfs, r[3]));
    const comments = await Promise.all(promises);

    // get associated organizations's hashes
    promises = [];
    allEmpRecords.forEach(r =>
      promises.push(contract.methods.orgInfo(r[0]).call())
    );
    const orgHashes = await Promise.all(promises);

    // fetch organizations' info from IPFS
    promises = [];
    orgHashes.forEach(hash =>
      promises.push(fetchUserFromIPFS(ipfs, hash))
    );
    const orgs = await Promise.all(promises);

    const careerProfile = [];
    allEmpRecords.forEach((r, i) => {
      const org = orgs[i].name;
      const comment = comments[i];

      careerProfile.push({
        orgName: org,
        position: r[1],
        date: getDate(new Date(r[2] * 1000)),
        comment: comment,
        status: r[4]
      });
    })

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