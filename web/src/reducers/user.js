import {
  SET_USER,
  ADD_USER_PENDING,
  ADDED_USER
} from '../constants/actions';

const initialState = {
  info: null,
  set: false,
  pending: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, info: action.info, set: true }
    case ADD_USER_PENDING:
      return { ...state, pending: true }
    case ADDED_USER:
      return { ...state, info: action.info, set: true, pending: false }
    default:
      return state;
  }
}