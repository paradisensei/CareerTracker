import React from 'react';
import { connect } from 'react-redux';
import { History } from '../store/index';
import { compose } from '../lib/util';

import { setUser } from '../actions/EntrypointActions';
import { addUser } from '../actions/AuthActions';

import NewEmployee from '../components/NewEmployee';
import NewOrg from '../components/NewOrg';
import Empty from '../components/Empty';

import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button';


class Auth extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    // check whether user is already set
    if (!this.props.user.set) {
      this.props.setUser();
    }
  }

  render() {
    const { user, classes, addUser } = this.props;

    // redirect to home page if user already has account
    if (user.info) {
      History.push('/home');
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
      const employee = <NewEmployee addUser={addUser}/>
      const org = <NewOrg addUser={addUser}/>

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

const mapStateToProps = (state) => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  setUser: () => dispatch(setUser()),
  addUser: (user, type) => dispatch(addUser(user, type))
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