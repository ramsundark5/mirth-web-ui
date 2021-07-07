import React from 'react';

import { Typography } from '@material-ui/core';
import { green, red, orange } from '@material-ui/core/colors';

const renderStatus = value => {
  let statusColor: string = red[500];
  if (value === 'STARTED') {
    statusColor = green[500];
  } else if (value.endsWith('ING')) {
    statusColor = orange[500];
  }
  return <Typography style={{ color: statusColor }}> {value} </Typography>;
};

export const columns = [
  {
    label: 'Name',
    name: 'name',
    options: {
      searchable: true,
      filter: false,
    },
  },
  {
    label: 'State',
    name: 'state',
    options: {
      customBodyRender: renderStatus,
    },
  },
  {
    label: 'Received',
    name: 'statistic.RECEIVED',
    options: {
      searchable: false,
      filter: false,
    },
  },
  {
    label: 'Filtered',
    name: 'statistic.FILTERED',
    options: {
      searchable: false,
      filter: false,
    },
  },
  {
    label: 'Queued',
    name: 'statistic.QUEUED',
    options: {
      searchable: false,
      filter: false,
    },
  },
  {
    label: 'Sent',
    name: 'statistic.SENT',
    options: {
      searchable: false,
      filter: false,
    },
  },
  {
    label: 'Errored',
    name: 'statistic.ERROR',
    options: {
      searchable: false,
      filter: false,
    },
  },
  {
    label: 'channelId',
    name: 'channelId',
    options: {
      display: 'excluded',
      searchable: false,
      viewColumns: false,
      filter: false,
    },
  },
  {
    label: 'connectors',
    name: 'connectors',
    options: {
      display: 'excluded',
      searchable: false,
      viewColumns: false,
      filter: false,
    },
  },
  {
    label: 'id',
    name: 'id',
    options: {
      display: 'excluded',
      searchable: false,
      viewColumns: false,
      filter: false,
    },
  },
];
