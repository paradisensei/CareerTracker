import React from 'react';

import NewEmployee from './new_employee';
import NewOrg from './new_org';

export default class Auth extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    let body;

    if (this.state.child) {
      body = this.state.child;
    } else {
      body = <div>
        <button onClick={handleOrg.bind(this)}>
          Я представляю организацию
        </button>
        <button onClick={handleEmployee.bind(this)}>
          Я представляю себя самого
        </button>
      </div>
    }

    return (
      <div>
        <h1>Welcome!</h1>
        <p>У вас еще нет аккаунта в нашем сервисе. Создайте же его!</p>
        {body}
      </div>
    );
  }
}

function handleOrg(event) {
  this.setState({
    child: <NewOrg web3={this.props.web3} contract={this.contract} user={this.user}/>
  });
}

function handleEmployee(event) {
  this.setState({
    child: <NewEmployee web3={this.props.web3} contract={this.contract} user={this.user}/>
  });
}
