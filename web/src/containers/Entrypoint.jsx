import React from 'react';
import { connect } from 'react-redux';
import { History } from '../store/index';

import { setUser, setPkey } from '../actions/EntrypointActions';

import PkeyPrompt from '../components/util/PkeyPrompt';

class Entrypoint extends React.Component {

  componentWillMount() {
    // check whether user is already set
    if (!this.props.user.set) {
      this.props.setUser();
    }
  }

  render() {
    const { user, setPkey } = this.props;

    // check if user's private key is already set
    if (!user.pkey) {
      return <PkeyPrompt setPkey={setPkey}/>
    }

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
  setPkey: (pkey) => dispatch(setPkey(pkey))
});

export default connect(mapStateToProps, mapDispatchToProps)(Entrypoint);