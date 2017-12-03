import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from '../lib/util';

import Screen from '../lib/screen';
import {
  EMPLOYEE, ORG
} from '../constants/roles';

import EmployeeMenu from '../components/employee/EmployeeMenu';
import OrgMenu from '../components/org/OrgMenu';

import { withStyles } from 'material-ui/styles';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';

const Main = ({ classes, user, children }) => {

  let menu = null;
  if (user.info) {
    switch (user.info.role) {
      case EMPLOYEE:
        menu = <EmployeeMenu/>;
        break;
      case ORG:
        menu = <OrgMenu/>;
        break;
      default:
        //TODO
    }
  }

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.main}>
        <div className={classes.appFrame}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <Typography type='title' className={classes.title} noWrap>
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
            {menu}
          </Drawer>
          <main className={classes.content}>
            {children}
          </main>
        </div>
      </div>
    </MuiThemeProvider>
  )
};

Main.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user
});

const theme = createMuiTheme({
  palette: {
    primary: {
      50: '#E0F7FA',
      100: '#B2EBF2',
      200: '#80DEEA',
      300: '#4DD0E1',
      400: '#26C6DA',
      500: '#00BCD4',
      600: '#00ACC1',
      700: '#0097A7',
      800: '#00838F',
      900: '#006064',
      A100: '#84FFFF',
      A200: '#18FFFF',
      A400: '#00E5FF',
      A700: '#00B8D4',
      contrastDefaultColor: 'pink'
    }
  }
});

const styles = theme => ({
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
  title: {
    color: 'white'
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
    alignItems: 'left',
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

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(Main);