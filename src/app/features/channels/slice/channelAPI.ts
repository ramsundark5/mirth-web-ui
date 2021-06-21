import APIConstants from 'app/constants/APIConstants';
import log from 'utils/logger';
import { IMirthAPIConfig, requestMirthAPI } from 'utils/request';

export const getChannelDetail = async ({
  connection,
  channelId,
}): Promise<any> => {
  let url =
    (connection.url || APIConstants.MIRTH_DEFAULT_URL) +
    APIConstants.MIRTH_CHANNEL_DETAIL(channelId);
  const mirthAPIConfig: IMirthAPIConfig = {
    url: url,
    method: 'GET',
    connectionId: connection.id,
    jsessionid: connection.jsessionid,
  };
  const results = await requestMirthAPI(mirthAPIConfig);
  log.info('channel details ' + results);
  return results;
};