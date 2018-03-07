import React from 'react';
import PropTypes from 'prop-types';

import { Assign } from '../../lib/util';

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

class Professional extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dialog: false
    }
  }

  render() {
    const { classes, prof } = this.props;

    return (
      <Grid item xs>
        <Card className={classes.card}>
          <CardContent>
            <Typography type="headline" component="h2">
              {prof.name}
            </Typography>
            <Typography type="body1" className={classes.secondary}>
              {prof.email}
            </Typography>
            <Typography component="p">
              <i>Город : </i> {prof.city}
            </Typography>
            <Typography component="p">
              <i>Профессия : </i> {prof.profession}
            </Typography>
            <Typography component="p">
              <i>Паспортные данные : </i>{prof.passport}
            </Typography>
            <Button color="accent"
                    className={classes.button}
                    onClick={openDialog.bind(this)}>
              Сделать оффер
            </Button>
            <Dialog fullWidth
                    open={this.state.dialog}
                    onClose={closeDialog.bind(this)}>
              <DialogTitle>Оффер для {prof.name}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Детали контракта/соглашения
                </DialogContentText>
                <TextField autoFocus margin="dense" name="position"
                           label="Должность" fullWidth
                           onChange={handleInputChange.bind(this)}/>
                <TextField autoFocus margin="dense" name="salary"
                           label="Зарплата" type="number" fullWidth
                           onChange={handleInputChange.bind(this)}/>
                <TextField autoFocus margin="dense" name="start"
                           label="Дата начала" type="date" fullWidth
                           onChange={handleInputChange.bind(this)}/>
                <TextField autoFocus margin="dense" name="end"
                           label="Дата конца" type="date" fullWidth
                           onChange={handleInputChange.bind(this)}/>
                <TextField autoFocus multiline fullWidth rows={10}
                           label="Соглашение" name="contract"
                           onChange={handleInputChange.bind(this)}/>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeDialog.bind(this)} color="accent">
                  Назад
                </Button>
                <Button color="primary"
                        onClick={handleCommentSubmit.bind(this)}>
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
  this.setState({ dialog: false });
}

function handleInputChange(event) {
  this.setState({
    [event.target.name]: event.target.value
  });
}

function handleCommentSubmit() {
  const { prof, makeOffer } = this.props;
  this.setState({
    dialog: false
  });
  const contract = Assign({}, this.state);
  delete contract.dialog;
  makeOffer(prof, contract);
}

Professional.propTypes = {
  makeOffer: PropTypes.func.isRequired
};

const styles = theme => ({
  card: {
    minWidth: 275
  },
  secondary: {
    color: theme.palette.text.secondary,
    marginBottom: 10
  },
  button: {
    margin: theme.spacing.unit,
  }
});

export default withStyles(styles)(Professional);