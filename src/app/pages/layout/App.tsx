/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { useEffect } from 'react';

import { NotFoundPage } from 'app/components/NotFoundPage';
import SnackBar from 'app/components/snackbar';
import SnackbarCloseButton from 'app/components/snackbar/SnackbarCloseButton';
import APIConstants from 'app/constants/APIConstants';
import { connectionsActions } from 'app/features/connections/slice';
import { Connection } from 'app/features/connections/slice/types';
import { SnackbarProvider } from 'notistack';
import { Switch, Route } from 'react-router-dom';
import { useAppDispatch } from 'store/hooks';
import { GlobalStyle } from 'styles/global-styles';

import Routes from './Routes';
export function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (process.env.REACT_APP_ENV === 'test') {
      const placeholderConnection: Connection = {
        id: APIConstants.MIRTH_DEFAULT_URL,
        url: APIConstants.MIRTH_DEFAULT_URL,
        username: 'test',
        isConnected: true,
      };
      dispatch(connectionsActions.upsertConnection(placeholderConnection));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SnackbarProvider
      maxSnack={1}
      action={key => <SnackbarCloseButton key={key} />}
    >
      <SnackBar />
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
