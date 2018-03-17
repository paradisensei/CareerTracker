import React from 'react';
import { connect } from 'react-redux';
import { History } from '../../store/index';

import { setEmployees, setOffers, addComment } from '../../actions/OrgActions';

import Empty from '../../components/util/Empty';
import OrgEmployee from '../../components/org/OrgEmployee';
import OrgOffer from '../../components/org/OrgOffer';

import Grid from 'material-ui/Grid';

class Org extends React.Component {

  render() {
    const {
      user, employees, offers, setEmployees, setOffers, addComment
    } = this.props;

    if (!user.set) {
      History.push('/');
      return null;
    }

    if (!employees) {
      setEmployees();
      return <Empty/>
    }

    if (!offers) {
      setOffers();
      return <Empty/>
    }

    let empBody = 'Здесь будут отображаться ваши сотрудники, которых пока нет :)';
    if (employees.length > 0) {
      empBody = <div>
        <h2>Ваши сотрудники</h2>
        <Grid container spacing={24}>{
          employees.map(e => <OrgEmployee employee={e} addComment={addComment}/>)
        }</Grid>
      </div>
    }

    let offBody = 'Здесь отображаются высланные офферы и их статусы';
    if (offers.length > 0) {
      offBody = <div>
        <h2>Высланные офферы</h2>
        <Grid container spacing={24}>{
          offers.map(o => <OrgOffer offer={o}/>)
        }</Grid>
      </div>
    }

    const userInfo = user.info;
    return (
      <div>
        <h1>Ваш профиль</h1>
        <p><i>Название : </i>{userInfo.name}</p>
        <p><i>Город : </i>{userInfo.city}</p>
        <p><i>Инн : </i>{userInfo.inn}</p>
        <p><i>Сфера деятельности : </i>{userInfo.sphere}</p>
        {empBody}
        {offBody}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  employees: state.org.employees,
  offers: state.org.offers
});

const mapDispatchToProps = dispatch => ({
  setEmployees: () => dispatch(setEmployees()),
  setOffers: () => dispatch(setOffers()),
  addComment: (address, comment) => dispatch(addComment(address, comment))
});

export default connect(mapStateToProps, mapDispatchToProps)(Org);