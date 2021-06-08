import DateFnsUtils from '@date-io/date-fns';
import APIConstants from 'app/constants/APIConstants';
import { put, takeLatest, select } from 'redux-saga/effects';
import log from 'utils/logger';

import { getMessageCount, loadMessages } from './messageAPI';
import { messagesSelector } from './selectors';
import { MessageSearchParams, MessageState } from './types';

import { messageActions as actions } from '.';

export function* messagesSaga() {
  yield takeLatest(actions.setMessageSearchParams.type, onSearchParamChange);
  yield takeLatest(actions.setPaginationPage.type, onPageChange);
}

function* onPageChange() {
  const messageState: MessageState = yield select(messagesSelector);
  yield searchMessages(messageState);
}

function* onSearchParamChange() {
  yield put(actions.reset());
  const messageState: MessageState = yield select(messagesSelector);
  yield searchMessages(messageState, true);
}

function* searchMessages(messageState: MessageState, isNewSearch?: boolean) {
  const messageSearchParams: MessageSearchParams = messageState.searchParams;
  try {
    yield put(actions.setLoading(true));
    const channelIdToSearch =
      messageSearchParams?.selectedChannels?.[0]?.channelId;
    const selectedConnection = messageSearchParams?.selectedConnection;
    if (channelIdToSearch) {
      let queryParams = new URLSearchParams();
      const nonSearchableKeys = [
        'selectedConnection',
        'selectedChannels',
        'offset',
        'limit',
      ];
      for (let [key, value] of Object.entries(messageSearchParams)) {
        if (value && !nonSearchableKeys.includes(key)) {
          //if date convert to string format 1985-10-26T09:00:00.000-0700
          if (value instanceof Date) {
            value = new DateFnsUtils().format(
              value,
              "yyyy-MM-dd'T'HH:mm:ss.SSSxxxx",
            );
          }
          queryParams.append(key, value);
        }
      }
      queryParams.append('includeContent', 'false');
      const limit =
        messageSearchParams?.limit || APIConstants.DEFAULT_ROW_COUNT;
      const offset = (messageSearchParams?.page || 0) * limit;
      queryParams.append('offset', offset.toString());
      queryParams.append('limit', limit.toString());
      const queryParamsString = queryParams.toString();
      const messageResponse = yield loadMessages({
        connection: selectedConnection,
        channelId: channelIdToSearch,
        params: queryParamsString,
      });
      //get and set count only for cleared searches. if just paginating, skip
      if (isNewSearch) {
        const messageTotalCount = yield getMessageCount({
          connection: selectedConnection,
          channelId: channelIdToSearch,
          params: queryParamsString,
        });
        yield put(actions.setMessageCount(parseInt(messageTotalCount || 0)));
      }
      yield put(actions.setMessages(messageResponse));
    }
  } catch (err) {
    log.error('Error loading messages ', err);
    yield put(actions.setError(err));
  } finally {
    yield put(actions.setLoading(false));
  }
}
