import { PayloadAction } from '@reduxjs/toolkit';
import APIConstants from 'app/constants/APIConstants';
import { selectConectionById } from 'app/features/connections/slice/selectors';
import { Connection } from 'app/features/connections/slice/types';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import log from 'utils/logger';
import { requestMirthAPI } from 'utils/request';

import { selectChannelById } from './selectors';
import { Channel, ChannelActionParam, CHANNEL_ACTIONS } from './types';

import { channelsActions as actions } from '.';

export function* channelsSaga() {
  yield takeLatest(actions.loadChannels.type, onLoadChannels);
  yield takeLatest(actions.loadChannelsSilently.type, onLoadChannelsSilently);
  yield takeLatest(actions.applyAction.type, onApplyChannelAction);
}

function* onLoadChannels({ payload }: PayloadAction<Connection[]>) {
  yield put(actions.setLoading(true));
  yield loadChannels(payload);
  yield put(actions.setLoading(false));
}

function* onLoadChannelsSilently({ payload }: PayloadAction<Connection[]>) {
  if (payload && payload.length > 0) {
    const validConnections = payload.filter(
      connection => connection.isConnected,
    );
    yield loadChannels(validConnections);
  }
}

function* loadChannels(selectedConnections: Connection[]) {
  let allChannelList: Channel[] = [];
  try {
    for (const connection of selectedConnections) {
      const url =
        (connection.url || APIConstants.MIRTH_DEFAULT_URL) +
        APIConstants.MIRTH_CHANNEL_STATUSES;
      const response = yield call(requestMirthAPI, {
        url: url,
        method: 'GET',
        connectionId: connection.id,
        jsessionid: connection.jsessionid,
      });
      const channelList: Channel[] = buildChannels(response, connection);
      if (channelList) {
        allChannelList.push(...channelList);
      } else {
        log.error('No channels returned for connection ', connection.id);
      }
    }
    yield put(actions.upsertManyChannels(allChannelList));
  } catch (err) {
    log.error('Error loading channels for connection ', err);
  }
}

function buildChannels(response, connection) {
  let channelList: Channel[] = [];
  const channelResponseList = response?.list?.dashboardStatus;
  if (channelResponseList) {
    for (let channelSegment of channelResponseList) {
      let channelData: Channel = buildChannel(channelSegment, connection.id);
      channelList.push(channelData);
    }
  }
  return channelList;
}

function buildChannel(channelSegment, connectionId) {
  let channelData: Channel = {
    id: channelSegment.channelId?.[0] + '_' + connectionId,
    channelId: channelSegment.channelId?.[0],
    connectionId: connectionId,
    name: channelSegment.name?.[0],
    state: channelSegment.state?.[0],
  };
  let statisticSegment = channelSegment.statistics;
  let statisticArray = statisticSegment?.[0]?.entry || [];
  channelData.statistic = buildStatistic(
    statisticArray,
    channelSegment?.queued?.[0],
  );
  const connectorResponseList =
    channelSegment?.childStatuses?.[0]?.dashboardStatus;
  let conectorList: Channel[] = [];
  if (connectorResponseList) {
    for (let connectorSegment of connectorResponseList) {
      let connectorData: Channel = buildChannel(connectorSegment, connectionId);
      conectorList.push(connectorData);
    }
  }
  channelData.connectors = conectorList;
  return channelData;
}

function buildStatistic(statisticArray, queued) {
  let statistic = {};
  for (let statisticItem of statisticArray) {
    let statisticStatus =
      statisticItem['com.mirth.connect.donkey.model.message.Status']?.[0];
    statistic[statisticStatus] = parseInt(statisticItem.long?.[0] || -1);
  }
  statistic['QUEUED'] = parseInt(queued || 0);
  return statistic;
}

function* onApplyChannelAction({ payload }: PayloadAction<ChannelActionParam>) {
  yield put(actions.setLoading(true));
  try {
    yield setPendingStatus(payload.channelUidList, payload.action);
    const channelUidList = payload.channelUidList || [];
    for (let channelUid of channelUidList) {
      const selectedChannel = yield select(selectChannelById(channelUid));
      const connectionId = selectedChannel?.connectionId;
      const connection = yield select(selectConectionById(connectionId));
      const action = '_' + payload.action?.toLowerCase();
      const url =
        (connection.url || APIConstants.MIRTH_DEFAULT_URL) +
        APIConstants.MIRTH_CHANNEL_STATUS_ACTIONS(
          selectedChannel?.channelId,
          action,
        );
      yield call(requestMirthAPI, {
        url: url,
        method: 'POST',
        connectionId: connection.id,
        jsessionid: connection.jsessionid,
      });
    }
  } catch (err) {
    log.error('Error changing channel state ', err);
  } finally {
    localStorage.setItem('channelSelectedForAction', '0');
    yield put(actions.setLoading(false));
  }
}

function* setPendingStatus(channelUidList, action) {
  let status = 'STARTED';
  switch (action) {
    case CHANNEL_ACTIONS.START.toString():
      status = 'STARTING';
      break;
    case CHANNEL_ACTIONS.STOP.toString():
      status = 'STOPPING';
      break;
    case CHANNEL_ACTIONS.HALT.toString():
      status = 'HALTING';
      break;
    case CHANNEL_ACTIONS.PAUSE.toString():
      status = 'PAUSING';
      break;
    case CHANNEL_ACTIONS.RESUME.toString():
      status = 'RESUMING';
      break;
    default:
      status = 'STARTED';
  }
  for (const channelUid of channelUidList || []) {
    const updates = { id: channelUid, changes: { state: status } };
    yield put(actions.updateChannel(updates));
  }
}
