/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';

import { NotFoundPage } from 'app/components/NotFoundPage';
import Notifier from 'app/components/Notifier';
import { SnackbarProvider } from 'notistack';
import { Switch, Route } from 'react-router-dom';
import { GlobalStyle } from 'styles/global-styles';

import Routes from './Routes';
export function App() {
  return (
    <SnackbarProvider>
      <Notifier />
      <Switch>
        {Routes.map((route: any) => (
          <Route exact path={route.path} key={route.path}>
            <route.component />
          </Route>
        ))}
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </SnackbarProvider>
  );
}
