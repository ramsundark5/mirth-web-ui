import React, { useEffect } from 'react';

import { notificationsActions } from 'app/features/notifications/slice';
import { notificationEntitySelector } from 'app/features/notifications/slice/selectors';
import { Notification } from 'app/features/notifications/slice/types';
import { useSnackbar } from 'notistack';
import { useAppDispatch, useAppSelector } from 'store/hooks';

let displayed: string[] = [];

const SnackBar = () => {
  const dispatch = useAppDispatch();
  const notifications: Notification[] = useAppSelector(
    notificationEntitySelector.selectAll,
  );
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = id => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = id => {
    displayed = [...displayed.filter(key => id !== key)];
  };

  useEffect(() => {
    notifications.forEach(({ id, message, options, dismissed = false }) => {
      if (dismissed) {
        // dismiss snackbar using notistack
        closeSnackbar(id);
        return;
      }

      // do nothing if snackbar is already displayed
      if (displayed.includes(id)) return;
      if (!options) {
        options = {};
      }
      // display snackbar using notistack
      enqueueSnackbar(message, {
        id,
        ...options,
        onClose: (event, reason, id) => {
          if (options?.onClose) {
            options.onClose(event, reason, id);
          }
        },
        onExited: (event, id) => {
          // remove this snackbar from redux store
          dispatch(notificationsActions.removeNotification(id));
          removeDisplayed(id);
        },
      });

      // keep track of snackbars that we've displayed
      storeDisplayed(id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

  return null;
};

export default SnackBar;
