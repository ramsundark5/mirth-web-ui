import React, { useState } from 'react';

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  List,
  Dialog,
} from '@material-ui/core';
import { green, grey } from '@material-ui/core/colors';
import {
  AddOutlined,
  DeleteOutlined,
  EditOutlined,
  FiberManualRecord,
} from '@material-ui/icons';
import { connectionEntitySelector } from 'app/features/connections/slice/selectors';
import { Connection } from 'app/features/connections/slice/types';
import { useAppSelector } from 'store/hooks';

import EditConnection from './EditConnection';

export default function ConnectionList() {
  const connections: Connection[] = useAppSelector(
    connectionEntitySelector.selectAll,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connectionToEdit, setConnectionToEdit] = useState<Connection>(
    {} as Connection,
  );

  const renderStatus = connection => {
    const isConnected = connection.isConnected;
    const statusText = isConnected ? 'connected' : 'disconnected';
    const statusColor = isConnected ? green[500] : grey[500];
    return (
      <Button
        size="small"
        style={{ pointerEvents: 'none', padding: 0 }}
        startIcon={<FiberManualRecord style={{ color: statusColor }} />}
      >
        {statusText}
      </Button>
    );
  };

  const onEditConnection = connection => {
    setConnectionToEdit(connection);
    setDialogOpen(true);
  };

  const onDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <List>
        <Grid container spacing={2} justify="space-evenly">
          {connections.map(connection => (
            <Grid key={connection.id} xs={12} sm={6} md={4} lg={3} item>
              <Card>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    {connection.url}
                  </Typography>
                  {renderStatus(connection)}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<EditOutlined />}
                    onClick={() => onEditConnection(connection)}
                  >
                    Edit
                  </Button>
                  <Button size="small" startIcon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </List>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{ marginTop: '2rem' }}
      >
        <Grid key="new-connection" xs={12} sm={6} md={4} lg={3} item>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddOutlined />}
            onClick={() => onEditConnection({} as Connection)}
          >
            New Connection
          </Button>
        </Grid>
      </Grid>
      <Dialog aria-labelledby="edit-connection" open={dialogOpen}>
        <EditConnection connection={connectionToEdit} onClose={onDialogClose} />
      </Dialog>
    </>
  );
}
