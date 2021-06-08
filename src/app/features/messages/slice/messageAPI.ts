import APIConstants from 'app/constants/APIConstants';
import log from 'utils/logger';
import { IMirthAPIConfig, requestMirthAPI } from 'utils/request';

import { Message, ConnectorMessage } from './types';

export const getMessageCount = async ({
  connection,
  channelId,
  params,
}): Promise<number> => {
  let url =
    (connection.url || APIConstants.MIRTH_DEFAULT_URL) +
    APIConstants.MIRTH_CHANNEL_MESSAGES_COUNT(channelId) +
    params;
  const mirthAPIConfig: IMirthAPIConfig = {
    url: url,
    method: 'GET',
    connectionId: connection.id,
    jsessionid: connection.jsessionid,
  };
  const results = await requestMirthAPI(mirthAPIConfig);
  const count = results?.['long'];
  log.debug('total messages ' + count);
  return count;
};

export const loadMessages = async ({
  connection,
  channelId,
  params,
}): Promise<Message[]> => {
  let url =
    (connection.url || APIConstants.MIRTH_DEFAULT_URL) +
    APIConstants.MIRTH_CHANNEL_MESSAGES(channelId) +
    params;
  const mirthAPIConfig: IMirthAPIConfig = {
    url: url,
    method: 'GET',
    connectionId: connection.id,
    jsessionid: connection.jsessionid,
  };
  const results = await requestMirthAPI(mirthAPIConfig);
  const messages = buildMessages(results);
  log.debug(results);
  return messages;
};

const buildMessages = (response): Message[] => {
  let messages: Message[] = [];
  const messageResponseList = response?.list?.message;
  if (messageResponseList && Array.isArray(messageResponseList)) {
    for (let messageSegment of messageResponseList) {
      let messageData = buildMessage(messageSegment);
      messages.push(messageData);
    }
  }
  return messages;
};

const buildMessage = (messageSegment): Message => {
  let messageData: Message = {
    channelId: messageSegment.channelId?.[0],
    serverId: messageSegment.serverId?.[0],
    messageId: parseInt(messageSegment.messageId?.[0]),
    processed: messageSegment.processed?.[0],
    receivedDate: parseInt(messageSegment.receivedDate?.[0]?.time?.[0] || 0),
    responseDate: 0,
  };
  const connectorResponseList = messageSegment?.connectorMessages?.[0]?.entry;
  let connectorMessageList: any = [];
  if (connectorResponseList && Array.isArray(connectorResponseList)) {
    for (let connectorSegment of connectorResponseList) {
      let connectorData = buildConnectorMessage(
        connectorSegment?.connectorMessage,
      );
      connectorMessageList.push(connectorData);
    }
  }
  messageData.connectors = connectorMessageList;
  messageData.channelName = connectorMessageList?.[0]?.channelName;
  return messageData;
};

const buildConnectorMessage = (
  connectorMessagesArray,
): ConnectorMessage | null => {
  if (connectorMessagesArray && Array.isArray(connectorMessagesArray)) {
    const connectorItem = connectorMessagesArray?.[0];
    const connectorMessage: ConnectorMessage = {
      messageId: connectorItem?.messageId?.[0],
      channelId: connectorItem?.channelId?.[0],
      channelName: connectorItem?.channelName?.[0],
      connectorName: connectorItem?.connectorName?.[0],
      receivedDate: parseInt(connectorItem?.receivedDate?.[0]?.time?.[0] || 0),
      responseDate: parseInt(connectorItem?.responseDate?.[0]?.time?.[0] || 0),
      status: connectorItem?.status?.[0],
      orderId: parseInt(connectorItem?.orderId?.[0] || 0),
    };
    return connectorMessage;
  }
  return null;
};
