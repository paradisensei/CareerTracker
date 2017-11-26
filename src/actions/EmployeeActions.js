import {
  SET_OFFERS
} from "../constants/actions";
import getDate from '../lib/getDate';

export const setOffers = () =>
  (dispatch, getState) => {

    const contract = getState().contract.instance;
    const address = getState().user.info.address;
    const offers = getState().employee.offers;

    // get all offers with 'No' status
    contract.methods.getOffersCount().call({from: address})
      .then(count => {
        const promises = [];
        for (let i = 0; i < count; i++) {
          promises.push(contract.methods.offersOf(address, i).call())
        }
        return Promise.all(promises);
      })
      .then(offs => {
        //TODO promisify this part
        offs.forEach((o, i) => {
          if (o[0] && Number(o[3]) === 0) {
            contract.methods.orgInfo(o[0]).call((e, org) => {
              let arr = [];
              if (offers) {
                arr = offers.slice();
              }
              arr.push({
                orgName: org[0],
                position: o[1],
                date: getDate(new Date(Number(o[2]))),
                index: i
              });
              dispatch({
                type: SET_OFFERS,
                offers: arr
              });
            });
          }
        });
      })

  };

export const considerOffer = (index, approve) =>
  (dispatch, getState) => {
    //TODO
    this.props.contract.methods.considerOffer(index, approve)
      .send({from: this.props.user.address}, (e, result) => {});
  }