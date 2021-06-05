import { RootState } from 'store/types';

import { initialState } from '.';

export const messagesSelector = (state: RootState) => {
  if (state && state.messages) {
    return state.messages;
  }
  return initialState;
};
