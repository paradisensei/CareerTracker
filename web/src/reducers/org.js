import {
  SET_EMPLOYEES,
  SET_PROFESSIONALS
} from '../constants/actions';

const initialState = {
  employees: null,
  professionals: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_EMPLOYEES:
      return { ...state, employees: action.employees }
    case SET_PROFESSIONALS:
      return { ...state, professionals: action.professionals }
    default:
      return state;
  }
}