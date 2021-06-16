import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import APIConstants from 'app/constants/APIConstants';
import { Connection } from 'app/features/connections/slice/types';
import {subMinutes } from 'date-fns';

import {
  MessageState,
  MessageSearchParams,
  Message,
  MessageError,
} from './types';

export const initialState: MessageState = {
  messages: [],
  searchParams: {
    selectedConnection: undefined,
    selectedChannels: [],
    textSearch: '',
    textSearchRegex: false,
    startDate: subMinutes(new Date(), 60), //set start date to 1 hr in the past
    endDate: new Date(),
    page: 0,
    limit: APIConstants.DEFAULT_ROW_COUNT,
  },
  totalCount: 0,
  loading: false,
  error: {} as MessageError,
};

const slice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessageSearchParams(state, action: PayloadAction<MessageSearchParams>) {
      state.searchParams = action.payload;
    },
    setSelectedConnection(state, action: PayloadAction<Connection>) {
      state.searchParams.selectedConnection = action.payload;
    },
    setPaginationPage(state, action: PayloadAction<number>) {
      state.searchParams.page = action.payload;
    },
    setPaginationLimit(state, action: PayloadAction<number>) {
      state.searchParams.limit = action.payload;
    },
    clearMessageSearchParams(state) {
      state = initialState;
    },
    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
    clearMessages(state) {
      state.messages = [];
    },
    setMessageCount(state, action: PayloadAction<number>) {
      state.totalCount = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<MessageError>) {
      state.error = action.payload;
    },
    reset(state) {
      state.totalCount = 0;
      state.searchParams.page = 0;
    },
    clearError(state) {
      state.error = {} as MessageError;
    },
  },
});

export const { actions: messageActions } = slice;
export default slice.reducer;
