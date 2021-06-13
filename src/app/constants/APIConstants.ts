/* eslint-disable no-template-curly-in-string */
class APIConstants {
  DEFAULT_OFFSET = 0;
  DEFAULT_ROW_COUNT = 20;
  DASHBOARD_RELOAD_INTERVAL = 10000; //in milliseconds
  PROXY_API_LOGIN = '/mirth/login';
  PROXY_API_REQUEST = '/mirth/api';
  MIRTH_DEFAULT_URL = 'https://localhost:8443';
  MIRTH_DEFAULT_USERNAME = 'admin';
  MIRTH_DEFAULT_PASSWORD = 'admin';
  MIRTH_LOGIN = '/api/users/_login';
  MIRTH_CHANNEL_STATUSES = '/api/channels/statuses';
  MIRTH_CHANNEL_STATUS_ACTIONS = (channelId, action) =>
    `/api/channels/${channelId}/${action}?returnErrors=true`;
  MIRTH_CHANNEL_MESSAGES = channelId => `/api/channels/${channelId}/messages?`;
  MIRTH_CHANNEL_MESSAGES_COUNT = channelId =>
    `/api/channels/${channelId}/messages/count?`;
  MIRTH_CHANNEL_MESSAGE_CONTENT = (channelId, messageId) =>
    `api/channels/${channelId}/messages/${messageId}`;
}
export default new APIConstants();
