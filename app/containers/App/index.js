/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { lightBlue, indigo } from '@material-ui/core/colors';
import Dashboard from 'containers/Dashboard/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

import GlobalStyle from '../../global-styles';

const primaryTheme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: lightBlue,
  },
});
export default function App() {
  return (
    <ThemeProvider theme={primaryTheme}>
      <div>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route component={NotFoundPage} />
        </Switch>
        <GlobalStyle />
      </div>
    </ThemeProvider>
  );
}
