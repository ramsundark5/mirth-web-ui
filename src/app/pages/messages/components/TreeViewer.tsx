import React from 'react';

import HL7TreeView from './HL7TreeView';
import JSONTreeView from './JSONTreeView';
import XMLTreeView from './XMLTreeView';

function TreeViewer(props: { messageContent: string }) {
  const { messageContent } = props;

  const isJSON = (messageContent: string) => {
    return messageContent.startsWith('{') || messageContent.startsWith('[');
  };

  const isXML = (messageContent: string) => {
    return messageContent.startsWith('<');
  };

  const renderFormattedView = () => {
    if (isJSON(messageContent)) {
      return <JSONTreeView data={messageContent} />;
    } else if (isXML(messageContent)) {
      return <XMLTreeView data={messageContent} />;
    } else {
      return <HL7TreeView messageContent={messageContent} />;
    }
  };

  return <>{renderFormattedView()}</>;
}

export default TreeViewer;
