import React from 'react';
import { connect } from 'react-redux';
import { History } from '../store/index';

import {
  EMPLOYEE, ORG
} from '../constants/roles';

class Home extends React.Component {

  render() {
    const user = this.props.user;

    if (!user.set) {
      History.push('/');
      return null;
    }

    switch (user.info.role) {
      case EMPLOYEE:
        History.push('/home/employee');
        break;
      case ORG:
        History.push('/home/org');
        break;
      default:
      //TODO
    }

    // just a stub, actually redirect happens
    return null;
  }
}

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(Home);