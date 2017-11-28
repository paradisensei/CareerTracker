import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

const Professional = ({ classes, prof, makeOffer }) =>
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
                onClick={makeOffer.bind(null, prof.address)}>
          Сделать оффер
        </Button>
      </CardContent>
    </Card>
  </Grid>

Professional.propTypes = {
  makeOffer: PropTypes.func.isRequired
}

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