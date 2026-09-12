import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Typography } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { getInvoices } from '../../services/adminService';
import { downloadInvoice } from '../../services/invoiceService';
import PageHeader from '../../features/admin/components/PageHeader';
import ServerDataGrid from '../../features/admin/components/ServerDataGrid';
import StatusChip from '../../features/admin/components/StatusChip';
import { currency, dateTime } from '../../features/admin/utils/format';

export default function AdminInvoices() {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const query = useQuery({ queryKey: ['admin', 'invoices', paginationModel], queryFn: () => getInvoices({ page: paginationModel.page + 1, limit: paginationModel.pageSize }), placeholderData: previous => previous });
  const columns = useMemo(() => [
    { field: 'number', headerName: 'Invoice', width: 170, renderCell: params => <Typography sx={{ fontFamily: 'monospace' }}>{params.value}</Typography> },
    { field: 'status', headerName: 'Status', width: 130, renderCell: params => <StatusChip status={params.value} /> },
    { field: 'customer', headerName: 'Customer', flex: 1, minWidth: 190, valueGetter: (_value, row) => row.customer?.name || row.customer?.email || '' },
    { field: 'totalAmount', headerName: 'Total', width: 130, valueFormatter: (value, row) => currency(value, row?.currency) },
    { field: 'issueDate', headerName: 'Issued', width: 180, valueFormatter: value => dateTime(value) },
    { field: 'download', headerName: '', width: 130, sortable: false, renderCell: params => <Button size="small" startIcon={<DownloadOutlinedIcon />} onClick={() => downloadInvoice(params.row._id, params.row.number)}>PDF</Button> },
  ], []);
  return <><PageHeader title="Invoices" subtitle="Immutable financial documents generated from paid orders" /><Card><ServerDataGrid rows={query.data?.items || []} columns={columns} rowCount={query.data?.total || 0} loading={query.isFetching} error={query.error} onRetry={query.refetch} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} emptyMessage="No invoices yet" /></Card></>;
}
