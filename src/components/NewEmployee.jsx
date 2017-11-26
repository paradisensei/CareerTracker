import React from 'react';
import PropTypes from 'prop-types';

import {
  EMPLOYEE
} from '../constants/roles';

export default class NewEmployee extends React.Component {

  constructor(props) {
    super(props);
    this.handleInputChange = handleInputChange.bind(this);
  }

  render() {
    return (
      <form>
        <fieldset>
          <input type='text' name='name' placeholder='Имя:'
                 onChange={this.handleInputChange}/>
          <input type='text' name='email' placeholder='Email:'
                 onChange={this.handleInputChange}/>
          <input type='text' name='city' placeholder='Город:'
                 onChange={this.handleInputChange}/>
          <input type='number' name='passport' placeholder='Паспорт:'
                 onChange={this.handleInputChange}/>
          <input type='text' name='profession' placeholder='Профессия:'
                 onChange={this.handleInputChange}/>
          <button onClick={handleSubmit.bind(this)}>Submit</button>
        </fieldset>
      </form>
    );
  }
}

function handleInputChange(event) {
  this.setState({
    [event.target.name]: event.target.value
  });
}

function handleSubmit() {
  this.props.addUser(this.state, EMPLOYEE);
}

NewEmployee.propTypes = {
  addUser: PropTypes.func.isRequired
}
