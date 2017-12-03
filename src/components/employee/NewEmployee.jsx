import React from 'react';
import PropTypes from 'prop-types';

import {
  EMPLOYEE
} from '../../constants/roles';

import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

class NewEmployee extends React.Component {

  constructor(props) {
    super(props);
    this.handleInputChange = handleInputChange.bind(this);
  }

  render() {
    const { classes, back } = this.props;

    return (
      <form>
        <TextField label='ФИО' name='name'
                   onChange={this.handleInputChange}/>

        <TextField label='Email' name='email'
                   onChange={this.handleInputChange}/>

        <TextField label='Город' name='city'
                   onChange={this.handleInputChange}/>

        <TextField label='№ паспорта' name='passport'
                   onChange={this.handleInputChange}/>

        <TextField label='Профессия' name='profession'
                   onChange={this.handleInputChange}/>

        <Button color="primary" className={classes.button}
                onClick={handleSubmit.bind(this)}>
          Создать!
        </Button>
        <Button color="accent" className={classes.button} onClick={back}>
          Назад
        </Button>
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

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
});

export default withStyles(styles)(NewEmployee);