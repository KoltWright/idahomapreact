import React from 'react';
import {Switch, Route} from 'react-router-dom';

import IdahoAddressesOne from './components/IdahoAddressesOne/IdahoAddressesOne.js';
import IdahoAddressesTwo from './components/IdahoAddressesTwo/IdahoAddressesTwo.js';

export default (
  <Switch>
    <Route path="/" component={IdahoAddressesOne} exact />
    <Route path="/addressesTwo" component={IdahoAddressesTwo} />
  </Switch>
)
