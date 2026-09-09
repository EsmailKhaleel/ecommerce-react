import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Grid, Card, CardHeader, CardContent, Divider, TextField, MenuItem, Stack, Button,
  Typography, Table, TableHead, TableBody, TableRow, TableCell, LinearProgress, Box,
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';

import {
  getSalesAnalytics, getCustomerAnalytics, getProductAnalytics, downloadReport,
} from '../../services/adminService';
import PageHeader from '../../features/admin/components/PageHeader';
import StatCard from '../../features/admin/components/StatCard';
import { EmptyState, ErrorState } from '../../features/admin/components/StateBlocks';
import { currency, compactCurrency, number } from '../../features/admin/utils/format';

const GROUP_OPTIONS = [
  { value: 'day', label: 'Daily' },
  { value: 'month', label: 'Monthly' },
  { value: 'year', label: 'Yearly' },
];

// salesData._id is { year, month?, day? } depending on groupBy
const formatBucket = (id, groupBy) => {
  if (!id) return 'Unknown';
  if (groupBy === 'year') return String(id.year);
  if (groupBy === 'month') return `${String(id.month).padStart(2, '0')}/${id.year}`;
  return `${String(id.day).padStart(2, '0')}/${String(id.month).padStart(2, '0')}`;
};

export default function AdminAnalytics() {
  const [groupBy, setGroupBy] = useState('day');

  const sales = useQuery({
    queryKey: ['admin', 'analytics', 'sales', groupBy],
    queryFn: () => getSalesAnalytics({ groupBy }),
  });

  const customers = useQuery({
    queryKey: ['admin', 'analytics', 'customers'],
    queryFn: () => getCustomerAnalytics(),
  });

  const products = useQuery({
    queryKey: ['admin', 'analytics', 'products'],
    queryFn: () => getProductAnalytics(),
  });

  const salesData = sales.data?.salesData || [];
  const effectiveGroupBy = sales.data?.groupBy || groupBy;
  const labels = salesData.map((entry) => formatBucket(entry._id, effectiveGroupBy));

  const topCustomers = customers.data?.topCustomers || [];
  const productPerformance = products.data?.productPerformance || [];

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Sales, customer and product performance"
        action={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined" startIcon={<DownloadOutlinedIcon />}
              onClick={() => downloadReport('/reports/products/csv', 'products.csv')}
            >
              Products CSV
            </Button>
            <Button
              variant="outlined" startIcon={<PictureAsPdfOutlinedIcon />}
              onClick={() => downloadReport('/reports/sales/pdf', 'sales-report.pdf')}
            >
              Sales PDF
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={2.5}>
        {/* Customer metrics */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="New customers"
            value={number(customers.data?.newCustomers)}
            loading={customers.isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="Avg lifetime value"
            value={currency(customers.data?.averageLifetimeValue)}
            loading={customers.isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="Avg orders / customer"
            value={(customers.data?.averageOrdersPerCustomer ?? 0).toFixed(1)}
            loading={customers.isLoading}
          />
        </Grid>

        {/* Sales trend */}
        <Grid size={12}>
          <Card>
            <CardHeader
              title="Sales over time"
              slotProps={{ title: { variant: 'h6' } }}
              action={
                <TextField
                  select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}
                  sx={{ minWidth: 140 }}
                >
                  {GROUP_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </TextField>
              }
            />
            <Divider />
            <CardContent>
              {sales.isLoading ? (
                <LinearProgress />
              ) : sales.isError ? (
                <ErrorState error={sales.error} onRetry={sales.refetch} />
              ) : salesData.length === 0 ? (
                <EmptyState message="No sales in this period" />
              ) : (
                <LineChart
                  height={320}
                  xAxis={[{ scaleType: 'point', data: labels }]}
                  yAxis={[
                    { id: 'money', valueFormatter: (value) => compactCurrency(value) },
                    { id: 'count', position: 'right' },
                  ]}
                  series={[
                    {
                      data: salesData.map((entry) => entry.revenue ?? 0),
                      label: 'Revenue',
                      yAxisId: 'money',
                      valueFormatter: (value) => currency(value),
                      area: true,
                      showMark: salesData.length < 40,
                    },
                    {
                      data: salesData.map((entry) => entry.orders ?? 0),
                      label: 'Orders',
                      yAxisId: 'count',
                      color: '#0EA5E9',
                      showMark: salesData.length < 40,
                    },
                  ]}
                  margin={{ left: 70, right: 60 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Product revenue */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Top products by revenue" slotProps={{ title: { variant: 'h6' } }} />
            <Divider />
            <CardContent>
              {products.isLoading ? (
                <LinearProgress />
              ) : products.isError ? (
                <ErrorState error={products.error} onRetry={products.refetch} />
              ) : productPerformance.length === 0 ? (
                <EmptyState message="No product sales yet" />
              ) : (
                <BarChart
                  height={340}
                  layout="horizontal"
                  yAxis={[{
                    scaleType: 'band',
                    data: productPerformance.slice(0, 8).map((p) => p.productName || 'Unknown'),
                    width: 150,
                  }]}
                  xAxis={[{ valueFormatter: (value) => compactCurrency(value) }]}
                  series={[{
                    data: productPerformance.slice(0, 8).map((p) => p.totalRevenue ?? 0),
                    label: 'Revenue',
                    valueFormatter: (value) => currency(value),
                  }]}
                  margin={{ left: 160 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top customers */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Top customers" slotProps={{ title: { variant: 'h6' } }} />
            <Divider />
            {customers.isLoading ? (
              <CardContent><LinearProgress /></CardContent>
            ) : topCustomers.length === 0 ? (
              <EmptyState message="No paid orders yet" />
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell align="center">Orders</TableCell>
                      <TableCell align="right">Spent</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topCustomers.map((customer) => (
                      <TableRow key={customer.userId} hover>
                        <TableCell>
                          <Typography variant="body2" noWrap>
                            {customer.customerName || 'Deleted account'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {customer.customerEmail}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{number(customer.orderCount)}</TableCell>
                        <TableCell align="right">{currency(customer.totalSpent)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
