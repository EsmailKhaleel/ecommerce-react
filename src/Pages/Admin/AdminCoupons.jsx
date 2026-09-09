import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Card, Stack, Button, TextField, MenuItem, IconButton, Typography, Box, Switch,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, Chip, Tooltip, LinearProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { toast } from 'react-toastify';

import {
  getCoupons, createCoupon, updateCoupon, deleteCoupon, toggleCoupon,
} from '../../services/adminService';
import PageHeader from '../../features/admin/components/PageHeader';
import ServerDataGrid from '../../features/admin/components/ServerDataGrid';
import ConfirmDialog from '../../features/admin/components/ConfirmDialog';
import { currency, date, number } from '../../features/admin/utils/format';

// Mirrors coupon.model.js type enum
const COUPON_TYPES = [
  { value: 'percentage', label: 'Percentage off' },
  { value: 'fixed', label: 'Fixed amount off' },
  { value: 'free_shipping', label: 'Free shipping' },
  { value: 'buy_x_get_y', label: 'Buy X get Y' },
];

const toDateInput = (value) =>
  value ? new Date(value).toISOString().slice(0, 10) : '';

const EMPTY_FORM = {
  code: '', name: '', description: '', type: 'percentage', value: '',
  minOrderAmount: '', maxDiscountAmount: '', usageLimit: '',
  validFrom: toDateInput(new Date()), validUntil: '',
  isActive: true, autoApply: false, firstTimeOnly: false,
};

