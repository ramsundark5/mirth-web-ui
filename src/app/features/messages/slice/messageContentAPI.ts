import APIConstants from 'app/constants/APIConstants';
import { requestMirthAPI } from 'utils/request';

import { ConnectorMessage, Message, MessageContent } from './types';

export const loadMessageContent = async ({
  connection,
  channelId,
  messageId,
}) => {
  const url =
    (connection.url || APIConstants.MIRTH_DEFAULT_URL) +
    '/api/channels/' +
    channelId +
    '/messages/' +
    messageId;
  const results = await requestMirthAPI({
    url: url,
    method: 'GET',
    connectionId: connection.id,
    jsessionid: connection.jsessionid,
  });
  const message = buildMessage(results);
  return message;
};

const buildMessage = (response): Message => {
  const messageSegment = response?.message;
  let message: Message = {
    channelId: messageSegment.channelId?.[0],
    serverId: messageSegment.serverId?.[0],
    messageId: messageSegment.messageId?.[0],
  };
  const connectorResponseList = messageSegment?.connectorMessages?.[0]?.entry;
  let connectorMessageList: ConnectorMessage[] = [];
  if (connectorResponseList && Array.isArray(connectorResponseList)) {
    for (let connectorSegment of connectorResponseList) {
      let connectorMessage = buildConnectorMessage(
        connectorSegment?.connectorMessage,
      );
      connectorMessageList.push(connectorMessage);
    }
  }
  message.connectors = connectorMessageList;
  return message;
};

const buildConnectorMessage = (connectorMessagesArray): ConnectorMessage => {
  let connectorMessage: ConnectorMessage = {} as ConnectorMessage;
  if (connectorMessagesArray && Array.isArray(connectorMessagesArray)) {
    const connectorMessageItem = connectorMessagesArray?.[0];
    connectorMessage.messageId = connectorMessageItem?.messageId?.[0];
    connectorMessage.channelId = connectorMessageItem?.channelId?.[0];
    connectorMessage.channelName = connectorMessageItem?.channelName?.[0];
    connectorMessage.connectorName = connectorMessageItem?.connectorName?.[0];
    connectorMessage.status = connectorMessageItem?.status?.[0];
    connectorMessage.orderId = parseInt(
      connectorMessageItem?.orderId?.[0] || 0,
    );
    connectorMessage.errorCode = parseInt(
      connectorMessageItem?.errorCode?.[0] || 0,
    );

    connectorMessage.contents = [];

    const contentTypeList = [
      'raw',
      'processedRaw',
      'transformed',
      'encoded',
      'response',
      'responseTransformed',
      'processedResponse',
    ];

    for (const contentType of contentTypeList) {
      const contentItem = connectorMessageItem?.[contentType]?.[0];
      const content = buildMessageContent(contentItem, contentType);
      connectorMessage.contents.push(content);
    }

    //errors
    connectorMessage.processingError =
      connectorMessageItem?.processingErrorContent?.[0]?.content?.[0];
    connectorMessage.responseError =
      connectorMessageItem?.responseErrorContent?.[0]?.content?.[0];
    connectorMessage.postProcessorError =
      connectorMessageItem?.postProcessorErrorContent?.[0]?.content?.[0];
  }
  return connectorMessage;
};

const buildMessageContent = (messageContentSegment, type): MessageContent => {
  const messageContent: MessageContent = {
    type: type,
    content: messageContentSegment?.content?.[0],
    contentType: messageContentSegment?.contentType?.[0],
    dataType: messageContentSegment?.dataType?.[0],
    encrypted: messageContentSegment?.encrypted?.[0],
  };
  return messageContent;
};
