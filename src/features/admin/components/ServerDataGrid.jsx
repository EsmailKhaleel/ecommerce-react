import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { EmptyState, ErrorState } from './StateBlocks';

/**
 * DataGrid preconfigured for server-side paging.
 *
 * Every admin list endpoint returns { items, page, totalPages, total }, so
 * paging, filtering and sorting are all delegated to the API instead of pulling
 * the whole collection down and slicing it in the browser.
 */
export default function ServerDataGrid({
  rows = [],
  columns,
  rowCount = 0,
  loading = false,
  error = null,
  onRetry,
  paginationModel,
  onPaginationModelChange,
  getRowId,
  emptyMessage = 'No records found',
  emptyHint,
  autoHeight = true,
  ...rest
}) {
  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <ErrorState error={error} onRetry={onRetry} />
      </Box>
    );
  }

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      autoHeight={autoHeight}
      getRowId={getRowId || ((row) => row._id || row.id)}
      // Server-side paging
      paginationMode="server"
      rowCount={rowCount}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      pageSizeOptions={[10, 25, 50]}
      disableRowSelectionOnClick
      disableColumnMenu
      showToolbar={false}
      slots={{
        noRowsOverlay: () => <EmptyState message={emptyMessage} hint={emptyHint} />,
      }}
      sx={{
        // Keep long cell content readable rather than clipped mid-word
        '& .MuiDataGrid-cell': { alignItems: 'center' },
      }}
      {...rest}
    />
  );
}
