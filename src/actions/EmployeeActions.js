import fetchUserFromIPFS from '../lib/fetchUserFromIPFS';
import getDate from '../lib/getDate';
import {
  SET_OFFERS,
  SET_CAREER_PROFILE
} from "../constants/actions";


export const setOffers = () =>
  async (dispatch, getState) => {

    const contract = getState().contract.instance;
    const address = getState().user.info.address;
    const ipfs = getState().ipfs.api;

    // get all offers with 'No' status
    const count = await contract.methods.getOffersCount().call({from: address});

    let promises = [];
    for (let i = 0; i < count; i++) {
      promises.push(contract.methods.offersOf(address, i).call())
    }
    const allOffers = await Promise.all(promises);

    promises = [];
    allOffers.forEach(o => {
      if (Number(o[3]) === 0) {
        promises.push(contract.methods.orgInfo(o[0]).call());
      } else {
        promises.push(Promise.resolve(null));
      }
    });
    const orgHashes = await Promise.all(promises);

    // fetch organizations' info from IPFS
    promises = [];
    orgHashes.forEach(hash => {
      promises.push(fetchUserFromIPFS(ipfs, hash))
      }
    );
    const orgs = await Promise.all(promises);

    const offers = [];
    allOffers.forEach((o, i) => {
      const org = orgs[i];
      if (org) {
        offers.push({
          orgName: org.name,
          position: o[1],
          date: getDate(new Date(o[2] * 1000)),
          index: i
        });
      }
    })

    // store offers
    dispatch({
      type: SET_OFFERS,
      offers: offers
    });

  };

export const considerOffer = (index, approve) =>
  (dispatch, getState) => {

    const contract = getState().contract.instance;
    const address = getState().user.info.address;
    const offers = getState().employee.offers;

    contract.methods.considerOffer(index, approve)
      .send({from: address})
      .on('transactionHash', hash =>
        dispatch({
          type: SET_OFFERS,
          offers: offers.filter(o => o.index !== index)
        })
      );
  }

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
  }

const fetchComment = (ipfs, hash) => new Promise((resolve, reject) => {
  if (!hash) {
    resolve(null);
  }
  ipfs.files.get(hash, (err, files) => {
    resolve(files[0].content.toString());
  });
});