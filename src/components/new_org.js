import React from 'react';

export default class NewOrg extends React.Component {

  constructor(props) {
    super(props)

    this.handleInputChange = handleInputChange.bind(this);
    this.handleSubmit = handleSubmit.bind(this);
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
          <button onClick={this.handleSubmit}>Submit</button>
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
  this.props.web3.eth.getAccounts().then(accounts => {
    this.props.contract.methods.newOrg(...Object.values(this.state))
    .send({from: accounts[0]}, (e, result) => {});
  });
}
