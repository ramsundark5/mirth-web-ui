import React from 'react';

import {
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import LoadingButton from 'app/components/LoadingButton';
import { connectionsActions } from 'app/features/connections/slice';
import { connectionStateSelector } from 'app/features/connections/slice/selectors';
import { Connection } from 'app/features/connections/slice/types';
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import * as yup from 'yup';

const validationSchema = yup.object({
  url: yup.string().required('URL is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export default function EditConnection(props: {
  connection: Connection;
  onClose;
}) {
  const { connection, onClose } = props;
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const connectionState = useAppSelector(connectionStateSelector);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      url: connection.url || 'https://localhost:8443',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      dispatch(
        connectionsActions.onLogin({
          url: values.url,
          username: values.username,
          password: values.password,
        }),
      );
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Connection
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="url"
            name="url"
            label="URL"
            value={formik.values.url}
            onChange={formik.handleChange}
            error={formik.touched.url && Boolean(formik.errors.url)}
            helperText={formik.touched.url && formik.errors.url}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="username"
            name="username"
            label="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Typography variant="subtitle1" className={classes.errorText}>
            {connectionState?.error?.message}
          </Typography>
          <LoadingButton
            loading={connectionState.loading}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.connectButton}
          >
            Connect
          </LoadingButton>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.cancelButton}
            onClick={onClose}
          >
            Cancel
          </Button>
        </form>
      </div>
    </Container>
  );
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  connectButton: {
    marginBottom: '0.5rem',
  },
  cancelButton: {
    marginBottom: '2.5rem',
  },
  errorText: {
    color: red[500],
  },
}));
