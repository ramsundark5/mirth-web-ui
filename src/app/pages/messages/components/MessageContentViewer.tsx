import React, { useEffect, useState, memo } from 'react';

import { Box, Paper, Tab, Tabs, Typography } from '@material-ui/core';
import { MessageContent } from 'app/features/messages/slice/types';
import { parse } from 'utils/hl7parser';

import TreeViewer from './TreeViewer';

function MessagesContentViewer(props: {
  messageContentKey;
  messageContents;
  selectedMessageContentType;
}) {
  const [tabIndex, setTabIndex] = useState(0);
  const { messageContentKey, messageContents, selectedMessageContentType } =
    props;
  const [messageContent, setMessageContent] = useState<MessageContent>(
    {} as MessageContent,
  );
  const messageContentsLength = messageContents?.length || 0;

  useEffect(() => {
    setSelectedMessageContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageContentsLength, messageContentKey]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  const setSelectedMessageContent = () => {
    for (const messageContent of messageContents) {
      if (messageContent.type === selectedMessageContentType) {
        try {
          console.log(parse(messageContent.content));
        } catch (err) {
          console.log(err);
        }
        setMessageContent(messageContent);
        break;
      }
    }
  };
  return (
    <Paper elevation={3}>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="Raw" />
        <Tab label="Tree View" />
      </Tabs>
      {tabIndex === 0 ? (
        <Box margin={1} style={{ overflow: 'auto' }}>
          <Typography gutterBottom component="div">
            {messageContent.content}
          </Typography>
        </Box>
      ) : (
        <TreeViewer messageContent={messageContent.content || ''} />
      )}
    </Paper>
  );
}

function areMessageContentTypeEqual(prevProps, nextProps) {
  return (
    prevProps.messageContentKey === nextProps.messageContentKey &&
    prevProps.messageContents?.length === nextProps.messageContents?.length
  );
}

export default memo(MessagesContentViewer, areMessageContentTypeEqual);
