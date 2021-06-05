export const columns = [
  {
    label: 'Name',
    name: 'name',
  },
  {
    label: 'State',
    name: 'state',
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
    id: 'channelId',
    name: 'channelId',
    options: {
      display: 'excluded',
      searchable: false,
      viewColumns: false,
      filter: false,
    },
  },
  {
    id: 'connectors',
    name: 'connectors',
    options: {
      display: 'excluded',
      searchable: false,
      viewColumns: false,
      filter: false,
    },
  },
];
