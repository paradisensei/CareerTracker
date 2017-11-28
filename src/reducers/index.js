import { routerReducer } from 'react-router-redux';

import web3 from './web3';
import contract from './contract';
import user from './user';
import employee from './employee';
import org from './org';

export default {
  routing: routerReducer,
  web3,
  contract,
  user,
  employee,
  org
};