import React from 'react';

import { ListItem, ListItemText } from 'material-ui/List';

const EmployeeRecord = ({ record }) => {
  const status = Number(record.status);
  const text = status === 0 ? 'приняты на должность'
    : 'уволены с должности';
  return (
    <ListItem key={record.date}>
      <ListItemText primary={
        `${record.date} вы были ${text} ${record.position} в ${record.orgName}`
      }/>
    </ListItem>
  );
}

export default EmployeeRecord;