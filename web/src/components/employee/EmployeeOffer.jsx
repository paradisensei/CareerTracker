import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import { ListItem, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button';

const EmployeeOffer = ({ classes, offer, considerOffer }) =>
  <ListItem key={offer.details}>
    <ListItemText primary={
      `${offer.date} ${offer.orgName} пригласил/а вас на должность ${offer.position}
      с зарплатой ${offer.salary} и началом работы ${offer.start}`
    }/>
    <Button color="primary"
            className={classes.button}
            onClick={considerOffer.bind(null, offer.details, true)}>
      Принять
    </Button>
    <Button color="accent"
            className={classes.button}
            onClick={considerOffer.bind(null, offer.details, false)}>
      Отказаться
    </Button>
  </ListItem>

EmployeeOffer.propTypes = {
  considerOffer: PropTypes.func.isRequired
};

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  }
});

export default withStyles(styles)(EmployeeOffer);