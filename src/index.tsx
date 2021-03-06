/* eslint-disable import/order */
/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';

import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'sanitize.css/sanitize.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import Layout from 'app/pages/layout/Layout';
import { HelmetProvider } from 'react-helmet-async';
import reportWebVitals from 'reportWebVitals';
import { store } from 'store';
import { makeServer } from './mirage';
// Initialize languages
import './locales/i18n';
import log from 'utils/logger';
import { BrowserRouter } from 'react-router-dom';
const MOUNT_NODE = document.getElementById('root') as HTMLElement;

const currentEnv = process.env.REACT_APP_ENV;
log.info('running in mode ' + currentEnv);
if (currentEnv === 'test') {
  makeServer({ environment: 'test' });
}

ReactDOM.render(
  <Provider store={store}>
    <HelmetProvider>
      <React.StrictMode>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </React.StrictMode>
    </HelmetProvider>
  </Provider>,
  MOUNT_NODE,
);

// Hot reloadable translation json files
if (module.hot) {
  module.hot.accept(['./locales/i18n'], () => {
    // No need to render the App again because i18next works with the hooks
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(log.trace);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
