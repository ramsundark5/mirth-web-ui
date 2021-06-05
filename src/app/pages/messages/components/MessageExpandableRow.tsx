import React, { useState } from 'react';

import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { KeyboardArrowDown, KeyboardArrowRight } from '@material-ui/icons';

import MessageContainer from './MessageContainer';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

export default function MessageExpandableRow(props: {
  connectorMessageRow;
  connection;
  channelId;
  messageId;
}) {
  const { connectorMessageRow, messageId } = props;
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();
  const rowKey = messageId + connectorMessageRow[0];

  return (
    <React.Fragment key={rowKey}>
      <TableRow className={classes.root} key={rowKey}>
        <TableCell />
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
          </IconButton>
        </TableCell>
        {connectorMessageRow.map((cell, index) => {
          return <TableCell key={rowKey + index}>{cell}</TableCell>;
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <MessageContainer {...props} />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
