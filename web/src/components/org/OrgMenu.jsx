import React from 'react';

import { History } from '../../store/index';

import List, { ListItem, ListItemText } from 'material-ui/List';

export default () => (
  <List>
    <ListItem button onClick={go.bind(null, '/home/org')}>
      <ListItemText primary='Ваш профиль'/>
    </ListItem>
    <ListItem button onClick={go.bind(null, '/home/org/search')}>
      <ListItemText primary='Поиск'/>
    </ListItem>
  </List>
);

const go = (link) => History.push(link);