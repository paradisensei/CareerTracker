import React from 'react';
import { connect } from 'react-redux';

import { setOffers, considerOffer } from '../../actions/EmployeeActions';

import Empty from '../../components/util/Empty';

class Employee extends React.Component {

  componentWillMount() {
    this.props.setOffers();
  }

  render() {
    const { user, offers } = this.props;

    if (!offers) {
      return <Empty/>
    }

    let body = null;
    if (offers.length > 0) {
      body = <div>
        <h3>Ваши офферы</h3>
        <ul>
          {
            offers.map((o, i) =>
              <li key={i}>
                <p>
                  {o.date} {o.orgName} пригласил/а вас на должность {o.position}
                </p>
                <button onClick={considerOffer.bind(this, o.index, true)}>Принять</button>
                <button onClick={considerOffer.bind(this, o.index, false)}>Отказаться</button>
              </li>
            )
          }
        </ul>
      </div>
    }

    return (
      <div>
        <h2>Ваш профиль</h2>
        <p><i>ФИО:</i> {user.name}</p>
        <p><i>Email:</i> {user.email}</p>
        <p><i>Профессия:</i> {user.profession}</p>
        <p><i>Город:</i> {user.city}</p>
        <p><i>Паспортные данные:</i> {user.passport}</p>

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
