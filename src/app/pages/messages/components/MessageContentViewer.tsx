import React, { useEffect, useState, memo } from 'react';

import { Box, Paper, Tab, Tabs, Typography } from '@material-ui/core';
import { xmlParse } from 'utils/xmlBuilder';

import TreeViewer from './TreeViewer';

function MessagesContentViewer(props: {
  messageContentKey;
  messageContents;
  selectedMessageContentType;
}) {
  const [tabIndex, setTabIndex] = useState(0);
  const { messageContentKey, messageContents, selectedMessageContentType } =
    props;
  const [messageContent, setMessageContent] = useState<string>('');
  const messageContentsLength = messageContents?.length || 0;

  useEffect(() => {
    setSelectedMessageContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageContentsLength, messageContentKey]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  const setSelectedMessageContent = async () => {
    for (const messageContentItem of messageContents) {
      if (messageContentItem.type === selectedMessageContentType) {
        let content = messageContentItem.content;
        if (messageContentItem.type === 'response') {
          const jsonMessage = await xmlParse(messageContentItem?.content || '');
          content = jsonMessage?.response?.message?.[0];
        }
        setMessageContent(content);
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
            {messageContent}
          </Typography>
        </Box>
      ) : (
        <TreeViewer messageContent={messageContent || ''} />
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
