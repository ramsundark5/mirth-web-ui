import {
  Dashboard,
  DesktopWindowsOutlined,
  SearchOutlined,
} from '@material-ui/icons';
import { ConnectionPage } from 'app/pages/connections';
import { DashboardPage } from 'app/pages/dashboard';
import { MessagesPage } from 'app/pages/messages';

const Routes = [
  {
    path: '/',
    icon: Dashboard,
    sidebarName: 'Dashboard',
    component: DashboardPage,
  },
  {
    path: '/messages',
    sidebarName: 'Search',
    icon: SearchOutlined,
    component: MessagesPage,
  },
  {
    path: '/connections',
    sidebarName: 'Connections',
    icon: DesktopWindowsOutlined,
    component: ConnectionPage,
  },
];

export default Routes;
