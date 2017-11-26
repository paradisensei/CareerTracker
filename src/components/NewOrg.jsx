import React from 'react';
import PropTypes from 'prop-types';

import {
  ORG
} from '../constants/roles';

export default class NewOrg extends React.Component {

  constructor(props) {
    super(props)
    this.handleInputChange = handleInputChange.bind(this);
  }

  render() {
    return (
      <form>
        <fieldset>
          <input type='text' name='name' placeholder='Название:'
                 onChange={this.handleInputChange}/>
          <input type='text' name='city' placeholder='Город:'
                 onChange={this.handleInputChange}/>
          <input type='number' name='inn' placeholder='ИНН:'
                 onChange={this.handleInputChange}/>
          <input type='text' name='sphere' placeholder='Сфера деятельности:'
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
  this.props.addUser(this.state, ORG);
}

NewOrg.propTypes = {
  addUser: PropTypes.func.isRequired
}