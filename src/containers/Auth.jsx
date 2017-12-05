import React from 'react';
import { connect } from 'react-redux';
import { History } from '../store/index';
import { compose } from '../lib/util';

import { addUser } from '../actions/AuthActions';

import NewEmployee from '../components/employee/NewEmployee';
import NewOrg from '../components/org/NewOrg';
import Empty from '../components/util/Empty';

import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button';


class Auth extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { user, classes, addUser } = this.props;

    if (!user.set) {
      History.push('/');
      return null;
    }

    // return spinner if user's account is currently being added to blockchain
    if (user.pending) {
      return <Empty/>
    }

    let body;

    if (this.state.child) {
      body = this.state.child;
    } else {
      const employee = <NewEmployee addUser={addUser} back={handleBack.bind(this)}/>
      const org = <NewOrg addUser={addUser} back={handleBack.bind(this)}/>

      body = <div>
        <Button color="primary"
                className={classes.button}
                onClick={handleChoose.bind(this, employee)}>
          Я представляю себя
        </Button>
        <Button color="accent"
                className={classes.button}
                onClick={handleChoose.bind(this, org)}>
          Я представляю организацию
        </Button>
      </div>
    }

    return (
      <div>
        <h1>Рады приветствовать вас!</h1>
        <p>Наш сервис предоставляет вам возможность вести свои трудовые отношения в цифровом мире. А именно:</p>
        <List>
          <ListItem>
            <ListItemText primary="Управлять своим портфолио онлайн"/>
          </ListItem>
          <ListItem>
            <ListItemText primary="Получать приглашения о работе"/>
          </ListItem>
          <ListItem>
            <ListItemText primary="Устраиваться на работу в один клик"/>
          </ListItem>
        </List>
        <p>Но у вас еще нет аккаунта в нашем сервисе, создайте же его!</p>
        {body}
      </div>
    );
  }
}

function handleChoose(child) {
  this.setState({
    child: child
  });
}

function handleBack() {
  this.setState({
    child: null
  });
}

const mapStateToProps = (state) => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  addUser: (user, role) => dispatch(addUser(user, role))
});

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Auth);