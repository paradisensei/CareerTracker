import React from 'react';
import { connect } from 'react-redux';

import { setProfessionals, makeOffer } from '../../actions/OrgActions';

import Empty from '../../components/util/Empty';
import Professional from '../../components/org/Professional';

import Grid from 'material-ui/Grid';

class Search extends React.Component {

  componentWillMount() {
    // check whether user's offers are already set
    if (!this.props.professionals) {
      this.props.setProfessionals();
    }
  }

  render() {
    const { professionals, makeOffer } = this.props;

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
  professionals: state.org.professionals
});

const mapDispatchToProps = dispatch => ({
  setProfessionals: () => dispatch(setProfessionals()),
  makeOffer: (prof) => dispatch(makeOffer(prof))
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);