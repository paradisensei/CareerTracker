import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

class OrgEmployee extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dialog: false
    }
  }

  render() {
    const { classes, employee } = this.props;
    const { dialog, comment } = this.state;

    let body = null;
    //TODO
    // if (!employee.comment.trim()) {
      body = <Button color="accent" onClick={openDialog.bind(this)}>
        Дать рекомендацию
      </Button>
    // }

    return (
      <Grid item xs>
        <Card className={classes.card}>
          <CardContent>
            <Typography type="headline" component="h2">
              {employee.name}
            </Typography>
            <Typography type="body1" className={classes.secondary}>
              {employee.email}
            </Typography>
            <Typography component="p">
              <i>Город : </i> {employee.city}
            </Typography>
            <Typography component="p">
              <i>Должность : </i> {employee.position}
            </Typography>
            <Typography component="p">
              <i>Паспортные данные : </i>{employee.passport}
            </Typography>
            {body}
            <Button color="primary"
                    href={employee.contract} target="blank"
                    className={classes.button}>
              Контракт в блокчейне
            </Button>
            <Dialog fullWidth
                    open={dialog}
                    onRequestClose={closeDialog.bind(this)}>
              <DialogTitle>Рекомендация для {employee.name}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Как проявил себя {employee.name} ?
                </DialogContentText>
                <TextField autoFocus multiline fullWidth rows={10}
                           onChange={handleInputChange.bind(this)}/>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeDialog.bind(this)} color="accent">
                  Назад
                </Button>
                <Button color="primary"
                        onClick={handleCommentSubmit.bind(this, employee.address, comment)}>
                  Отправить
                </Button>
              </DialogActions>
            </Dialog>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

function openDialog() {
  this.setState({ dialog: true });
}

function closeDialog() {
  this.setState({
    dialog: false,
    comment: null
  });
}

function handleInputChange(event) {
  this.setState({
    comment: event.target.value
  });
}

function handleCommentSubmit(address, comment) {
  this.setState({
    dialog: false
  });
  this.props.addComment(address, comment)
}

OrgEmployee.propTypes = {
  employee: PropTypes.object.isRequired
}

const styles = theme => ({
  card: {
    minWidth: 275,
  },
  secondary: {
    color: theme.palette.text.secondary,
    marginBottom: 10
  }
});

export default withStyles(styles)(OrgEmployee);