import * as React from 'react';

import MessageViewer from './components/MessageViewer';
export function MessagesPage() {
  return (
    <>
      <title>Messages Page</title>
      <meta name="description" content="View Messages" />
      <MessageViewer />
    </>
  );
}
