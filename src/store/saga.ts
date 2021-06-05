import { all } from 'redux-saga/effects';

import { channelsSaga } from '../app/features/channels/slice/saga';
import { connectionsSaga } from '../app/features/connections/slice/saga';
import { messagesSaga } from '../app/features/messages/slice/saga';

export default function* rootSaga() {
  yield all([connectionsSaga(), channelsSaga(), messagesSaga()]);
}
