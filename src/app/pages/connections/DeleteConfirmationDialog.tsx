import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connectionsActions } from 'app/features/connections/slice';
import { Connection } from 'app/features/connections/slice/types';
import { useAppDispatch } from 'store/hooks';

export interface DeleteConfirmationDialogProps {
  open: boolean;
  connection: Connection;
  onClose;
}

export default function DeleteConfirmationDialog(
  props: DeleteConfirmationDialogProps,
) {
  const dispatch = useAppDispatch();
  const { connection, open, onClose } = props;
  const onDeleteConfirm = () => {
    dispatch(connectionsActions.removeConnectionAndReferences(connection.id));
    onClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Confirm Delete'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to DELETE this connection?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="primary">
            Cancel
          </Button>
          <Button
            onClick={onDeleteConfirm}
            variant="contained"
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
