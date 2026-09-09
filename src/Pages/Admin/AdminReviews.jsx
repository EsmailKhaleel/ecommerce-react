import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, IconButton, Typography, Box, Rating, Stack } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { toast } from 'react-toastify';

import { getAdminReviews, deleteReview } from '../../services/adminService';
import PageHeader from '../../features/admin/components/PageHeader';
import ServerDataGrid from '../../features/admin/components/ServerDataGrid';
import ConfirmDialog from '../../features/admin/components/ConfirmDialog';
import { dateTime } from '../../features/admin/utils/format';

export default function AdminReviews() {
  const queryClient = useQueryClient();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const reviewsQuery = useQuery({
    queryKey: ['admin', 'reviews', paginationModel],
    queryFn: () => getAdminReviews({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
    }),
    placeholderData: (previous) => previous,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      toast.success('Review deleted');
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      // Deleting a review recalculates the product's average rating
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => toast.error(error.message || 'Failed to delete review'),
  });

  const columns = useMemo(() => [
    {
      field: 'userName',
      headerName: 'Author',
      width: 170,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>{params.value}</Typography>
      ),
    },
    {
      field: 'productName',
      headerName: 'Product',
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <Typography variant="body2" noWrap title={params.value}>
          {/* productName is null when the reviewed product has been deleted */}
          {params.value || 'Removed product'}
        </Typography>
      ),
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Rating value={Number(params.value) || 0} readOnly size="small" />
        </Stack>
      ),
    },
    {
      field: 'comment',
      headerName: 'Comment',
      flex: 2,
      minWidth: 240,
      sortable: false,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary" noWrap title={params.value}>
          {params.value || <em>No comment</em>}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Posted',
      width: 170,
      renderCell: (params) => (
        <Typography variant="caption" color="text.secondary">{dateTime(params.value)}</Typography>
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
        <IconButton size="small" color="error" onClick={() => setDeleteTarget(params.row)}>
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      ),
    },
  ], []);

  return (
    <>
      <PageHeader title="Reviews" subtitle="Moderate customer feedback" />

      <Card>
        <ServerDataGrid
          rows={reviewsQuery.data?.items || []}
          columns={columns}
          rowCount={reviewsQuery.data?.total || 0}
          loading={reviewsQuery.isFetching}
          error={reviewsQuery.isError ? reviewsQuery.error : null}
          onRetry={reviewsQuery.refetch}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          emptyMessage="No reviews yet"
          emptyHint="Customer reviews appear here once submitted."
          rowHeight={56}
        />
      </Card>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete review"
        message={
          <Box component="span">
            Delete the review by <strong>{deleteTarget?.userName}</strong>?
            The product rating will be recalculated.
          </Box>
        }
        confirmLabel="Delete"
        busy={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
