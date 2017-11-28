import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

const OrgEmployee = ({ classes, employee }) =>
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
          <i>Профессия : </i> {employee.profession}
        </Typography>
        <Typography component="p">
          <i>Паспортные данные : </i>{employee.passport}
        </Typography>
      </CardContent>
    </Card>
  </Grid>

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