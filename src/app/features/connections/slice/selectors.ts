import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/types';

import { Connection } from './types';

import { connectionAdapter, initialState } from '.';

const selectSlice = (state: RootState) => {
  if (state && state.connections) {
    return state.connections;
  }
  return initialState;
};

// Can create a set of memoized selectors based on the location of this entity state
export const connectionEntitySelector =
  connectionAdapter.getSelectors<RootState>(state => {
    if (state && state.connections) {
      return state.connections;
    }
    return connectionAdapter.getInitialState();
  });

export const selectAnyConnected = createSelector(
  [selectSlice],
  connectionState => {
    let anyConnected = false;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [id, connection] of Object.entries(connectionState.entities)) {
      if (connection?.isConnected) {
        anyConnected = true;
        break;
      }
    }
    return anyConnected;
  },
);

export const activeConnectionSelector = createSelector(
  [selectSlice],
  connectionState => {
    let activeConnections: Connection[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [id, connection] of Object.entries(connectionState.entities)) {
      if (connection?.isConnected) {
        activeConnections.push(connection);
      }
    }
    return activeConnections;
  },
);

export const connectionStateSelector = createSelector(
  [selectSlice],
  connectionState => {
    return {
      loading: connectionState.loading,
      error: connectionState.error,
    };
  },
);
