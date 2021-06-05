import * as React from 'react';

import { Helmet } from 'react-helmet-async';

import { ChannelStatistics } from './components/ChannelStatistics';
export function DashboardPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="View Mirth Channel Statistics" />
      </Helmet>
      <ChannelStatistics />
    </>
  );
}
