import React from 'react';
import PropTypes from 'prop-types';

import Screen from '../lib/screen';

import Menu from '../components/Menu';

import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';


const Main = ({ classes, children }) => (
  <div className={classes.main}>
    <div className={classes.appFrame}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography type='title' color='inherit' noWrap>
            Career tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        type='permanent'
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}/>
        <Divider/>
        <Menu/>
      </Drawer>
      <main className={classes.content}>
        {children}
      </main>
    </div>
  </div>
);

Main.propTypes = {
  classes: PropTypes.object.isRequired
};

const styleSheet = theme => ({
  main: {
    width: '100%',
    height: Screen.height,
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%'
  },
  appBar: {
    position: 'absolute',
    width: `calc(100% - ${Screen.drawerWidth}px)`,
    marginLeft: Screen.drawerWidth
  },
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: Screen.drawerWidth,
  },
  drawerHeader: theme.mixins.toolbar,
  content: {
    backgroundColor: theme.palette.background.primary,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing.unit * 3,
    height: Screen.height - 56,
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      marginTop: 64,
      height: Screen.height - 64
    }
  }
});

export default withStyles(styleSheet)(Main);