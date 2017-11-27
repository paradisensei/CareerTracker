import React from 'react';
import { connect } from 'react-redux';
import { History } from '../store/index';

import { setUser } from '../actions/EntrypointActions';

import {
  EMPLOYEE, ORG
} from '../constants/roles';

import Empty from '../components/util/Empty';

class Home extends React.Component {

  componentWillMount() {
    // check whether user is already set
    if (!this.props.user.set) {
      this.props.setUser();
    }
  }

  render() {
    const user = this.props.user;

    if (!user.set) {
      return <Empty/>
    }

    // redirect to auth page if user has no account yet
    if (!user.info) {
      History.push('/auth');
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

const mapDispatchToProps = dispatch => ({
  setUser: () => dispatch(setUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);