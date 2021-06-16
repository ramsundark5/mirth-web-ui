import React from 'react';

import {
  Backdrop,
  CircularProgress,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import APIConstants from 'app/constants/APIConstants';
import { messageActions } from 'app/features/messages/slice';
import { messagesSelector } from 'app/features/messages/slice/selectors';
import {
  MessageState,
  MessageSearchParams,
} from 'app/features/messages/slice/types';
import MUIDataTable from 'mui-datatables';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import log from 'utils/logger';

import { columns, formatDate } from './MessageDataTableConfig';
import MessageExpandableRow from './MessageExpandableRow';
import SearchFilter from './SearchFilter';

export default function MessagesViewer() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const messageState: MessageState =
    useAppSelector<MessageState>(messagesSelector);
  const messageSearchParams: MessageSearchParams = messageState.searchParams;
  const selectedChannelCount =
    messageState?.searchParams.selectedChannels?.length || 1;

  const onPageChange = tableState => {
    dispatch(messageActions.setPaginationPage(tableState.page));
  };

  const renderDetailColumn = (rowData, rowMeta) => {
    log.debug(messageState);
    log.debug('rowData ' + rowData);
    let childRows: any[] = [];
    const messageId = rowData[0];
    const connectorMessageList = rowData[5];
    const channelId = rowData[6];
    if (connectorMessageList && connectorMessageList.length > 0) {
      for (let message of connectorMessageList) {
        let messageRow = [
          message.connectorName,
          message.status,
          formatDate(message.receivedDate),
          formatDate(message.responseDate),
        ];
        childRows.push(messageRow);
      }
    }
    if (childRows.length < 1) {
      return null;
    } else {
      return childRows.map(connectorMessageRow => (
        <MessageExpandableRow
          key={messageId + connectorMessageRow[0]}
          connectorMessageRow={connectorMessageRow}
          connection={messageSearchParams.selectedConnection}
          channelId={channelId}
          messageId={messageId}
        />
      ));
    }
  };

  function renderSearchFilter() {
    return <SearchFilter />;
  }

  const options = {
    print: false,
    enableNestedDataAccess: '.',
    expandableRows: true,
    expandableRowsHeader: true,
    expandableRowsOnClick: true,
    renderExpandableRow: renderDetailColumn,
    selectableRows: 'single',
    filter: false,
    download: false,
    selectableRowsHideCheckboxes: true,
    sortOrder: {
      name: 'receivedDate',
      direction: 'desc',
    },
    customSearchRender: renderSearchFilter,
    searchOpen: true,
    serverSide: true,
    count: messageState?.totalCount || 0,
    page: messageState?.searchParams?.page || 0,
    rowsPerPage: APIConstants.DEFAULT_ROW_COUNT * selectedChannelCount,
    rowsPerPageOptions: [],
    onTableChange: (action, tableState) => {
      switch (action) {
        case 'changePage':
          onPageChange(tableState);
          break;
        default:
          log.info('pagination action not handled.' + action);
      }
    },
    textLabels: {
      body: {
        noMatch: 'No messages found. Try expanding your search filter.',
      },
    },
  };

  return (
    <Paper>
      <MUIDataTable
        title={'Channels'}
        data={messageState.messages}
        columns={columns}
        options={options}
      />
      <Backdrop className={classes.backdrop} open={messageState.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Paper>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);
