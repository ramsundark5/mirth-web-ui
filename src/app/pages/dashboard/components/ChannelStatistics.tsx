/**
 *
 * ChannelStatistics
 *
 */
import React, { memo } from 'react';

import ChannelDataTable from './ChannelDataTable';
import ConnectionSelector from './ConnectionSelector';
interface Props {}

export const ChannelStatistics = memo((props: Props) => {
  return (
    <>
      <ConnectionSelector />
      <ChannelDataTable />
    </>
  );
});
