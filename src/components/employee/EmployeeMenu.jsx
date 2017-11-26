import React from 'react';

import { History } from '../../store/index';

import List, { ListItem, ListItemText } from 'material-ui/List';

export default () => (
  <List>
    <ListItem buttom onClick={go.bind(null, '/home/employee/career')}>
      <ListItemText primary='Моя карьера'/>
    </ListItem>
  </List>
);

const go = (link) => History.push(link);