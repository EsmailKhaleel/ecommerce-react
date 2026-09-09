import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import {
  Grid, Card, CardContent, CardHeader, Typography, Box, Table, TableBody,
  TableCell, TableHead, TableRow, Avatar, Button, Divider, Stack, LinearProgress,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

import { getDashboardStats, getProductAnalytics, getLowStock } from '../../services/adminService';
import PageHeader from '../../features/admin/components/PageHeader';
import StatCard from '../../features/admin/components/StatCard';
import StatusChip from '../../features/admin/components/StatusChip';
import { ErrorState, EmptyState } from '../../features/admin/components/StateBlocks';
import { currency, compactCurrency, number, dateTime, shortId } from '../../features/admin/utils/format';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminDashboard() {
  const dashboard = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => getDashboardStats(),
  });

  const productStats = useQuery({
    queryKey: ['admin', 'analytics', 'products'],
    queryFn: () => getProductAnalytics(),
  });

  const lowStock = useQuery({
    queryKey: ['admin', 'inventory', 'low-stock'],
    queryFn: getLowStock,
  });

  if (dashboard.isError) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <ErrorState error={dashboard.error} onRetry={dashboard.refetch} />
      </>
    );
  }

  const overview = dashboard.data?.overview || {};
  const recentOrders = dashboard.data?.recentOrders || [];
  const statusStats = dashboard.data?.orderStatusStats || {};
  const revenueByMonth = dashboard.data?.revenueByMonth || [];
  const topProducts = dashboard.data?.topProducts || [];
  const categoryPerformance = productStats.data?.categoryPerformance || [];
  const loading = dashboard.isLoading;

  const statusEntries = Object.entries(statusStats).filter(([, count]) => count > 0);

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Store performance at a glance"
        action={
          <Button component={RouterLink} to="/admin/orders" variant="contained">
            View all orders
          </Button>
        }
      />

      {/* Headline metrics */}
      <Grid container spacing={2.5} sx={{ mb: 1 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Total revenue"
            value={currency(overview.totalRevenue)}
            caption="Paid orders only"
            icon={<PaymentsOutlinedIcon />}
            color="success"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Orders"
            value={number(overview.totalOrders)}
            caption={`Avg ${currency(overview.averageOrderValue)}`}
            icon={<ShoppingBagOutlinedIcon />}
            color="primary"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Customers"
            value={number(overview.totalCustomers)}
            icon={<PeopleOutlinedIcon />}
            color="secondary"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Products"
            value={number(overview.totalProducts)}
            caption={
              lowStock.data?.length
                ? `${lowStock.data.length} need restocking`
                : 'Stock levels healthy'
            }
            icon={<Inventory2OutlinedIcon />}
            color="warning"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        {/* Revenue trend */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Revenue by month"
              slotProps={{ title: { variant: 'h6' } }}
              subheader="Paid orders, grouped by month"
            />
            <Divider />
            <CardContent>
              {loading ? (
                <LinearProgress />
              ) : revenueByMonth.length === 0 ? (
                <EmptyState
                  message="No revenue recorded yet"
                  hint="Monthly revenue appears here once orders are paid."
                />
              ) : (
                <BarChart
                  height={300}
                  xAxis={[{
                    scaleType: 'band',
                    data: revenueByMonth.map((entry) => {
                      const month = entry?._id?.month;
                      const year = entry?._id?.year;
                      return month ? `${MONTHS[month - 1]} ${year ?? ''}`.trim() : 'Unknown';
                    }),
                  }]}
                  yAxis={[{ valueFormatter: (value) => compactCurrency(value) }]}
                  series={[{
                    data: revenueByMonth.map((entry) => entry.revenue ?? 0),
                    label: 'Revenue',
                    valueFormatter: (value) => currency(value),
                  }]}
                  margin={{ left: 70 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Order status split */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Orders by status" slotProps={{ title: { variant: 'h6' } }} />
            <Divider />
            <CardContent>
              {loading ? (
                <LinearProgress />
              ) : statusEntries.length === 0 ? (
                <EmptyState message="No orders yet" />
              ) : (
                <PieChart
                  height={280}
                  series={[{
                    data: statusEntries.map(([status, count], index) => ({
                      id: index,
                      value: count,
                      label: status.charAt(0).toUpperCase() + status.slice(1),
                    })),
                    innerRadius: 55,
                    paddingAngle: 2,
                    cornerRadius: 4,
                  }]}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent orders */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card>
            <CardHeader
              title="Recent orders"
              slotProps={{ title: { variant: 'h6' } }}
              action={
                <Button size="small" component={RouterLink} to="/admin/orders">
                  See all
                </Button>
              }
            />
            <Divider />
            {recentOrders.length === 0 && !loading ? (
              <EmptyState message="No orders yet" />
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Placed</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order._id} hover>
                        <TableCell>{shortId(order._id)}</TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap>
                            {/* userId is populated for admin views, but fall back
                                to the stored email if the account was removed */}
                            {order.userId?.name || order.customerEmail || 'Unknown'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {dateTime(order.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{currency(order.totalAmount)}</TableCell>
                        <TableCell><StatusChip status={order.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Top products */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Best sellers" slotProps={{ title: { variant: 'h6' } }} />
            <Divider />
            {topProducts.length === 0 && !loading ? (
              <EmptyState message="No sales recorded yet" />
            ) : (
              <CardContent>
                <Stack spacing={2}>
                  {topProducts.slice(0, 6).map((product) => (
                    <Stack key={product.productId} direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        variant="rounded"
                        src={product.productImage}
                        alt={product.productName}
                        sx={{ width: 42, height: 42 }}
                      />
                      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                        <Typography variant="body2" noWrap title={product.productName}>
                          {product.productName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {number(product.totalSold)} sold
                        </Typography>
                      </Box>
                      <Typography variant="subtitle2">
                        {currency(product.totalRevenue)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            )}
          </Card>
        </Grid>

        {/* Category performance */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card>
            <CardHeader title="Revenue by category" slotProps={{ title: { variant: 'h6' } }} />
            <Divider />
            <CardContent>
              {productStats.isLoading ? (
                <LinearProgress />
              ) : categoryPerformance.length === 0 ? (
                <EmptyState message="No category sales yet" />
              ) : (
                <BarChart
                  height={280}
                  layout="horizontal"
                  yAxis={[{
                    scaleType: 'band',
                    data: categoryPerformance.map((c) => c._id || 'Uncategorised'),
                  }]}
                  xAxis={[{ valueFormatter: (value) => compactCurrency(value) }]}
                  series={[{
                    data: categoryPerformance.map((c) => c.totalRevenue ?? 0),
                    label: 'Revenue',
                    valueFormatter: (value) => currency(value),
                    color: '#0EA5E9',
                  }]}
                  margin={{ left: 90 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Low stock alerts */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Low stock"
              slotProps={{ title: { variant: 'h6' } }}
              action={
                <Button size="small" component={RouterLink} to="/admin/inventory">
                  Manage
                </Button>
              }
            />
            <Divider />
            {lowStock.isError ? (
              <Box sx={{ p: 2 }}>
                <ErrorState error={lowStock.error} onRetry={lowStock.refetch} />
              </Box>
            ) : (lowStock.data?.length ?? 0) === 0 ? (
              <EmptyState
                message="All items above reorder point"
                icon={<Inventory2OutlinedIcon sx={{ fontSize: 44, mb: 1, opacity: 0.5 }} />}
              />
            ) : (
              <CardContent>
                <Stack spacing={1.5}>
                  {lowStock.data.slice(0, 6).map((item) => (
                    <Stack key={item._id} direction="row" spacing={1.5} alignItems="center">
                      <WarningAmberOutlinedIcon color="warning" />
                      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                        <Typography variant="body2" noWrap>
                          {item.productId?.name || item.sku}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {number(item.currentStock)} left / reorder at {number(item.reorderPoint)}
                        </Typography>
                      </Box>
                      <StatusChip status={item.status} />
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