export default function AdminCoupons() {
  const queryClient = useQueryClient();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const couponsQuery = useQuery({
    queryKey: ['admin', 'coupons', paginationModel],
    queryFn: () => getCoupons({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
    }),
    placeholderData: (previous) => previous,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });

  const createMutation = useMutation({
    mutationFn: createCoupon,
    onSuccess: () => { toast.success('Coupon created'); setFormOpen(false); invalidate(); },
    onError: (error) => toast.error(error.message || 'Failed to create coupon'),
  });

  const updateMutation = useMutation({
    mutationFn: updateCoupon,
    onSuccess: () => { toast.success('Coupon updated'); setFormOpen(false); invalidate(); },
    onError: (error) => toast.error(error.message || 'Failed to update coupon'),
  });

  const toggleMutation = useMutation({
    mutationFn: toggleCoupon,
    onSuccess: () => { toast.success('Coupon status changed'); invalidate(); },
    onError: (error) => toast.error(error.message || 'Failed to toggle coupon'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => { toast.success('Coupon deleted'); setDeleteTarget(null); invalidate(); },
    onError: (error) => toast.error(error.message || 'Failed to delete coupon'),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (coupon) => {
    setEditing(coupon);
    setForm({
      code: coupon.code ?? '',
      name: coupon.name ?? '',
      description: coupon.description ?? '',
      type: coupon.type ?? 'percentage',
      value: coupon.value ?? '',
      minOrderAmount: coupon.minOrderAmount ?? '',
      maxDiscountAmount: coupon.maxDiscountAmount ?? '',
      usageLimit: coupon.usageLimit ?? '',
      validFrom: toDateInput(coupon.validFrom),
      validUntil: toDateInput(coupon.validUntil),
      isActive: coupon.isActive ?? true,
      autoApply: coupon.autoApply ?? false,
      firstTimeOnly: coupon.firstTimeOnly ?? false,
    });
    setErrors({});
    setFormOpen(true);
  };

  const validate = () => {
    const next = {};
    if (!form.code.trim()) next.code = 'Code is required';
    if (!form.name.trim()) next.name = 'Name is required';
    // free_shipping needs no value; every other type does
    if (form.type !== 'free_shipping' && (form.value === '' || Number(form.value) < 0)) {
      next.value = 'A non-negative value is required';
    }
    if (form.type === 'percentage' && Number(form.value) > 100) {
      next.value = 'Percentage cannot exceed 100';
    }
    if (!form.validUntil) next.validUntil = 'An expiry date is required';
    if (form.validFrom && form.validUntil && new Date(form.validUntil) <= new Date(form.validFrom)) {
      next.validUntil = 'Expiry must be after the start date';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      description: form.description.trim(),
      type: form.type,
      value: form.type === 'free_shipping' ? 0 : Number(form.value),
      validFrom: form.validFrom ? new Date(form.validFrom).toISOString() : undefined,
      validUntil: new Date(form.validUntil).toISOString(),
      isActive: form.isActive,
      autoApply: form.autoApply,
      firstTimeOnly: form.firstTimeOnly,
      ...(form.minOrderAmount !== '' && { minOrderAmount: Number(form.minOrderAmount) }),
      ...(form.maxDiscountAmount !== '' && { maxDiscountAmount: Number(form.maxDiscountAmount) }),
      ...(form.usageLimit !== '' && { usageLimit: Number(form.usageLimit) }),
    };

    if (editing) updateMutation.mutate({ id: editing._id, ...payload });
    else createMutation.mutate(payload);
  };

  const describeValue = (coupon) => {
    if (coupon.type === 'percentage') return `${coupon.value}% off`;
    if (coupon.type === 'fixed') return `${currency(coupon.value)} off`;
    if (coupon.type === 'free_shipping') return 'Free shipping';
    return `Buy X get Y`;
  };

  const columns = useMemo(() => [
    {
      field: 'code',
      headerName: 'Code',
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700 }} noWrap>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {params.row.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'value',
      headerName: 'Discount',
      width: 130,
      renderCell: (params) => describeValue(params.row),
    },
    {
      field: 'minOrderAmount',
      headerName: 'Min spend',
      width: 110,
      renderCell: (params) => (params.value ? currency(params.value) : '--'),
    },
    {
      field: 'usageCount',
      headerName: 'Used',
      width: 130,
      sortable: false,
      renderCell: (params) => {
        const used = params.value ?? 0;
        const limit = params.row.usageLimit;
        if (!limit) return `${number(used)} times`;
        return (
          <Box sx={{ width: '100%' }}>
            <Typography variant="caption">{number(used)} / {number(limit)}</Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min((used / limit) * 100, 100)}
              sx={{ height: 5, borderRadius: 3, mt: 0.5 }}
            />
          </Box>
        );
      },
    },
    {
      field: 'validUntil',
      headerName: 'Expires',
      width: 130,
      renderCell: (params) => {
        const expired = params.value && new Date(params.value) < new Date();
        return (
          <Typography variant="caption" color={expired ? 'error' : 'text.secondary'}>
            {date(params.value)}{expired ? ' (expired)' : ''}
          </Typography>
        );
      },
    },
    {
      field: 'autoApply',
      headerName: 'Auto',
      width: 80,
      sortable: false,
      renderCell: (params) => (params.value ? <Chip size="small" label="Auto" color="info" /> : '--'),
    },
    {
      field: 'isActive',
      headerName: 'Active',
      width: 90,
      renderCell: (params) => (
        <Tooltip title={params.value ? 'Deactivate' : 'Activate'}>
          <Switch
            size="small"
            checked={Boolean(params.value)}
            disabled={toggleMutation.isPending}
            onChange={() => toggleMutation.mutate(params.row._id)}
          />
        </Tooltip>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={() => openEdit(params.row)}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => setDeleteTarget(params.row)}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ], [toggleMutation]);

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <PageHeader
        title="Coupons"
        subtitle="Discount codes and promotions"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            New coupon
          </Button>
        }
      />

      <Card>
        <ServerDataGrid
          rows={couponsQuery.data?.items || []}
          columns={columns}
          rowCount={couponsQuery.data?.total || 0}
          loading={couponsQuery.isFetching}
          error={couponsQuery.isError ? couponsQuery.error : null}
          onRetry={couponsQuery.refetch}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          emptyMessage="No coupons yet"
          emptyHint="Create a discount code to run a promotion."
          rowHeight={62}
        />
      </Card>

      <Dialog open={formOpen} onClose={saving ? undefined : () => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit coupon' : 'New coupon'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Code" fullWidth required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                error={Boolean(errors.code)} helperText={errors.code}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Name" fullWidth required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={Boolean(errors.name)} helperText={errors.name}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Description" fullWidth multiline minRows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select label="Type" fullWidth
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {COUPON_TYPES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={form.type === 'percentage' ? 'Percentage' : 'Value'}
                type="number" fullWidth
                disabled={form.type === 'free_shipping'}
                value={form.type === 'free_shipping' ? '' : form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                error={Boolean(errors.value)} helperText={errors.value}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Min order" type="number" fullWidth
                value={form.minOrderAmount}
                onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Max discount" type="number" fullWidth
                value={form.maxDiscountAmount}
                onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Usage limit" type="number" fullWidth
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                helperText="Blank = unlimited"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Valid from" type="date" fullWidth
                value={form.validFrom}
                onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Valid until" type="date" fullWidth required
                value={form.validUntil}
                onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
                error={Boolean(errors.validUntil)} helperText={errors.validUntil}
              />
            </Grid>
            <Grid size={12}>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Stack direction="row" alignItems="center">
                  <Switch
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
                  <Typography variant="body2">Active</Typography>
                </Stack>
                <Stack direction="row" alignItems="center">
                  <Switch
                    checked={form.autoApply}
                    onChange={(e) => setForm({ ...form, autoApply: e.target.checked })}
                  />
                  <Typography variant="body2">Apply automatically</Typography>
                </Stack>
                <Stack direction="row" alignItems="center">
                  <Switch
                    checked={form.firstTimeOnly}
                    onChange={(e) => setForm({ ...form, firstTimeOnly: e.target.checked })}
                  />
                  <Typography variant="body2">First order only</Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)} disabled={saving}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : editing ? 'Save changes' : 'Create coupon'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete coupon"
        message={`Delete coupon "${deleteTarget?.code}"?`}
        confirmLabel="Delete"
        busy={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
