import React from 'react';
import {Route, Redirect, Switch } from 'react-router-dom';

import Login from './login';

class Dashboard extends React.Component {
  state = {
    open: true,
  };
  render() {
    return (
        <Switch>
          <Route exact path="/login" render={props => <Login {...props} />} />
          <Redirect to="/login"/>
      </Switch>
    );
  }
}


export default Dashboard;