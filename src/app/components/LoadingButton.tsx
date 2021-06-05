import React from 'react';

import { Button, CircularProgress, withStyles } from '@material-ui/core';
import clsx from 'clsx';

const LoadingButton = props => {
  const {
    children,
    classes,
    className,
    loading = false,
    disabled = false,
    ...other
  } = props;

  return (
    <Button
      variant="contained"
      disabled={disabled || loading}
      className={clsx(className)}
      {...other}
    >
      {children}
      {loading && (
        <CircularProgress
          size={20}
          className={classes.circularProgress}
          color="inherit"
        />
      )}
    </Button>
  );
};

const styles = theme => ({
  circularProgress: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
});

export default withStyles(styles)(LoadingButton);
