import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';
import {NavLink } from 'react-router-dom';

import {
  GroupWork,
  ColorLens,
  AccountBalance,
  LockOpen,
  Menu,
  AcUnit,
  ScatterPlot,
  BubbleChart
} from '@material-ui/icons'

export const mainListItems = (
  <div>
    <ListItem button component={NavLink} to='/master/users'>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Users" />
    </ListItem>
    <ListItem button component={NavLink} to='/master/employees'>
      <ListItemIcon>
        <GroupWork />
      </ListItemIcon>
      <ListItemText primary="Employees" />
    </ListItem>
    <ListItem button component={NavLink} to='/master/company'>
      <ListItemIcon>
        <AccountBalance />
      </ListItemIcon>
      <ListItemText primary="Company" />
    </ListItem>
    <ListItem button component={NavLink} to='/master/role'>
      <ListItemIcon>
        <LockOpen />
      </ListItemIcon>
      <ListItemText primary="Roles" />
    </ListItem>
    <ListItem button component={NavLink} to='/master/menu'>
      <ListItemIcon>
        <Menu />
      </ListItemIcon>
      <ListItemText primary="Menu" />
    </ListItem>
    <ListItem button component={NavLink} to='/master/menuaccess'>
      <ListItemIcon>
        <Menu />
      </ListItemIcon>
      <ListItemText primary="Menu Access" />
    </ListItem>
    <ListItem button component={NavLink} to='/master/unit'>
      <ListItemIcon>
        <AcUnit />
      </ListItemIcon>
      <ListItemText primary="Units" />
    </ListItem>
    <ListItem button component={NavLink} to='/master/souvenir'>
      <ListItemIcon>
        <ScatterPlot />
      </ListItemIcon>
      <ListItemText primary="Souvenirs" />
    </ListItem>
    <ListItem button component={NavLink} to='/master/product'>
      <ListItemIcon>
        <BubbleChart />
      </ListItemIcon>
      <ListItemText primary="Products" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListItem button component={NavLink} to='/transaction/design'>
      <ListItemIcon>
        <ColorLens />
      </ListItemIcon>
      <ListItemText primary="Design" />
    </ListItem>
    <ListItem button component={NavLink} to='/transaction/event'>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Event" />
    </ListItem>
    <ListItem button component={NavLink} to='/transaction/promotion'>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Promotion" />
    </ListItem>
    <ListItem button component={NavLink} to='/transaction/souvenir'>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Souvenir" />
    </ListItem>
  </div>
);