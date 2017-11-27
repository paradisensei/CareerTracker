import React from 'react';
import { connect } from 'react-redux';

import { setOffers, considerOffer } from '../../actions/EmployeeActions';

import Empty from '../../components/util/Empty';
import EmployeeOffer from '../../components/employee/EmployeeOffer';

import List from 'material-ui/List';

class Employee extends React.Component {

  componentWillMount() {
    // check whether user's offers are already set
    if (!this.props.offers) {
      this.props.setOffers();
    }
  }

  render() {
    const { user, offers, considerOffer } = this.props;

    if (!offers) {
      return <Empty/>
    }

    let body = null;
    if (offers.length > 0) {
      body = <div>
        <h2>Ваши офферы</h2>
        <List>{
          offers.map(o => <EmployeeOffer offer={o} considerOffer={considerOffer}/>)
        }</List>
      </div>
    }

    return (
      <div>
        <h1>Ваш профиль</h1>
        <p><i>ФИО : </i>{user.name}</p>
        <p><i>Email : </i>{user.email}</p>
        <p><i>Профессия : </i>{user.profession}</p>
        <p><i>Город : </i>{user.city}</p>
        <p><i>Паспортные данные : </i>{user.passport}</p>

        {body}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.info,
  offers: state.employee.offers
});

const mapDispatchToProps = dispatch => ({
  setOffers: () => dispatch(setOffers()),
  considerOffer: (index, approve) => dispatch(considerOffer(index, approve))
});

export default connect(mapStateToProps, mapDispatchToProps)(Employee);
