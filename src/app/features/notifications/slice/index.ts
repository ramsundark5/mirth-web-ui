import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { Notification } from './types';

export const notificationAdapter = createEntityAdapter<Notification>({
  selectId: notification => notification.id,
  sortComparer: (a, b) => a.id.localeCompare(b.id),
});

export const initialState = notificationAdapter.getInitialState();
export const slice = createSlice({
  name: 'notifications',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    enqueueNotification: notificationAdapter.addOne,
    removeNotification: notificationAdapter.removeOne,
    // Use the PayloadAction type to declare the contents of `action.payload`
    clearNotification: notificationAdapter.removeAll,
  },
});

export const { actions: notificationsActions } = slice;
export default slice.reducer;
