import React from 'react';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';

import App from '_components/App';

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={App} />
  </Router>
)