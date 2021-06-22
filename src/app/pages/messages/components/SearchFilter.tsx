import React, { useEffect } from 'react';

import DateFnsUtils from '@date-io/date-fns';
import {
  makeStyles,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import LoadingButton from 'app/components/LoadingButton';
import { channelsActions } from 'app/features/channels/slice';
import {
  channelsByConnectionSelector,
  channelStateSelector,
} from 'app/features/channels/slice/selectors';
import { Channel } from 'app/features/channels/slice/types';
import { activeConnectionSelector } from 'app/features/connections/slice/selectors';
import { Connection } from 'app/features/connections/slice/types';
import { initialState, messageActions } from 'app/features/messages/slice';
import { messagesSelector } from 'app/features/messages/slice/selectors';
import {
  MessageSearchParams,
  MessageState,
} from 'app/features/messages/slice/types';
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from 'store/hooks';

export default function SearchFilter() {
  const classes = useStyles();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useAppDispatch();
  const activeConnections: Connection[] = useAppSelector(
    activeConnectionSelector,
  );
  const messageState: MessageState =
    useAppSelector<MessageState>(messagesSelector);

  const channelState = useAppSelector(channelStateSelector);
  const placeholderConnection: Connection = {
    id: '--Select Connection--',
    url: '--Select Connection--',
    username: '',
  };
  const selectedConnection = messageState?.searchParams?.selectedConnection;
  const filteredChannels = useAppSelector(
    channelsByConnectionSelector(selectedConnection?.id),
  );

  //load the channels during the first load
  useEffect(() => {
    dispatch(channelsActions.loadChannelsSilently(activeConnections));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConnections]);

  useEffect(() => {
    const filteredChannelsLength = filteredChannels?.length || 0;
    if (selectedConnection && filteredChannelsLength < 1) {
      dispatch(channelsActions.loadChannels([selectedConnection]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConnection]);

  const onSelectedConnectionChange = event => {
    const connectionFromSelect = event.target.value as Connection;
    if (connectionFromSelect?.id !== placeholderConnection.id) {
      dispatch(messageActions.setSelectedConnection(connectionFromSelect));
    }
  };

  const isSelectedChannel = option => {
    const selectedChannels = formik.values.selectedChannels || [];
    const isSelected = selectedChannels.some(
      channel => channel.id === option.id,
    );
    return isSelected;
  };
  const formik = useFormik({
    initialValues: initialState.searchParams,
    onSubmit: (values: MessageSearchParams) => {
      const searchParams = Object.assign({}, values, {
        selectedConnection: selectedConnection,
      });
      dispatch(messageActions.setMessageSearchParams(searchParams));
    },
  });

  const connectionOptions = [placeholderConnection].concat(
    activeConnections || [],
  );

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <form onSubmit={formik.handleSubmit}>
        <Grid item xs={10} md={8}>
          <FormControl style={{ width: '100%' }}>
            <InputLabel id="select-connection-label">Connection</InputLabel>
            <Select
              labelId="select-connection-label"
              id="selected-connection"
              value={selectedConnection || placeholderConnection}
              onChange={onSelectedConnectionChange}
            >
              {connectionOptions.map(connection => (
                //@ts-ignore
                <MenuItem key={connection.id} value={connection}>
                  {connection.url}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={10} md={8}>
          <Autocomplete
            multiple
            id="selectedChannels"
            options={filteredChannels}
            getOptionSelected={(option, value) => isSelectedChannel(option)}
            getOptionLabel={option => option.name || ''}
            onChange={(event: any, selectedChannels: Channel[]) => {
              formik.setFieldValue('selectedChannels', selectedChannels);
            }}
            filterSelectedOptions
            renderInput={params => (
              <TextField
                {...params}
                label="Channel"
                placeholder="Channel to search"
              />
            )}
          />
        </Grid>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={8}>
            <TextField
              fullWidth
              id="textSearch"
              name="textSearch"
              label="Search "
              value={formik.values.textSearch}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} md={2} style={{ paddingTop: '1.5rem' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.textSearchRegex}
                  onChange={formik.handleChange}
                  id="textSearchRegex"
                  name="textSearchRegex"
                  color="primary"
                />
              }
              label="Regex"
            />
          </Grid>
        </Grid>
        <Grid container direction="row" spacing={isSmall ? 2 : 8}>
          <Grid item>
            <KeyboardDateTimePicker
              id="startDate"
              name="startDate"
              variant="inline"
              label="Start Date"
              value={formik.values.startDate}
              onChange={(date: Date | null) => {
                formik.setFieldValue('startDate', date);
              }}
              format="yyyy/MM/dd HH:mm"
            />
          </Grid>
          <Grid item>
            <KeyboardDateTimePicker
              id="endDate"
              name="endDate"
              variant="inline"
              label="End Date"
              value={formik.values.endDate}
              onChange={(date: Date | null) => {
                formik.setFieldValue('endDate', date);
              }}
              format="yyyy/MM/dd HH:mm"
            />
          </Grid>
          <Grid item>
            <LoadingButton
              loading={messageState.loading}
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Search
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
      <Backdrop className={classes.backdrop} open={channelState.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </MuiPickersUtilsProvider>
  );
}

const useStyles = makeStyles(theme => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1.5, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));
