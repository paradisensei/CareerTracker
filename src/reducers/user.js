import {
  SET_USER
} from '../constants/actions';

const initialState = {
  info: null,
  set: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, info: action.info, set: true }
    default:
      return state;
  }
}