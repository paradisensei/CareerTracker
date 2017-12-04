import React from 'react';

import { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';

const EmployeeRecord = ({ record }) => {
  const status = Number(record.status);
  const text = status === 0 ? 'приняты на должность'
    : 'уволены с должности';
  return (
    <div>
      <ListItem>
        <ListItemText primary={
          `${record.date} вы были ${text} ${record.position} в ${record.orgName}`
        }/>
      </ListItem>
      <ListItem>
        <ListItemText primary={`Рекомендация работодателя: ${record.comment}`}/>
      </ListItem>
      <Divider/>
    </div>
  );
}

export default EmployeeRecord;