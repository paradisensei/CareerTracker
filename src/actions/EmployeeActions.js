import {
  SET_OFFERS,
  SET_CAREER_PROFILE
} from "../constants/actions";
import getDate from '../lib/getDate';

export const setOffers = () =>
  async (dispatch, getState) => {

    const contract = getState().contract.instance;
    const address = getState().user.info.address;

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
    const orgs = await Promise.all(promises);

    const offers = [];
    allOffers.forEach((o, i) => {
      const org = orgs[i];
      if (org) {
        offers.push({
          orgName: org[0],
          position: o[1],
          date: getDate(new Date(Number(o[2]))),
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

    // update offers
    dispatch({
      type: SET_OFFERS,
      offers: offers.filter(o => o.index !== index)
    });

    contract.methods.considerOffer(index, approve)
      .send({from: address}, (e, result) => {});
  }

export const setCareerProfile = () =>
  async (dispatch, getState) => {

    const contract = getState().contract.instance;
    const address = getState().user.info.address;

    // get employment records
    const count = await contract.methods.getEmpRecordsCount().call({from: address});

    let promises = [];
    for (let i = 0; i < count; i++) {
      promises.push(contract.methods.empRecordsOf(address, i).call());
    }
    const allEmpRecords = await Promise.all(promises);

    promises = [];
    allEmpRecords.forEach(r => {
      promises.push(contract.methods.orgInfo(r[0]).call());
    });
    const orgs = await Promise.all(promises);

    const careerProfile = [];
    allEmpRecords.forEach((r, i) => {
      const org = orgs[i];
      careerProfile.push({
        orgName: org[0],
        position: r[1],
        date: getDate(new Date(Number(r[2]))),
        status: r[3]
      });
    })

    // store employee's career profile
    dispatch({
      type: SET_CAREER_PROFILE,
      careerProfile: careerProfile
    });
  }