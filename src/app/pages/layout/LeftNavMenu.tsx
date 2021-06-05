import React from 'react';

import {
  MenuList,
  MenuItem,
  ListItemIcon,
  Typography,
} from '@material-ui/core';
import { NavLink, withRouter } from 'react-router-dom';

import Routes from './Routes';

const LeftNavMenu: React.FC = (props: any) => {
  const activeRoute = (routeName: any) => {
    return props.location.pathname === routeName ? true : false;
  };
  return (
    <MenuList>
      {Routes.map((prop, key) => {
        return (
          <MenuItem
            key={prop.path}
            selected={activeRoute(prop.path)}
            button
            component={NavLink}
            to={prop.path}
          >
            <ListItemIcon>
              <prop.icon />
            </ListItemIcon>
            <Typography color="inherit" noWrap>
              {prop.sidebarName}
            </Typography>
          </MenuItem>
        );
      })}
    </MenuList>
  );
};
export default withRouter(LeftNavMenu);
