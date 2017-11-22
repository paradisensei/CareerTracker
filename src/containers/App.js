import React from 'react';
import Web3 from 'web3';

import Employee from '../components/employee';
import Org from '../components/org';
import Auth from '../components/auth';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    if (!Web3.givenProvider) {
      alert('Для корректной работы приложения нужно установить Chrome-расширение\n' +
      'MetaMask.\nСсылка: https://metamask.io/');
    } else {
      this.web3 = new Web3(Web3.givenProvider);
    }

    this.state = {
      // 1 - employee, 2 - org, 3 - none
      flag: 0
    }
  }

  componentWillMount() {
    // Instantiate contract once web3 is provided.
    this.instantiateContract();

    // Find current user
    this.findUser();
  }

  instantiateContract() {
    const contractInfo = require('../properties/CareerTrackerInfo.json');
    this.contract = new this.web3.eth
      .Contract(contractInfo.abi, contractInfo.address);
  }

  findUser() {
    let etherbase;
    this.web3.eth.getAccounts()
      .then(accounts => {
        etherbase = accounts[0];
        return this.contract.methods.employeeInfo(etherbase).call();
      })
      .then(employee => {
        if (employee[1]) {
          this.user = {
            address: etherbase,
            name: employee[0],
            email: employee[1],
            city: employee[2],
            passport: Number(employee[3]),
            profession: employee[4]
          };
          this.setState({
            flag: 1
          })
        } else {
          this.contract.methods.orgInfo(etherbase).call((e, org) => {
            let flag = 2
            if (!e && org[0]) {
              this.user = {
                address: etherbase,
                name: org[0],
                city: org[1],
                inn: org[2],
                sphere: org[3]
              };
            } else {
              flag = 3
            }
            this.setState({
              flag: flag
            })
          });
        }
      });
  }

  render() {
    let body = null;

    switch (this.state.flag) {
      case 1:
        body = <Employee contract={this.contract} user={this.user}/>;
        break;
      case 2:
        body = <Org contract={this.contract} user={this.user}/>;
        break;
      case 3:
        body = <Auth web3={this.web3} contract={this.contract} user={this.user}/>;
        break;
      default:
        // will NOT execute
    }

    return (
      <div>{body}</div>
    );
  }
}
