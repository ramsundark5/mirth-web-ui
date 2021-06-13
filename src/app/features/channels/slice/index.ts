import { createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Connection } from 'app/features/connections/slice/types';

import { Channel, ChannelActionParam } from './types';

export const channelAdapter = createEntityAdapter<Channel>({
  selectId: channel => channel.channelId || '',
  sortComparer: (a, b) => a.channelId.localeCompare(b.channelId),
});

export const initialState = channelAdapter.getInitialState({
  loading: false,
  channelsSelectedForAction: [] as string[],
  selectedConnections: [] as Connection[],
});

const slice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    loadChannels(state, { payload }: PayloadAction<Connection[]>) {},
    loadChannelsSilently(state, { payload }: PayloadAction<Connection[]>) {},
    addChannel: channelAdapter.addOne,
    addManyChannels: channelAdapter.addMany,
    upsertManyChannels: channelAdapter.upsertMany,
    updateChannel: channelAdapter.updateOne,
    upsertChannel: channelAdapter.upsertOne,
    removeChannel: channelAdapter.removeOne,
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSelectedConnections(state, action: PayloadAction<Connection[]>) {
      state.selectedConnections = action.payload;
    },
    setChannelsSelectedForAction(state, action: PayloadAction<string[]>) {
      state.channelsSelectedForAction = action.payload;
    },
    applyAction(state, { payload }: PayloadAction<ChannelActionParam>) {},
  },
});

export const { actions: channelsActions } = slice;
export default slice.reducer;
