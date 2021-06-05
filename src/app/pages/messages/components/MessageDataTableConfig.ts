export const formatDate = value => {
  let dateStr;
  if (value && value > 0) {
    try {
      dateStr = new Date(value).toLocaleString();
    } catch (err) {}
  }
  return dateStr;
};

export const columns = [
  {
    label: 'id',
    name: 'messageId',
  },
  {
    label: 'Connector',
    name: 'channelName',
  },
  {
    label: 'Status',
    name: 'processed',
    options: {
      customBodyRender: value =>
        value && value === 'true' ? 'PROCESSED' : 'NOT PROCESSED',
    },
  },
  {
    label: 'Received Date',
    name: 'receivedDate',
    options: {
      customBodyRender: value => formatDate(value),
    },
  },
  {
    label: 'Response Date',
    name: 'responseDate',
    options: {
      customBodyRender: value => formatDate(value),
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
];
