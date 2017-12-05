import React from 'react';

import { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';

const EmployeeRecord = ({ record }) => {
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
      </ListItem>
      {comment}
      <Divider/>
    </div>
  );
}

export default EmployeeRecord;