import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import { ListItem, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button';

const OrgOffer = ({ classes, offer }) =>
  <ListItem key={offer.date}>
    <ListItemText primary={
      `${offer.date} вы пригласили на работу ${offer.empName}
      и он ${offer.status === 'approved' ? 'согласился' : 'declined' ? 'отказался' : 'еще думает'}`
    }/>
    <Button color="primary"
            className={classes.button}>
      Ссылка на договор-контракт в блокчейне
    </Button>
  </ListItem>

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  }
});

export default withStyles(styles)(OrgOffer);