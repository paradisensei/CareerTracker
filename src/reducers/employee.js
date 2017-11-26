import {
  SET_OFFERS
} from '../constants/actions';

const initialState = {
  offers: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_OFFERS:
      return { ...state, offers: action.offers }
    default:
      return state;
  }
}