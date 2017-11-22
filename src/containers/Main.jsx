import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';


const Main = ({ classes, children }) => (
  <div className={classes.main}>
    {children}
  </div>
);

Main.propTypes = {
  classes: PropTypes.object.isRequired
};

const styleSheet = theme => ({
  main: {
    height: Screen.height,
    width: Screen.width,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }
});

export default withStyles(styleSheet)(Main);