import React from 'react';

import { withStyles } from 'material-ui/styles';
import { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';

const EmployeeRecord = ({ classes, record }) => {
  const status = Number(record.status);
  const text = status === 0 ? 'приняты на должность'
    : 'уволены с должности';
  const comment = record.comment ?
    <ListItem>
      <ListItemText primary={`Рекомендация работодателя: ${record.comment}`}/>
    </ListItem>
    : null;

  return (
    <div>
      <ListItem>
        <ListItemText primary={
          `${record.date} вы были ${text} ${record.position} в ${record.orgName}`
        }/>
        <Button color="primary"
                href={record.contract} target="blank"
                className={classes.button}>
          Контракт в блокчейне
        </Button>
      </ListItem>
      {comment}
      <Divider/>
    </div>
  );
};

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  }
});

export default withStyles(styles)(EmployeeRecord);