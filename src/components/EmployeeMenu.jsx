import React from 'react';

import { History } from '../store/index';

import List, { ListItem, ListItemText } from 'material-ui/List';

export default () => (
  <List>
    <ListItem buttom onClick={go.bind(null, '/some')}>
      <ListItemText primary='Employee info'/>
    </ListItem>
  </List>
);

const go = (link) => History.push(link);