import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/types';

import { notificationAdapter, initialState } from '.';

const selectSlice = (state: RootState) => {
  if (state && state.connections) {
    return state.connections;
  }
  return initialState;
};

// Can create a set of memoized selectors based on the location of this entity state
export const notificationEntitySelector =
  notificationAdapter.getSelectors<RootState>(state => {
    if (state && state.notifications) {
      return state.notifications;
    }
    return notificationAdapter.getInitialState();
  });

export const notificationStateSelector = createSelector(
  [selectSlice],
  notificationState => {
    return notificationState;
  },
);
