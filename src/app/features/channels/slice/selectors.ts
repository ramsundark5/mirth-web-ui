import { createSelector } from '@reduxjs/toolkit';
import { Channel } from 'app/features/channels/slice/types';
import { RootState } from 'store/types';

import { channelAdapter, initialState } from '.';

const selectSlice = (state: RootState) => {
  if (state && state.channels) {
    return state.channels;
  }
  return initialState;
};

// Can create a set of memoized selectors based on the location of this entity state
export const channelEntitySelector = channelAdapter.getSelectors<RootState>(
  state => {
    if (state && state.channels) {
      return state.channels;
    }
    return initialState;
  },
);

export const channelsBySelectedConnectionsSelector = createSelector(
  [selectSlice],
  channelState => {
    let selectedChannels: Channel[] = [];
    const selectedConnections = channelState.selectedConnections;
    if (selectedConnections && selectedConnections.length > 0) {
      const selectedConnectionIdList: string[] = selectedConnections.map(
        selectedConnection => selectedConnection.id,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [id, channel] of Object.entries(channelState.entities)) {
        if (
          channel &&
          channel.connectionId &&
          selectedConnectionIdList.includes(channel.connectionId)
        ) {
          selectedChannels.push(channel);
        }
      }
    }
    return selectedChannels;
  },
);

export const channelsByConnectionSelector = connectionId => {
  return createSelector([selectSlice], channelState => {
    let selectedChannels: Channel[] = [];
    if (connectionId) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [id, channel] of Object.entries(channelState.entities)) {
        if (channel && channel.connectionId === connectionId) {
          selectedChannels.push(channel);
        }
      }
    }
    return selectedChannels;
  });
};

export const channelStateSelector = createSelector(
  [selectSlice],
  channelState => {
    return {
      loading: channelState.loading,
      selectedConnections: channelState.selectedConnections,
    };
  },
);
