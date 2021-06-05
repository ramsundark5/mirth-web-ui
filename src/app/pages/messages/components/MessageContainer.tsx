import React, { useEffect, useState, memo } from 'react';

import {
  FormControl,
  FormControlLabel,
  makeStyles,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { loadMessageContent } from 'app/features/messages/slice/messageContentAPI';
import { Message, MessageContent } from 'app/features/messages/slice/types';

import MessagesContentViewer from './MessageContentViewer';

function MessageContainer(props: {
  connectorMessageRow;
  connection;
  channelId;
  messageId;
}) {
  const classes = useStyles();
  const { connectorMessageRow, connection, channelId, messageId } = props;
  const selectedConnectorName = connectorMessageRow?.[0];
  const [messageContentResponse, setMessageContentResponse] = useState<Message>(
    {} as Message,
  );
  const [messageContentTypes, setMessageContentTypes] = useState<string[]>([]);
  const [selectedMessageContents, setSelectedMessageContents] = useState<
    MessageContent[]
  >([]);
  const [selectedMessageContentType, setSelectedMessageContentType] =
    useState('raw');

  const messageContentKey = messageId + selectedMessageContentType;

  useEffect(() => {
    callMessageContentAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, messageId]);

  useEffect(() => {
    buildSelectedMessageDetails(messageContentResponse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageContentResponse, selectedConnectorName]);

  const callMessageContentAPI = async () => {
    let messageContentResult = await loadMessageContent({
      connection,
      channelId,
      messageId,
    });
    setMessageContentResponse(messageContentResult);
    buildSelectedMessageDetails(messageContentResult);
  };

  const buildSelectedMessageDetails = messageContentResponseParam => {
    const connectors = messageContentResponseParam?.connectors;
    if (connectors && connectors.length > 0) {
      for (const connectorMessage of connectors) {
        if (connectorMessage.connectorName === selectedConnectorName) {
          const messageContents = connectorMessage.contents || [];
          setSelectedMessageContents(messageContents);
          setSelectedMessageContentTypes(messageContents);
        }
      }
    }
  };

  const setSelectedMessageContentTypes = (
    messageContents: MessageContent[],
  ) => {
    let messageContentTypes: string[] = [];
    for (const messageContent of messageContents) {
      if (messageContent.content && messageContent.content.length > 0) {
        messageContentTypes.push(messageContent.type);
      }
    }
    setMessageContentTypes(messageContentTypes);
  };

  const handleMessageContentTypeChange = (event, value) => {
    setSelectedMessageContentType(value);
  };

  return (
    <Box margin={1} className={classes.root}>
      <Typography variant="h6" gutterBottom component="div">
        Content
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup
          row
          name="messageContentType"
          value={selectedMessageContentType}
          onChange={handleMessageContentTypeChange}
        >
          {messageContentTypes.map((messageContentType, index) => {
            return (
              <FormControlLabel
                key={messageContentType}
                value={messageContentType}
                control={<Radio />}
                label={messageContentType}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
      <MessagesContentViewer
        messageContentKey={messageContentKey}
        messageContents={selectedMessageContents}
        selectedMessageContentType={selectedMessageContentType}
      />
    </Box>
  );
}

function areDataEqual(prevProps, nextProps) {
  let connectorMessageEqual =
    prevProps?.connectorMessageRow?.[0] === nextProps?.connectorMessageRow?.[0];
  return prevProps.messageId === nextProps.messageId && connectorMessageEqual;
}
const useStyles = makeStyles({
  root: {
    overflow: 'auto',
    maxHeight: 600,
  },
});
export default memo(MessageContainer, areDataEqual);
