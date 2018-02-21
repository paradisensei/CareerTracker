import React from 'react';
import { connect } from 'react-redux';
import { History } from '../store/index';

import { setUser } from '../actions/EntrypointActions';

class Entrypoint extends React.Component {

  componentWillMount() {
    // check whether user is already set
    if (!this.props.user.set) {
      this.props.setUser();
    }
  }

  render() {
    const user = this.props.user;

    if (user.set) {
      const redirect = user.info ? '/home' : '/auth';
      History.push(redirect);
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

export default connect(mapStateToProps, mapDispatchToProps)(Entrypoint);