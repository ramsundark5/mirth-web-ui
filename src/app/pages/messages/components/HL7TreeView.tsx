import React from 'react';

import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import { ExpandMore, ChevronRight } from '@material-ui/icons';
import { TreeView, TreeItem } from '@material-ui/lab';
import { Segment, Field, parse } from 'utils/hl7parser';

function HL7TreeView(props: { messageContent }) {
  const { messageContent } = props;
  const classes = useStyles();

  const segmentList: Segment[] = messageContent ? parse(messageContent) : [];

  const renderFields = (fields: Field[] = []) => {
    return fields.map(field => (
      <TreeItem
        key={field.uid}
        nodeId={field.uid}
        label={renderLabel(field.name, field.value, field.description)}
      >
        {field?.components?.map(component => (
          <TreeItem
            key={component.uid}
            nodeId={component.uid}
            label={renderLabel(
              component.name,
              component.value,
              component.description,
            )}
          />
        ))}
      </TreeItem>
    ));
  };

  const renderLabel = (name, value, description) => (
    <div className={classes.fieldRoot}>
      <Typography className={classes.fieldName}>{name}</Typography>
      <Typography className={classes.fieldValue}>{value}</Typography>
      <Typography className={classes.fieldDescription}>
        {description}
      </Typography>
    </div>
  );

  const renderHeader = (name, value, description) => (
    <div className={classes.fieldRoot}>
      <Typography variant="h6" className={classes.headerName}>
        {name}
      </Typography>
      <Typography variant="h6" className={classes.fieldValue}>
        {value}
      </Typography>
      <Typography variant="h6" className={classes.fieldDescription}>
        {description}
      </Typography>
    </div>
  );
  return (
    <>
      {renderHeader('Name', 'Value', 'Description')}
      <TreeView
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ChevronRight />}
        multiSelect
      >
        {segmentList.map(segment => (
          <TreeItem
            key={segment.uid}
            nodeId={segment.uid}
            label={renderLabel(
              segment.name,
              segment.value,
              segment.description,
            )}
          >
            {renderFields(segment?.fields)}
          </TreeItem>
        ))}
      </TreeView>
    </>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 600,
    },
    fieldRoot: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0.5, 0),
    },
    fieldName: {
      paddingRight: '10rem',
    },
    fieldValue: {
      fontWeight: 'inherit',
      flexGrow: 1,
    },
    fieldDescription: {
      paddingRight: '2rem',
    },
    headerName: {
      paddingRight: '10rem',
      paddingLeft: '1.5rem',
    },
  }),
);
export default HL7TreeView;
