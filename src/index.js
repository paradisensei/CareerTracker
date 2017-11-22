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
import App from './containers/App';
import Empty from './components/Empty';

ReactDOM.render(
  <Provider store={Store}>
    <Router history={History}>
      <Route path='/' component={Main}>
        <IndexRoute component={App}/>
        <Route path='*' component={Empty}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
