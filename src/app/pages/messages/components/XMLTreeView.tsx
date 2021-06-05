import React from 'react';

import { Typography } from '@material-ui/core';
import format from 'xml-formatter';

function XMLTreeView(props: { data: string }) {
  const { data } = props;
  let formattedXML = '';
  try {
    formattedXML = format(data);
  } catch (err) {}
  return (
    <Typography gutterBottom component="div" style={{ whiteSpace: 'pre' }}>
      {formattedXML}
    </Typography>
  );
}

export default XMLTreeView;
