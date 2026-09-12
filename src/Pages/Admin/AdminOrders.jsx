import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Card, Stack, TextField, MenuItem, Button, Typography, Box, Drawer, Divider,
  IconButton, Table, TableBody, TableCell, TableHead, TableRow, Avatar, Chip,
  Alert, Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { toast } from 'react-toastify';

import {
  getAllOrders, getOrderById, updateOrderStatus, downloadReport, processRefund, createShipment,
} from '../../services/adminService';
import { downloadInvoice } from '../../services/invoiceService';
import PageHeader from '../../features/admin/components/PageHeader';
import ServerDataGrid from '../../features/admin/components/ServerDataGrid';
import StatusChip from '../../features/admin/components/StatusChip';
import { LoadingState, ErrorState } from '../../features/admin/components/StateBlocks';
import { currency, dateTime, shortId, number } from '../../features/admin/utils/format';
import { useAuth } from '../../Context/useAuth';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['paid', 'unpaid', 'partially_refunded', 'refunded'];

export default function AdminOrders() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const [statusDraft, setStatusDraft] = useState('');
  const [trackingDraft, setTrackingDraft] = useState('');

  const ordersQuery = useQuery({
    queryKey: ['admin', 'orders', {
      page: paginationModel.page, pageSize: paginationModel.pageSize, status, paymentStatus,
    }],
    queryFn: () => getAllOrders({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      status: status || undefined,
      paymentStatus: paymentStatus || undefined,
    }),
    placeholderData: (previous) => previous,
  });

  const orderQuery = useQuery({
    queryKey: ['admin', 'order', selectedId],
    queryFn: () => getOrderById(selectedId),
    enabled: Boolean(selectedId),
  });

  const order = orderQuery.data;

  const statusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      toast.success('Order updated');
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', selectedId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      // Cancelling returns stock, so inventory views are now stale
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
    },
    onError: (error) => toast.error(error.message || 'Failed to update order'),
  });

  const refundMutation = useMutation({
    mutationFn: processRefund,
    onSuccess: () => {
      toast.success('Refund decision saved');
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', selectedId] });
    },
    onError: error => toast.error(error.message || 'Failed to process refund'),
  });
  const shipmentMutation = useMutation({
    mutationFn: createShipment,
    onSuccess: () => { toast.success('Shipment created'); queryClient.invalidateQueries({ queryKey: ['admin'] }); },
    onError: error => toast.error(error.message || 'Failed to create shipment'),
  });

  const openOrder = (id) => {
    setSelectedId(id);
    setStatusDraft('');
    setTrackingDraft('');
  };

  const columns = useMemo(() => [
    {
      field: '_id',
      headerName: 'Order',
      width: 110,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {shortId(params.value)}
        </Typography>
      ),
    },
    {
      field: 'customer',
      headerName: 'Customer',
      flex: 1.3,
      minWidth: 190,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" noWrap>
            {params.row.userId?.name || 'Unknown'}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {params.row.userId?.email || params.row.customerEmail}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'products',
      headerName: 'Items',
      width: 80,
      sortable: false,
      renderCell: (params) => number(params.value?.length || 0),
    },
    {
      field: 'totalAmount',
      headerName: 'Total',
      width: 110,
      renderCell: (params) => currency(params.value),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment',
      width: 120,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'createdAt',
      headerName: 'Placed',
      width: 170,
      renderCell: (params) => (
        <Typography variant="caption" color="text.secondary">
          {dateTime(params.value)}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <IconButton size="small" onClick={() => openOrder(params.row._id)}>
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
      ),
    },
  ], []);

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle="Track and fulfil customer orders"
        action={
          <Button
            variant="outlined"
            startIcon={<DownloadOutlinedIcon />}
            onClick={() => downloadReport('/reports/orders/csv', 'orders.csv')}
          >
            Export CSV
          </Button>
        }
      />

      <Card>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ p: 2 }}>
          <TextField
            select label="Status" value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPaginationModel((prev) => ({ ...prev, page: 0 }));
            }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All statuses</MenuItem>
            {ORDER_STATUSES.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select label="Payment" value={paymentStatus}
            onChange={(e) => {
              setPaymentStatus(e.target.value);
              setPaginationModel((prev) => ({ ...prev, page: 0 }));
            }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All payments</MenuItem>
            {PAYMENT_STATUSES.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <ServerDataGrid
          rows={ordersQuery.data?.items || []}
          columns={columns}
          rowCount={ordersQuery.data?.total || 0}
          loading={ordersQuery.isFetching}
          error={ordersQuery.isError ? ordersQuery.error : null}
          onRetry={ordersQuery.refetch}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          emptyMessage="No orders found"
          emptyHint={status || paymentStatus ? 'Try clearing the filters.' : 'Orders appear here once customers check out.'}
          onRowClick={(params) => openOrder(params.row._id)}
          sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
          rowHeight={58}
        />
      </Card>

      {/* Order detail */}
      <Drawer
        anchor="right"
        open={Boolean(selectedId)}
        onClose={() => setSelectedId(null)}
        slotProps={{ paper: { sx: { width: { xs: '100%', sm: 520 } } } }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
          <Typography variant="h6">Order {shortId(selectedId)}</Typography>
          <IconButton onClick={() => setSelectedId(null)}><CloseIcon /></IconButton>
        </Stack>
        <Divider />

        <Box sx={{ p: 2, overflowY: 'auto' }}>
          {orderQuery.isLoading ? (
            <LoadingState />
          ) : orderQuery.isError ? (
            <ErrorState error={orderQuery.error} onRetry={orderQuery.refetch} />
          ) : order ? (
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={1}>
                <StatusChip status={order.status} />
                <StatusChip status={order.paymentStatus} />
              </Stack>

              {order.refundRequested && (
                <Alert severity="warning">
                  <strong>Refund requested</strong>
                  {order.refundReason ? ` - ${order.refundReason}` : ''}
                  {order.refundStatus ? ` (${order.refundStatus})` : ''}
                </Alert>
              )}
              {order.refundStatus === 'pending' && ['owner', 'admin', 'finance'].includes(user?.role) && (
                <Stack direction="row" spacing={1}>
                  <Button color="success" variant="contained" disabled={refundMutation.isPending} onClick={() => refundMutation.mutate({ orderId: order._id, approve: true })}>Approve and refund</Button>
                  <Button color="error" variant="outlined" disabled={refundMutation.isPending} onClick={() => refundMutation.mutate({ orderId: order._id, approve: false })}>Reject</Button>
                </Stack>
              )}

              <Box>
                <Typography variant="subtitle2" gutterBottom>Customer</Typography>
                <Typography variant="body2">{order.userId?.name || 'Unknown'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.userId?.email || order.customerEmail}
                </Typography>
              </Box>

              {order.shippingAddress && Object.values(order.shippingAddress).some(Boolean) && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Shipping address</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {[
                      order.shippingAddress.street,
                      order.shippingAddress.city,
                      order.shippingAddress.state,
                      order.shippingAddress.postalCode,
                      order.shippingAddress.country,
                    ].filter(Boolean).join(', ') || 'Not provided'}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" gutterBottom>Items</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Qty</TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(order.products || []).map((item, index) => (
                      <TableRow key={item.productId?._id || item.productId || index}>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar
                              variant="rounded"
                              src={item.image || item.productId?.image}
                              sx={{ width: 32, height: 32 }}
                            />
                            <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                              {/* The order stores a name snapshot, so it survives
                                  the product later being renamed or deleted */}
                              {item.name || item.productId?.name || 'Removed product'}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">{currency(item.price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.5 }}>
                  <Typography variant="subtitle1">Total</Typography>
                  <Typography variant="subtitle1">{currency(order.totalAmount)}</Typography>
                </Stack>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Placed {dateTime(order.createdAt)}
                </Typography>
                {order.trackingNumber && (
                  <Box sx={{ mt: 1 }}>
                    <Chip size="small" label={`Tracking: ${order.trackingNumber}`} />
                  </Box>
                )}
              </Box>

              <Divider />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                {order.invoiceId && <Button variant="outlined" startIcon={<DownloadOutlinedIcon />} onClick={() => downloadInvoice(order.invoiceId, `invoice-${shortId(order._id)}`)}>Download invoice</Button>}
                {order.paymentStatus === 'paid' && ['owner', 'admin', 'fulfillment'].includes(user?.role) && !['cancelled', 'delivered'].includes(order.status) && <Button variant="outlined" disabled={shipmentMutation.isPending} onClick={() => {
                  const carrier = window.prompt('Carrier name'); if (!carrier?.trim()) return;
                  const trackingNumber = window.prompt('Tracking number (optional)') || undefined;
                  shipmentMutation.mutate({ orderId: order._id, carrier: carrier.trim(), trackingNumber });
                }}>Create shipment</Button>}
              </Stack>

              {['owner', 'admin', 'fulfillment'].includes(user?.role) && <Box>
                <Typography variant="subtitle2" gutterBottom>Update status</Typography>
                <Grid container spacing={1.5}>
                  <Grid size={12}>
                    <TextField
                      select fullWidth label="New status"
                      value={statusDraft || order.status}
                      onChange={(e) => setStatusDraft(e.target.value)}
                    >
                      {ORDER_STATUSES.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth label="Tracking number"
                      placeholder={order.trackingNumber || 'Optional'}
                      value={trackingDraft}
                      onChange={(e) => setTrackingDraft(e.target.value)}
                      helperText="Saved with the order for shipment tracking"
                    />
                  </Grid>
                  <Grid size={12}>
                    <Button
                      fullWidth variant="contained"
                      disabled={
                        statusMutation.isPending ||
                        ((statusDraft === '' || statusDraft === order.status) && !trackingDraft)
                      }
                      onClick={() => statusMutation.mutate({
                        orderId: order._id,
                        status: statusDraft || order.status,
                        trackingNumber: trackingDraft || undefined,
                      })}
                    >
                      {statusMutation.isPending ? 'Saving...' : 'Save changes'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>}
            </Stack>
          ) : null}
        </Box>
      </Drawer>
    </>
  );
}
