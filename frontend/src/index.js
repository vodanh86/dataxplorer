import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'
import {Route, Switch} from 'react-router'

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import {Admin} from "./layouts/Admin.js";
import Login from './containers/Login';
import Logout from './containers/Logout';
import PrivateRoute from './containers/PrivateRoute';
import configureStore from './store'
import { PersistGate } from 'redux-persist/lib/integration/react'

const history = createHistory()
const { store, persistor } = configureStore(history)

ReactDOM.render((
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ConnectedRouter history={history}>
        <Switch>
          <PrivateRoute exact path="/" component={Admin}/>
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <PrivateRoute path="/admin" component={Admin} />
        </Switch>
      </ConnectedRouter>
    </PersistGate>
  </Provider>
), document.getElementById('root'));
