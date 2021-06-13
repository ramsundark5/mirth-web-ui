import React, { useEffect, useState } from 'react';

import { makeStyles, MenuItem, Select } from '@material-ui/core';
import LoadingButton from 'app/components/LoadingButton';
import { channelsActions } from 'app/features/channels/slice';
import { channelsSelectedForActionSelector } from 'app/features/channels/slice/selectors';
import { useAppDispatch, useAppSelector } from 'store/hooks';

export enum CHANNEL_ACTIONS {
  START = 'START',
  STOP = 'STOP',
  HALT = 'HALT',
  PAUSE = 'PAUSE',
  RESUME = 'RESUME',
}

export default function ActionToolbar(props: { selectedRows; displayData }) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { selectedRows, displayData } = props;
  const channelsSelectedForAction = useAppSelector(
    channelsSelectedForActionSelector,
  );
  const [selectedAction, setSelectedAction] = useState<string>(
    CHANNEL_ACTIONS.START.toString(),
  );

  useEffect(() => {
    let channelIdList: string[] = [];
    const selectedRowsData = selectedRows?.data || [];
    for (let selectedRowData of selectedRowsData) {
      const channelData = displayData[selectedRowData.index];
      const channelId = channelData?.data?.[7];
      channelIdList.push(channelId);
    }
    dispatch(channelsActions.setChannelsSelectedForAction(channelIdList));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRows, displayData, dispatch]);

  const onSelectedActionChange = event => {
    const action = event.target.value as string;
    setSelectedAction(action);
  };

  const onSubmit = () => {
    dispatch(
      channelsActions.applyAction({
        channelIdList: channelsSelectedForAction,
        action: selectedAction,
      }),
    );
  };

  return (
    <div className={classes.container}>
      <Select
        labelId="select-action-label"
        id="selected-action"
        value={selectedAction}
        onChange={onSelectedActionChange}
        className={classes.select}
      >
        {Object.values(CHANNEL_ACTIONS).map(option => (
          //@ts-ignore
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      <LoadingButton
        onClick={onSubmit}
        type="submit"
        variant="contained"
        color="primary"
      >
        Submit
      </LoadingButton>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    marginRight: '24px',
  },
  select: {
    marginRight: '24px',
  },
}));
