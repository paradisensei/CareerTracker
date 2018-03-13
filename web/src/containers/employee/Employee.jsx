import React from 'react';
import { connect } from 'react-redux';
import { History } from '../../store/index';

import { setOffers, considerOffer } from '../../actions/EmployeeActions';

import Empty from '../../components/util/Empty';
import EmployeeOffer from '../../components/employee/EmployeeOffer';

import List from 'material-ui/List';

class Employee extends React.Component {

  render() {
    const { user, offers, setOffers, considerOffer } = this.props;

    if (!user.set) {
      History.push('/');
      return null;
    }

    if (!offers) {
      setOffers();
      return <Empty/>;
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

    const userInfo = user.info;
    return (
      <div>
        <h1>Ваш профиль</h1>
        <p><i>ФИО : </i>{userInfo.name}</p>
        <p><i>Email : </i>{userInfo.email}</p>
        <p><i>Профессия : </i>{userInfo.profession}</p>
        <p><i>Город : </i>{userInfo.city}</p>
        <p><i>Паспортные данные : </i>{userInfo.passport}</p>
        {body}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  offers: state.employee.offers
});

const mapDispatchToProps = dispatch => ({
  setOffers: () => dispatch(setOffers()),
  considerOffer: (details, approve) => dispatch(considerOffer(details, approve))
});

export default connect(mapStateToProps, mapDispatchToProps)(Employee);
