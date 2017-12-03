import React from 'react';
import { connect } from 'react-redux';

import { setCareerProfile } from '../../actions/EmployeeActions';

import Empty from '../../components/util/Empty';
import EmployeeRecord from '../../components/employee/EmployeeRecord';

import List from 'material-ui/List';

class EmployeeCareer extends React.Component {

  componentWillMount() {
    // check whether user's offers are already set
    if (!this.props.careerProfile) {
      this.props.setCareerProfile();
    }
  }

  render() {
    const { careerProfile } = this.props;

    if (!careerProfile) {
      return <Empty/>
    }

    let body = 'пока пуст, мы в вас верим :)';
    if (careerProfile.length > 0) {
      body = <div>
        <List>{
          careerProfile.map(r => <EmployeeRecord record={r}/>)
        }</List>
      </div>
    }

    return (
      <div>
        <h1>Ваш послужной список</h1>
        {body}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  careerProfile: state.employee.careerProfile
});

const mapDispatchToProps = dispatch => ({
  setCareerProfile: (user) => dispatch(setCareerProfile(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeCareer);