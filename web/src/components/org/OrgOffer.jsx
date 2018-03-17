import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import { ListItem, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button';

const OrgOffer = ({ classes, offer }) =>
  <ListItem key={offer.date}>
    <ListItemText primary={
      `${offer.date} вы пригласили на работу ${offer.empName}
      и он ${offer.status}`
    }/>
    <Button color="primary"
            className={classes.button}>
      Оформить договор
    </Button>
    <Button color="accent"
            className={classes.button}>
      Отказаться
    </Button>
  </ListItem>

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  }
});

export default withStyles(styles)(OrgOffer);