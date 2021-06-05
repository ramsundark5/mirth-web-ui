import React from 'react';

import { Box } from '@material-ui/core';
import JSONTree from 'react-json-tree';

function JSONTreeView(props: { data: string }) {
  const { data } = props;
  let jsonData = {};
  try {
    jsonData = JSON.parse(data);
  } catch (err) {}
  return (
    <Box style={{ overflow: 'auto', maxHeight: 600 }}>
      <JSONTree data={jsonData} />
    </Box>
  );
}

export default JSONTreeView;
