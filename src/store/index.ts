import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { save, load } from 'redux-localstorage-simple';
import createSagaMiddleware from 'redux-saga';

import channelsReducer from '../app/features/channels/slice';
import connectionReducer from '../app/features/connections/slice';
import messageReducer from '../app/features/messages/slice';
import notificationReducer from '../app/features/notifications/slice';

import rootSaga from './saga';

const reduxSagaMonitorOptions = {};
const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);

const persistConfigs = {
  states: [
    'connections.ids',
    'connections.entities',
    'channels.ids',
    'channels.entities',
  ],
  namespace: 'mirthui',
  debounce: 300,
};

const persistorMiddleware = save(persistConfigs);
const hydrator = load(persistConfigs);

// Create the store with saga and persistor middleware
const middlewares = [sagaMiddleware, persistorMiddleware];

export const store = configureStore({
  reducer: {
    connections: connectionReducer,
    channels: channelsReducer,
    messages: messageReducer,
    notifications: notificationReducer,
  },
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
    ...middlewares,
  ],
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: hydrator,
});

// Then run the saga
sagaMiddleware.run(rootSaga);
