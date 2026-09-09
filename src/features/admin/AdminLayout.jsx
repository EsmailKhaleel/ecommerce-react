import { useMemo, useState } from 'react';
import { Outlet, NavLink, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  ThemeProvider, CssBaseline, Box, Drawer, AppBar, Toolbar, List, ListItemButton,
  ListItemIcon, ListItemText, Typography, IconButton, Divider, Avatar, Menu,
  MenuItem, Tooltip, Chip, useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import { useAuth } from '../../Context/useAuth';
import buildAdminTheme from './theme/adminTheme';
import useColorScheme from './theme/useColorScheme';

const DRAWER_WIDTH = 248;

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin', icon: <DashboardOutlinedIcon />, end: true },
  { label: 'Products', to: '/admin/products', icon: <Inventory2OutlinedIcon /> },
  { label: 'Orders', to: '/admin/orders', icon: <ShoppingBagOutlinedIcon /> },
  { label: 'Customers', to: '/admin/customers', icon: <PeopleOutlinedIcon /> },
  { label: 'Inventory', to: '/admin/inventory', icon: <WarehouseOutlinedIcon /> },
  { label: 'Coupons', to: '/admin/coupons', icon: <LocalOfferOutlinedIcon /> },
  { label: 'Reviews', to: '/admin/reviews', icon: <ReviewsOutlinedIcon /> },
  { label: 'Analytics', to: '/admin/analytics', icon: <InsightsOutlinedIcon /> },
];

export default function AdminLayout() {
  const mode = useColorScheme();
  const theme = useMemo(() => buildAdminTheme(mode), [mode]);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const currentTitle =
    NAV_ITEMS.find((item) =>
      item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
    )?.label || 'Admin';

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ gap: 1.5 }}>
        <Box
          sx={{
            width: 34, height: 34, borderRadius: 2, display: 'grid', placeItems: 'center',
            bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 800,
          }}
        >
          A
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>Admin Console</Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            Store management
          </Typography>
        </Box>
      </Toolbar>

      <Divider />

      <List sx={{ px: 1, py: 1.5, flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.active': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': { color: 'inherit' },
                '&:hover': { bgcolor: 'primary.dark' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 38 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} slotProps={{ primary: { fontSize: 14.5, fontWeight: 600 } }} />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      <List sx={{ px: 1, py: 1 }}>
        <ListItemButton component={RouterLink} to="/" sx={{ borderRadius: 2 }}>
          <ListItemIcon sx={{ minWidth: 38 }}><StorefrontOutlinedIcon /></ListItemIcon>
          <ListItemText primary="Back to store" slotProps={{ primary: { fontSize: 14.5 } }} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar
          position="fixed"
          color="inherit"
          elevation={0}
          sx={{
            width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
            ml: { lg: `${DRAWER_WIDTH}px` },
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Toolbar sx={{ gap: 1 }}>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { lg: 'none' } }}
              aria-label="Open navigation"
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" sx={{ flexGrow: 1 }}>{currentTitle}</Typography>

            <Chip label="Admin" color="primary" size="small" sx={{ fontWeight: 700 }} />

            <Tooltip title={user?.email || ''}>
              <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} aria-label="Account menu">
                <Avatar src={user?.image || undefined} sx={{ width: 34, height: 34 }}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem disabled sx={{ opacity: '1 !important' }}>
                <Box>
                  <Typography variant="subtitle2">{user?.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem component={RouterLink} to="/account" onClick={() => setMenuAnchor(null)}>
                My account
              </MenuItem>
              <MenuItem
                onClick={() => { setMenuAnchor(null); signOut(); }}
              >
                <ListItemIcon><LogoutOutlinedIcon fontSize="small" /></ListItemIcon>
                Sign out
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Drawer
          variant={isDesktop ? 'permanent' : 'temporary'}
          open={isDesktop || mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
            p: { xs: 2, md: 3 },
            pt: { xs: 10, md: 11 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
