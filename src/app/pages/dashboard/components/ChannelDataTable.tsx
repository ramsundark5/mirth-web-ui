import React from 'react';

import { Box, TableCell, TableRow } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { channelsBySelectedConnectionsSelector } from 'app/features/channels/slice/selectors';
import { Channel } from 'app/features/channels/slice/types';
import MUIDataTable from 'mui-datatables';
import { useAppSelector } from 'store/hooks';
import log from 'utils/logger';

import ActionToolbar from './ActionToolbar';
import { columns } from './ChannelDataTableConfig';

export default function ChannelsDataTable() {
  const channelList: Channel[] = useAppSelector(
    channelsBySelectedConnectionsSelector,
  );

  const renderDetailColumn = (rowData, rowMeta) => {
    log.debug('rowData' + rowData);
    let childRows: any[] = [];
    if (rowData && rowData[8] && rowData[8].length > 0) {
      const connectorList: Channel[] = rowData[8];
      for (let connector of connectorList) {
        let connectorRow = [
          '', // this is dummy to keep first column empty
          connector.name,
          connector.state,
          connector.statistic?.RECEIVED,
          connector.statistic?.FILTERED,
          connector.statistic?.QUEUED,
          connector.statistic?.SENT,
          connector.statistic?.ERROR,
        ];
        childRows.push(connectorRow);
      }
    }
    if (childRows.length < 1) {
      return null;
    } else {
      return childRows.map(connectorRow => (
        <TableRow key={connectorRow[1]}>
          {connectorRow.map((cell, index) => {
            return <TableCell key={index}>{cell}</TableCell>;
          })}
        </TableRow>
      ));
    }
  };

  const handleRowSelectionChange = (
    currentRowsSelected,
    allRowsSelected,
    rowsSelected,
  ) => {
    if (rowsSelected.length < 1) {
      localStorage.setItem('channelSelectedForAction', '0');
    }
  };
  //this component is required to set custom filter toolbar size
  const FilterDialogFooter = () => <Box width={640} />;

  const options = {
    filterType: 'multiselect',
    print: false,
    enableNestedDataAccess: '.',
    expandableRows: true,
    expandableRowsHeader: true,
    expandableRowsOnClick: true,
    sortOrder: {
      name: 'name',
      direction: 'asc',
    },
    renderExpandableRow: renderDetailColumn,
    toggleAllExpandableRows: true,
    customToolbarSelect: (selectedRows, displayData) => (
      <ActionToolbar selectedRows={selectedRows} displayData={displayData} />
    ),
    onRowSelectionChange: handleRowSelectionChange,
    customFilterDialogFooter: () => <FilterDialogFooter />,
  };

  return (
    <Paper>
      <MUIDataTable
        title={'Channels'}
        data={channelList}
        columns={columns}
        options={options}
      />
    </Paper>
  );
}
