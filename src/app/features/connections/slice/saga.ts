import { PayloadAction } from '@reduxjs/toolkit';
import APIConstants from 'app/constants/APIConstants';
import { call, put, takeLatest } from 'redux-saga/effects';
import log from 'utils/logger';
import { request } from 'utils/request';

import { IMirthClientParams } from './types';

import { connectionsActions as actions, SUBMIT_STATES } from '.';

export function* connectionsSaga() {
  yield takeLatest(actions.onLogin.type, login);
}

export function* login({ payload }: PayloadAction<IMirthClientParams>) {
  let connection = {
    id: payload.url,
    url: payload.url,
    username: payload.username || APIConstants.MIRTH_DEFAULT_USERNAME,
  };
  try {
    yield put(actions.setSubmitState(SUBMIT_STATES.PENDING.toString()));
    yield put(actions.clearError());
    //add connection and set loading to false
    yield put(actions.addConnection(connection));

    //make API call to login to mirth
    const url =
      (payload.url || APIConstants.MIRTH_DEFAULT_URL) +
      APIConstants.MIRTH_LOGIN;
    const response = yield call(
      request,
      {
        url: APIConstants.PROXY_API_LOGIN,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'mirth-url': url,
        },
        data: new URLSearchParams({
          username: connection.username,
          password: payload.password || APIConstants.MIRTH_DEFAULT_PASSWORD,
        }),
      },
      connection.id,
      true,
    );

    //update connection with response data
    yield updateConnectionFromResponse(connection.id, response);
    yield put(actions.setSubmitState(SUBMIT_STATES.SUCCESS.toString()));
    log.info('currentConnection is: ', connection);
  } catch (err) {
    yield put(actions.setSubmitState(SUBMIT_STATES.ERROR.toString()));
    const connectionError = {
      status: err?.status,
      message: err?.message,
      connectionId: connection.id,
    };
    yield put(actions.setError(connectionError));
    yield put(
      actions.updateConnection({
        id: connection.id,
        changes: { isConnected: false, error: connectionError },
      }),
    );
  }
}

function* updateConnectionFromResponse(connectionId, response) {
  const loginStatus = response?.['com.mirth.connect.model.LoginStatus'];
  if (loginStatus) {
    let username = loginStatus.updatedUsername?.[0];
    let status = loginStatus.status?.[0];
    yield put(
      actions.updateConnection({
        id: connectionId,
        changes: {
          isConnected: true,
          username: username,
          status: status,
          jsessionid: response.jsessionid,
          error: undefined,
        },
      }),
    );
  } else {
    const authFailed = {
      status: 500,
      message: 'authentication failed',
      connectionId: connectionId,
    };
    yield put(
      actions.updateConnection({
        id: connectionId,
        changes: { isConnected: false, error: authFailed },
      }),
    );
  }
}
