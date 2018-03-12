import React from 'react';
import { connect } from 'react-redux';
import { History } from '../../store/index';

import { setProfessionals, makeOffer } from '../../actions/OrgActions';

import Empty from '../../components/util/Empty';
import Professional from '../../components/org/Professional';

import Grid from 'material-ui/Grid';

class Search extends React.Component {

  render() {
    const { user, professionals, setProfessionals, makeOffer } = this.props;

    if (!user.set) {
      History.push('/');
      return null;
    }

    if (!professionals) {
      setProfessionals();
    }

    if (!professionals) {
      return <Empty/>
    }

    let body = null;
    if (professionals.length > 0) {
      body = <div>
        <Grid container spacing={24}>{
          professionals.map(p => <Professional prof={p} makeOffer={makeOffer}/>)
        }</Grid>
      </div>
    }

    return (
      <div>
        <h1>Найдите лучшего работника</h1>
        {body}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  professionals: state.org.professionals
});

const mapDispatchToProps = dispatch => ({
  setProfessionals: () => dispatch(setProfessionals()),
  makeOffer: (prof, details) => dispatch(makeOffer(prof, details))
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);