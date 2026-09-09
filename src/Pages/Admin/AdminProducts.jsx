import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Card, Box, Button, TextField, MenuItem, Stack, IconButton, Avatar, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, InputAdornment, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { toast } from 'react-toastify';

import {
  getAdminProducts, createProduct, updateProduct, deleteProduct,
} from '../../services/adminService';
import { getAllowedCategories } from '../../services/productsService';
import PageHeader from '../../features/admin/components/PageHeader';
import ServerDataGrid from '../../features/admin/components/ServerDataGrid';
import ConfirmDialog from '../../features/admin/components/ConfirmDialog';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { currency, number } from '../../features/admin/utils/format';

const EMPTY_FORM = {
  name: '', description: '', price: '', old_price: '', discount: '',
  category: '', image: '', images: '',
};

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: categories = [] } = useQuery({
    queryKey: ['allowedCategories'],
    queryFn: getAllowedCategories,
    staleTime: 10 * 60 * 1000,
  });

  // Filtering, sorting, searching and paging are all delegated to the API
  const queryKey = ['admin', 'products', {
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    search: debouncedSearch,
    category,
    sort,
  }];

  const productsQuery = useQuery({
    queryKey,
    queryFn: () => getAdminProducts({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      q: debouncedSearch || undefined,
      category: category || undefined,
      _sort: sort ? sort.split(':')[0] : undefined,
      _order: sort ? sort.split(':')[1] : undefined,
    }),
    placeholderData: (previous) => previous,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success('Product created');
      setFormOpen(false);
      invalidate();
    },
    onError: (error) => toast.error(error.message || 'Failed to create product'),
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast.success('Product updated');
      setFormOpen(false);
      invalidate();
    },
    onError: (error) => toast.error(error.message || 'Failed to update product'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success('Product deleted');
      setDeleteTarget(null);
      invalidate();
    },
    onError: (error) => toast.error(error.message || 'Failed to delete product'),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setFormOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name ?? '',
      description: product.description ?? '',
      price: product.price ?? '',
      old_price: product.old_price ?? '',
      discount: product.discount ?? '',
      category: product.category ?? '',
      image: product.image ?? '',
      images: (product.images || []).join(', '),
    });
    setFormErrors({});
    setFormOpen(true);
  };

  // Mirrors the backend's required fields so we fail fast in the dialog rather
  // than round-tripping a validation error
  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.description.trim()) errors.description = 'Description is required';
    if (form.price === '' || Number(form.price) < 0) errors.price = 'A non-negative price is required';
    if (!form.category) errors.category = 'Category is required';
    if (!form.image.trim()) errors.image = 'Image URL is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      image: form.image.trim(),
      ...(form.old_price !== '' && { old_price: Number(form.old_price) }),
      ...(form.discount !== '' && { discount: Number(form.discount) }),
      images: form.images
        ? form.images.split(',').map((url) => url.trim()).filter(Boolean)
        : [],
    };

    if (editing) {
      updateMutation.mutate({ id: editing._id || editing.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const columns = useMemo(() => [
    {
      field: 'image',
      headerName: '',
      width: 64,
      sortable: false,
      renderCell: (params) => (
        <Avatar variant="rounded" src={params.value} alt="" sx={{ width: 38, height: 38 }} />
      ),
    },
    {
      field: 'name',
      headerName: 'Product',
      flex: 1.6,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" noWrap title={params.value}>{params.value}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {params.row.category}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 110,
      renderCell: (params) => currency(params.value),
    },
    {
      field: 'old_price',
      headerName: 'Was',
      width: 100,
      renderCell: (params) => (params.value ? currency(params.value) : '--'),
    },
    {
      field: 'averageRating',
      headerName: 'Rating',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? `${params.value} / 5` : '--'}
          <Typography component="span" variant="caption" color="text.secondary">
            {' '}({number(params.row.numReviews)})
          </Typography>
        </Typography>
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
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => openEdit(params.row)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => setDeleteTarget(params.row)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ], []);

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <PageHeader
        title="Products"
        subtitle="Manage your catalogue"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            Add product
          </Button>
        }
      />

      <Card>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ p: 2 }}
        >
          <TextField
            placeholder="Search products"
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
            select
            label="Category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPaginationModel((prev) => ({ ...prev, page: 0 }));
            }}
            sx={{ minWidth: 170 }}
          >
            <MenuItem value="">All categories</MenuItem>
            {categories.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Sort by"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="price:asc">Price (low to high)</MenuItem>
            <MenuItem value="price:desc">Price (high to low)</MenuItem>
            <MenuItem value="name:asc">Name (A-Z)</MenuItem>
            <MenuItem value="averageRating:desc">Top rated</MenuItem>
            <MenuItem value="createdAt:desc">Newest</MenuItem>
          </TextField>
        </Stack>

        <ServerDataGrid
          rows={productsQuery.data?.items || []}
          columns={columns}
          rowCount={productsQuery.data?.total || 0}
          loading={productsQuery.isFetching}
          error={productsQuery.isError ? productsQuery.error : null}
          onRetry={productsQuery.refetch}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          emptyMessage="No products found"
          emptyHint={
            debouncedSearch || category
              ? 'Try clearing the search or category filter.'
              : 'Add your first product to get started.'
          }
          rowHeight={58}
        />
      </Card>

      {/* Create / edit dialog */}
      <Dialog open={formOpen} onClose={saving ? undefined : () => setFormOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit product' : 'Add product'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                label="Name" fullWidth required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                select label="Category" fullWidth required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                error={Boolean(formErrors.category)}
                helperText={formErrors.category}
              >
                {categories.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField
                label="Description" fullWidth required multiline minRows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                error={Boolean(formErrors.description)}
                helperText={formErrors.description}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Price" type="number" fullWidth required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                error={Boolean(formErrors.price)}
                helperText={formErrors.price}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Old price" type="number" fullWidth
                value={form.old_price}
                onChange={(e) => setForm({ ...form, old_price: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Discount %" type="number" fullWidth
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Main image URL" fullWidth required
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                error={Boolean(formErrors.image)}
                helperText={formErrors.image}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Additional image URLs" fullWidth
                placeholder="Comma separated"
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                helperText="Separate multiple URLs with commas"
              />
            </Grid>
            {form.image && (
              <Grid size={12}>
                <Box
                  component="img"
                  src={form.image}
                  alt="Preview"
                  sx={{
                    width: '100%', maxHeight: 180, objectFit: 'contain',
                    borderRadius: 2, bgcolor: 'action.hover',
                  }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)} disabled={saving}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : editing ? 'Save changes' : 'Create product'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete product"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        busy={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id || deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
