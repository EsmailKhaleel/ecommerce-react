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
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import { useAuth } from '../../Context/useAuth';
import buildAdminTheme from './theme/adminTheme';
import useColorScheme from './theme/useColorScheme';

const DRAWER_WIDTH = 248;

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin', icon: <DashboardOutlinedIcon />, end: true, roles: ['owner', 'admin'] },
  { label: 'Products', to: '/admin/products', icon: <Inventory2OutlinedIcon />, roles: ['owner', 'admin'] },
  { label: 'Orders', to: '/admin/orders', icon: <ShoppingBagOutlinedIcon />, roles: ['owner', 'admin', 'support', 'fulfillment', 'finance'] },
  { label: 'Invoices', to: '/admin/invoices', icon: <ReceiptLongOutlinedIcon />, roles: ['owner', 'admin', 'finance', 'support'] },
  { label: 'Operations', to: '/admin/operations', icon: <LocalShippingOutlinedIcon />, roles: ['owner', 'admin', 'support', 'fulfillment', 'inventory', 'finance'] },
  { label: 'Procurement', to: '/admin/procurement', icon: <LocalMallOutlinedIcon />, roles: ['owner', 'admin', 'inventory'] },
  { label: 'Merchandising', to: '/admin/merchandising', icon: <CategoryOutlinedIcon />, roles: ['owner', 'admin'] },
  { label: 'Platform', to: '/admin/platform', icon: <HubOutlinedIcon />, roles: ['owner', 'admin'] },
  { label: 'Growth', to: '/admin/growth', icon: <CampaignOutlinedIcon />, roles: ['owner', 'admin'] },
  { label: 'Customers', to: '/admin/customers', icon: <PeopleOutlinedIcon />, roles: ['owner', 'admin'] },
  { label: 'Inventory', to: '/admin/inventory', icon: <WarehouseOutlinedIcon />, roles: ['owner', 'admin', 'inventory'] },
  { label: 'Coupons', to: '/admin/coupons', icon: <LocalOfferOutlinedIcon />, roles: ['owner', 'admin'] },
  { label: 'Reviews', to: '/admin/reviews', icon: <ReviewsOutlinedIcon />, roles: ['owner', 'admin'] },
  { label: 'Analytics', to: '/admin/analytics', icon: <InsightsOutlinedIcon />, roles: ['owner', 'admin', 'finance'] },
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
          S
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>ShopSphere</Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            Control room
          </Typography>
        </Box>
      </Toolbar>

      <Divider />

      <List sx={{ px: 1, py: 1.5, flexGrow: 1 }}>
        {NAV_ITEMS.filter(item => item.roles.includes(user?.role)).map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              color: 'rgba(255,246,229,.76)',
              '& .MuiListItemIcon-root': { color: 'rgba(255,246,229,.56)' },
              '&:hover': { bgcolor: 'rgba(255,166,115,.12)', color: '#FFF6E5' },
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
        <ListItemButton component={RouterLink} to="/" sx={{ borderRadius: 2, color: 'rgba(255,246,229,.76)', '& .MuiListItemIcon-root': { color: 'secondary.main' }, '&:hover': { bgcolor: 'rgba(255,166,115,.12)', color: '#FFF6E5' } }}>
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
            backdropFilter: 'blur(18px)',
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

            <Chip label={user?.role || 'Staff'} color="primary" size="small" sx={{ fontWeight: 700, textTransform: 'capitalize' }} />

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
              bgcolor: '#171411',
              color: '#FFF6E5',
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
            background: mode === 'dark'
              ? 'linear-gradient(145deg, #11110F 0%, #211811 100%)'
              : 'linear-gradient(145deg, #FFF6E5 0%, #FFFCF6 58%, #FFE3BB 145%)',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
