import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { mainListItems, secondaryListItems } from './sidebar';
import { Route, Switch } from 'react-router-dom';
import { urlBreadCumbs, getTitle } from '../base/base.config';

import {
  ToggleOff
} from '@material-ui/icons';

// Master
import Users from '../master/users';
import Employees from '../master/employees';
import Company from '../master/company';
import Souvenir from '../master/souvenir';
import Unit from '../master/unit';
import MenuAccess from '../master/menuaccess';
import Menu from '../master/menu';
import Roles from '../master/role';
import Product from '../master/product';

// Trasanction
import Design from '../transaction/design';
import Promotion from '../transaction/promotion';
import Event from '../transaction/event'
import SouvenirT from '../transaction/t_souvenir';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
});

class Dashboard extends React.Component {
  state = {
    open: true,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <AppBar
            position="absolute"
            className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
          >
            <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(
                  classes.menuButton,
                  this.state.open && classes.menuButtonHidden,
                )}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="title" color="inherit" noWrap className={classes.title}>
                {getTitle()}
              </Typography>
              <IconButton color="inherit">
                {/* <Badge badgeContent={4} color="secondary"> */}
                  <ToggleOff />
                {/* </Badge> */}
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
            }}
            open={this.state.open}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>{mainListItems}</List>
            <Divider />
            <List>{secondaryListItems}</List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <div className={classes.tableContainer}>
            {urlBreadCumbs()}
              <Switch>
                {/* <Route exact path="/login" render={props => <Login {...props} /> } /> */}
                {/* Master Route */}
                <Route exact path="/master/users" render={props => <Users {...props} />} />
                <Route exact path="/master/employees" render={props => <Employees {...props} />} />
                <Route exact path="/master/company" render={props => <Company {...props} />} />
                <Route exact path="/master/souvenir" render={props => <Souvenir {...props} />} />
                <Route exact path="/master/unit" render={props => <Unit {...props} />} />
                <Route exact path="/master/menu" render={props => <Menu {...props} />} />
                <Route exact path="/master/menuaccess" render={props => <MenuAccess {...props} />} />
                <Route exact path="/master/role" render={props => <Roles {...props} />} />
                <Route exact path="/master/product" render={props => <Product {...props} />} />

                {/* Transaction Route */}
                <Route exact path="/transaction/design" render={props => <Design {...props} />} />
                <Route exact path="/transaction/event" render={props => <Event {...props} />} />
                <Route exact path="/transaction/promotion" render={props => <Promotion {...props} />} />
                <Route exact path="/transaction/souvenir" render={props => <SouvenirT {...props} />} />
              </Switch>
            </div>
          </main>
        </div>
      </React.Fragment>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);