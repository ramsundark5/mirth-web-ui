/**
 * Asynchronously loads the component for HomePage
 */

import { lazyLoad } from 'utils/loadable';

export const ConnectionPage = lazyLoad(
  () => import('./index'),
  module => module.ConnectionPage,
);
