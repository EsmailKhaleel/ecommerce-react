import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Card, Stack, TextField, MenuItem, Tabs, Tab, Box, Typography, Avatar, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, InputAdornment, Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import { toast } from 'react-toastify';

import {
  getInventory, getLowStock, getStockMovements, adjustStock,
} from '../../services/adminService';
import PageHeader from '../../features/admin/components/PageHeader';
import ServerDataGrid from '../../features/admin/components/ServerDataGrid';
import StatusChip from '../../features/admin/components/StatusChip';
import { EmptyState, ErrorState, LoadingState } from '../../features/admin/components/StateBlocks';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { currency, number, dateTime } from '../../features/admin/utils/format';

const MOVEMENT_COLORS = {
  in: 'success', out: 'error', adjustment: 'info',
  return: 'warning', damage: 'error', transfer: 'default',
};

export default function AdminInventory() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [movementsPagination, setMovementsPagination] = useState({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);

  const [adjustTarget, setAdjustTarget] = useState(null);
  const [operation, setOperation] = useState('add');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('adjustment');
  const [notes, setNotes] = useState('');

  const inventoryQuery = useQuery({
    queryKey: ['admin', 'inventory', 'list', {
      page: paginationModel.page, pageSize: paginationModel.pageSize, search: debouncedSearch, status,
    }],
    queryFn: () => getInventory({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      search: debouncedSearch || undefined,
      status: status || undefined,
    }),
    enabled: tab === 0,
    placeholderData: (previous) => previous,
  });

  const lowStockQuery = useQuery({
    queryKey: ['admin', 'inventory', 'low-stock'],
    queryFn: getLowStock,
    enabled: tab === 1,
  });

  const movementsQuery = useQuery({
    queryKey: ['admin', 'inventory', 'movements', movementsPagination],
    queryFn: () => getStockMovements({
      page: movementsPagination.page + 1,
      limit: movementsPagination.pageSize,
    }),
    enabled: tab === 2,
    placeholderData: (previous) => previous,
  });

  const adjustMutation = useMutation({
    mutationFn: adjustStock,
    onSuccess: (result) => {
      toast.success(
        `Stock updated: ${number(result?.previousStock)} -> ${number(result?.newStock)}`
      );
      setAdjustTarget(null);
      setQuantity('');
      setNotes('');
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
    onError: (error) => toast.error(error.message || 'Failed to adjust stock'),
  });

  const openAdjust = (item) => {
    setAdjustTarget(item);
    setOperation('add');
    setQuantity('');
    setReason('adjustment');
    setNotes('');
  };

  const stockColumns = useMemo(() => [
    {
      field: 'productId',
      headerName: 'Product',
      flex: 1.6,
      minWidth: 220,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
          <Avatar variant="rounded" src={params.value?.image} sx={{ width: 36, height: 36 }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap>
              {/* Inventory can outlive its product, so never assume populate worked */}
              {params.value?.name || 'Unlinked product'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {params.row.sku}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    { field: 'currentStock', headerName: 'On hand', width: 100 },
    { field: 'reservedStock', headerName: 'Reserved', width: 100 },
    { field: 'availableStock', headerName: 'Available', width: 100 },
    { field: 'reorderPoint', headerName: 'Reorder at', width: 110 },
    {
      field: 'costPrice',
      headerName: 'Cost',
      width: 100,
      renderCell: (params) => (params.value ? currency(params.value) : '--'),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'actions',
      headerName: '',
      width: 120,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Button size="small" startIcon={<TuneIcon />} onClick={() => openAdjust(params.row)}>
          Adjust
        </Button>
      ),
    },
  ], []);

  const movementColumns = useMemo(() => [
    {
      field: 'createdAt',
      headerName: 'When',
      width: 170,
      renderCell: (params) => (
        <Typography variant="caption" color="text.secondary">{dateTime(params.value)}</Typography>
      ),
    },
    {
      field: 'productId',
      headerName: 'Product',
      flex: 1.4,
      minWidth: 190,
      sortable: false,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>{params.value?.name || 'Unlinked product'}</Typography>
      ),
    },
    {
      field: 'movementType',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value}
          color={MOVEMENT_COLORS[params.value] || 'default'}
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    { field: 'quantity', headerName: 'Qty', width: 80 },
    {
      field: 'previousStock',
      headerName: 'Change',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Typography variant="body2">
          {number(params.value)} to {number(params.row.newStock)}
        </Typography>
      ),
    },
    {
      field: 'reason',
      headerName: 'Reason',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
          {String(params.value || '').replace(/_/g, ' ')}
        </Typography>
      ),
    },
    {
      field: 'performedBy',
      headerName: 'By',
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Typography variant="caption" color="text.secondary" noWrap>
          {params.value?.name || 'System'}
        </Typography>
      ),
    },
  ], []);

  return (
    <>
      <PageHeader title="Inventory" subtitle="Stock levels and movement history" />

      <Card>
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Stock levels" />
          <Tab label="Low stock" />
          <Tab label="Movements" />
        </Tabs>

        {tab === 0 && (
          <>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ p: 2 }}>
              <TextField
                placeholder="Search product"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
                    ),
                  },
                }}
                sx={{ minWidth: 240 }}
              />
              <TextField
                select label="Status" value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="">All statuses</MenuItem>
                <MenuItem value="in_stock">In stock</MenuItem>
                <MenuItem value="low_stock">Low stock</MenuItem>
                <MenuItem value="out_of_stock">Out of stock</MenuItem>
                <MenuItem value="discontinued">Discontinued</MenuItem>
              </TextField>
            </Stack>

            <ServerDataGrid
              rows={inventoryQuery.data?.items || []}
              columns={stockColumns}
              rowCount={inventoryQuery.data?.total || 0}
              loading={inventoryQuery.isFetching}
              error={inventoryQuery.isError ? inventoryQuery.error : null}
              onRetry={inventoryQuery.refetch}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              emptyMessage="No inventory records"
              emptyHint="Inventory records are created per product with a SKU."
              rowHeight={58}
            />
          </>
        )}

        {tab === 1 && (
          <Box>
            {lowStockQuery.isLoading ? (
              <LoadingState />
            ) : lowStockQuery.isError ? (
              <Box sx={{ p: 2 }}>
                <ErrorState error={lowStockQuery.error} onRetry={lowStockQuery.refetch} />
              </Box>
            ) : (lowStockQuery.data?.length ?? 0) === 0 ? (
              <EmptyState
                message="Nothing needs restocking"
                hint="Items appear here when stock falls to or below the reorder point."
              />
            ) : (
              <ServerDataGrid
                rows={lowStockQuery.data}
                columns={stockColumns}
                rowCount={lowStockQuery.data.length}
                paginationModel={{ page: 0, pageSize: 25 }}
                onPaginationModelChange={() => {}}
                paginationMode="client"
                rowHeight={58}
              />
            )}
          </Box>
        )}

        {tab === 2 && (
          <ServerDataGrid
            rows={movementsQuery.data?.items || []}
            columns={movementColumns}
            rowCount={movementsQuery.data?.total || 0}
            loading={movementsQuery.isFetching}
            error={movementsQuery.isError ? movementsQuery.error : null}
            onRetry={movementsQuery.refetch}
            paginationModel={movementsPagination}
            onPaginationModelChange={setMovementsPagination}
            emptyMessage="No stock movements recorded"
            emptyHint="Sales, cancellations and manual adjustments are logged here."
            rowHeight={54}
          />
        )}
      </Card>

      {/* Stock adjustment */}
      <Dialog
        open={Boolean(adjustTarget)}
        onClose={adjustMutation.isPending ? undefined : () => setAdjustTarget(null)}
        maxWidth="xs" fullWidth
      >
        <DialogTitle>Adjust stock</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {adjustTarget?.productId?.name || adjustTarget?.sku}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Currently on hand: <strong>{number(adjustTarget?.currentStock)}</strong>
          </Typography>

          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                select fullWidth label="Operation"
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
              >
                <MenuItem value="add">Add to stock</MenuItem>
                <MenuItem value="subtract">Remove from stock</MenuItem>
                <MenuItem value="set">Set exact amount</MenuItem>
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth type="number" label="Quantity" required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                slotProps={{ htmlInput: { min: 0 } }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                select fullWidth label="Reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <MenuItem value="purchase">Purchase</MenuItem>
                <MenuItem value="return">Return</MenuItem>
                <MenuItem value="adjustment">Adjustment</MenuItem>
                <MenuItem value="damage">Damage</MenuItem>
                <MenuItem value="transfer">Transfer</MenuItem>
                <MenuItem value="initial_stock">Initial stock</MenuItem>
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth label="Notes" multiline minRows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustTarget(null)} disabled={adjustMutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={adjustMutation.isPending || quantity === '' || Number(quantity) < 0}
            onClick={() => adjustMutation.mutate({
              inventoryId: adjustTarget._id,
              quantity: Number(quantity),
              operation,
              reason,
              notes: notes || undefined,
            })}
          >
            {adjustMutation.isPending ? 'Saving...' : 'Apply'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
