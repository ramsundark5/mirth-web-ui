import React, { useState } from 'react';
import { useEffect } from 'react';

import { Card, Grid, makeStyles, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import LoadingButton from 'app/components/LoadingButton';
import APIConstants from 'app/constants/APIConstants';
import { channelsActions } from 'app/features/channels/slice';
import { channelStateSelector } from 'app/features/channels/slice/selectors';
import { connectionEntitySelector } from 'app/features/connections/slice/selectors';
import { Connection } from 'app/features/connections/slice/types';
import { useAppDispatch, useAppSelector } from 'store/hooks';

export default function ConnectionSelector() {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const connections: Connection[] = useAppSelector(
    connectionEntitySelector.selectAll,
  );
  const activeConnections = connections.filter(
    connection => connection.isConnected,
  );
  const channelState = useAppSelector(channelStateSelector);
  const [selectedConnections, setSelectedConnections] = useState<Connection[]>(
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(channelsActions.loadChannelsSilently(selectedConnections));
    }, APIConstants.DASHBOARD_RELOAD_INTERVAL);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConnections]);

  const onSubmit = () => {
    dispatch(channelsActions.setSelectedConnections(selectedConnections));
    dispatch(channelsActions.loadChannels(selectedConnections));
  };

  return (
    <Card>
      <Grid container direction="row" spacing={2} className={classes.searchBar}>
        <Grid item xs={10} md={7}>
          <Autocomplete
            multiple
            id="selectedConnections"
            options={activeConnections}
            getOptionLabel={option => option.url || ''}
            onChange={(event: any, selectedConnectionValues: Connection[]) => {
              setSelectedConnections(selectedConnectionValues);
            }}
            filterSelectedOptions
            renderInput={params => <TextField {...params} label="Connection" />}
          />
        </Grid>
        <Grid item xs={4} md={5}>
          <LoadingButton
            loading={channelState.loading}
            onClick={onSubmit}
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </LoadingButton>
        </Grid>
      </Grid>
    </Card>
  );
}

const useStyles = makeStyles(theme => ({
  submit: {
    margin: theme.spacing(1.5, 0, 2),
  },
  searchBar: {
    marginLeft: '2rem',
  },
}));
