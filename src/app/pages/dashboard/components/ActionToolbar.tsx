import React, { useEffect, useState } from 'react';

import { makeStyles, MenuItem, Select } from '@material-ui/core';
import LoadingButton from 'app/components/LoadingButton';
import { channelsActions } from 'app/features/channels/slice';
import { channelStateSelector } from 'app/features/channels/slice/selectors';
import { CHANNEL_ACTIONS } from 'app/features/channels/slice/types';
import { useAppDispatch, useAppSelector } from 'store/hooks';

export default function ActionToolbar(props: { selectedRows; displayData }) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const channelState = useAppSelector(channelStateSelector);
  const { selectedRows, displayData } = props;
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
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
    setSelectedChannels(channelIdList);
    localStorage.setItem('channelSelectedForAction', '' + channelIdList.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRows, displayData, dispatch]);

  const onSelectedActionChange = event => {
    const action = event.target.value as string;
    setSelectedAction(action);
  };

  const onSubmit = () => {
    dispatch(
      channelsActions.applyAction({
        channelIdList: selectedChannels,
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
        loading={channelState?.loading || false}
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
