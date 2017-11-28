import React from 'react';
import { connect } from 'react-redux';

import { setEmployees } from '../../actions/OrgActions';

import Empty from '../../components/util/Empty';
import OrgEmployee from '../../components/org/OrgEmployee';

import Grid from 'material-ui/Grid';

class Org extends React.Component {

  componentWillMount() {
    // check whether org's employees are already set
    if (!this.props.employees) {
      this.props.setEmployees();
    }
  }

  render() {
    const { user, employees } = this.props;

    if (!employees) {
      return <Empty/>
    }

    let body = null;
    if (employees.length > 0) {
      body = <div>
        <h2>Ваши сотрудники</h2>
        <Grid container spacing={24}>{
          employees.map(e => <OrgEmployee employee={e}/>)
        }</Grid>
      </div>
    }

    return (
      <div>
        <h1>Ваш профиль</h1>
        <p><i>Название : </i>{user.name}</p>
        <p><i>Город : </i>{user.city}</p>
        <p><i>Инн : </i>{user.inn}</p>
        <p><i>Сфера деятельности : </i>{user.sphere}</p>
        {body}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.info,
  employees: state.org.employees
});

const mapDispatchToProps = dispatch => ({
  setEmployees: () => dispatch(setEmployees())
});

export default connect(mapStateToProps, mapDispatchToProps)(Org);