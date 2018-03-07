import {
  SET_USER,
  SET_PKEY,
  ADD_USER_PENDING,
  ADDED_USER
} from '../constants/actions';

const initialState = {
  info: null,
  pkey: null,
  set: false,
  pending: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, info: action.info, set: true };
    case SET_PKEY:
      return { ...state, pkey: action.pkey };
    case ADD_USER_PENDING:
      return { ...state, pending: true };
    case ADDED_USER:
      return { ...state, info: action.info, set: true, pending: false };
    default:
      return state;
  }
}