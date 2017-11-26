import 'normalize.css';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import registerServiceWorker from 'registerServiceWorker';

import { Router, Route, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import { Store, History } from 'store/index';

import Main from './containers/Main';
import Entrypoint from './containers/Entrypoint';
import Auth from './containers/Auth';
import Home from './containers/Home';
import Employee from './containers/employee/Employee';

import Empty from './components/util/Empty';
import Org from './components/org/org';


ReactDOM.render(
  <Provider store={Store}>
    <Router history={History}>
      <Route path='/' component={Main}>
        <IndexRoute component={Entrypoint}/>
        <Route path='/auth' component={Auth}/>
        <Route path='/home' component={({ children }) => children}>
          <IndexRoute component={Home}/>
          <Route path='/home/employee' component={Employee}/>
          <Route path='/home/employee/career' component={Empty}/>
          <Route path='/home/org' component={Org}/>
        </Route>
        <Route path='*' component={Empty}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
