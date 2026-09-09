import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Card, Stack, TextField, MenuItem, IconButton, Avatar, Box, Typography, Tooltip,
  InputAdornment, Button, Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { toast } from 'react-toastify';

import { getUsers, updateUser, deleteUser, downloadReport } from '../../services/adminService';
import { useAuth } from '../../Context/useAuth';
import PageHeader from '../../features/admin/components/PageHeader';
import ServerDataGrid from '../../features/admin/components/ServerDataGrid';
import ConfirmDialog from '../../features/admin/components/ConfirmDialog';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { date, number } from '../../features/admin/utils/format';

export default function AdminCustomers() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const debouncedSearch = useDebouncedValue(search, 400);

  const usersQuery = useQuery({
    queryKey: ['admin', 'users', {
      page: paginationModel.page, pageSize: paginationModel.pageSize, search: debouncedSearch, role,
    }],
    queryFn: () => getUsers({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      search: debouncedSearch || undefined,
      role: role || undefined,
    }),
    placeholderData: (previous) => previous,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
  };

  const roleMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success('Customer updated');
      invalidate();
    },
    onError: (error) => toast.error(error.message || 'Failed to update customer'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('Customer deleted');
      setDeleteTarget(null);
      invalidate();
    },
    onError: (error) => toast.error(error.message || 'Failed to delete customer'),
  });

  const columns = useMemo(() => [
    {
      field: 'name',
      headerName: 'Customer',
      flex: 1.5,
      minWidth: 220,
      renderCell: (params) => (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
          <Avatar src={params.row.image || undefined} sx={{ width: 34, height: 34 }}>
            {params.value?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap>{params.value}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {params.row.email}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      renderCell: (params) => {
        // The backend blocks admins from changing their own role, so reflect
        // that here rather than letting the request fail
        const isSelf = params.row._id === currentUser?._id;
        return (
          <TextField
            select
            value={params.value}
            disabled={isSelf || roleMutation.isPending}
            onChange={(e) => roleMutation.mutate({ id: params.row._id, role: e.target.value })}
            sx={{ width: 120 }}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        );
      },
    },
    {
      field: 'cart',
      headerName: 'Cart',
      width: 80,
      sortable: false,
      renderCell: (params) => number(params.value?.length || 0),
    },
    {
      field: 'wishlist',
      headerName: 'Wishlist',
      width: 90,
      sortable: false,
      renderCell: (params) => number(params.value?.length || 0),
    },
    {
      field: 'googleId',
      headerName: 'Sign-in',
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Chip size="small" variant="outlined" label={params.value ? 'Google' : 'Password'} />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Joined',
      width: 130,
      renderCell: (params) => (
        <Typography variant="caption" color="text.secondary">{date(params.value)}</Typography>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => {
        const isSelf = params.row._id === currentUser?._id;
        return (
          <Tooltip title={isSelf ? 'You cannot delete your own account' : 'Delete'}>
            <IconButton
              size="small" color="error" disabled={isSelf}
              onClick={() => setDeleteTarget(params.row)}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ], [currentUser?._id, roleMutation]);

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="Accounts and access levels"
        action={
          <Button
            variant="outlined"
            startIcon={<DownloadOutlinedIcon />}
            onClick={() => downloadReport('/reports/customers/csv', 'customers.csv')}
          >
            Export CSV
          </Button>
        }
      />

      <Card>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ p: 2 }}>
          <TextField
            placeholder="Search name or email"
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
            sx={{ minWidth: 260 }}
          />
          <TextField
            select label="Role" value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPaginationModel((prev) => ({ ...prev, page: 0 }));
            }}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All roles</MenuItem>
            <MenuItem value="user">Users</MenuItem>
            <MenuItem value="admin">Admins</MenuItem>
          </TextField>
        </Stack>

        <ServerDataGrid
          rows={usersQuery.data?.items || []}
          columns={columns}
          rowCount={usersQuery.data?.total || 0}
          loading={usersQuery.isFetching}
          error={usersQuery.isError ? usersQuery.error : null}
          onRetry={usersQuery.refetch}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          emptyMessage="No customers found"
          rowHeight={62}
        />
      </Card>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete customer"
        message={`Delete ${deleteTarget?.name} (${deleteTarget?.email})? Their orders will be kept for reporting.`}
        confirmLabel="Delete"
        busy={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
