import { createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { Connection, ConnectionError, IMirthClientParams } from './types';

export const connectionAdapter = createEntityAdapter<Connection>({
  selectId: connection => connection.id,
  sortComparer: (a, b) => a.id.localeCompare(b.id),
});

export const initialState = connectionAdapter.getInitialState({
  loading: false,
  error: {} as ConnectionError,
});

const slice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    onLogin(state, { payload }: PayloadAction<IMirthClientParams>) {},
    addConnection: connectionAdapter.addOne,
    updateConnection: connectionAdapter.updateOne,
    upsertConnection: connectionAdapter.upsertOne,
    removeConnection: connectionAdapter.removeOne,
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<ConnectionError>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = {} as ConnectionError;
    },
  },
});

export const { actions: connectionsActions } = slice;
export default slice.reducer;
