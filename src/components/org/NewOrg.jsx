import React from 'react';
import PropTypes from 'prop-types';

import {
  ORG
} from '../../constants/roles';

import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

class NewOrg extends React.Component {

  constructor(props) {
    super(props)
    this.handleInputChange = handleInputChange.bind(this);
  }

  render() {
    const { classes, back } = this.props;

    return (
      <form>
        <TextField label='Название' name='name'
                   onChange={this.handleInputChange}/>

        <TextField label='Город' name='city'
                   onChange={this.handleInputChange}/>

        <TextField label='№ ИНН' name='inn'
                   onChange={this.handleInputChange}/>

        <TextField label='Сфера деятельности' name='sphere'
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
  this.props.addUser(this.state, ORG);
}

NewOrg.propTypes = {
  addUser: PropTypes.func.isRequired
}

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
});

export default withStyles(styles)(NewOrg);