import {
  SET_EMP_OFFERS,
  SET_CAREER_PROFILE
} from '../constants/actions';

const initialState = {
  offers: null,
  careerProfile: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_EMP_OFFERS:
      return { ...state, offers: action.offers }
    case SET_CAREER_PROFILE:
      return { ...state, careerProfile: action.careerProfile }
    default:
      return state;
  }
}