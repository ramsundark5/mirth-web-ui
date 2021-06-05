/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';

import { NotFoundPage } from 'app/components/NotFoundPage';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Switch, Route } from 'react-router-dom';
import { GlobalStyle } from 'styles/global-styles';

import Routes from './Routes';
export function App() {
  const { i18n } = useTranslation();
  return (
    <>
      <Helmet
        titleTemplate="%s - Mirth Admin UI"
        defaultTitle="Mirth Admin UI"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="Mirth Admin UI" />
      </Helmet>

      <Switch>
        {Routes.map((route: any) => (
          <Route exact path={route.path} key={route.path}>
            <route.component />
          </Route>
        ))}
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </>
  );
}
