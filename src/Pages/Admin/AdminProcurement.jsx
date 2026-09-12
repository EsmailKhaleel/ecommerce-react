import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import PageHeader from '../../features/admin/components/PageHeader';
import StatusChip from '../../features/admin/components/StatusChip';
import { EmptyState, ErrorState } from '../../features/admin/components/StateBlocks';
import { createPurchaseOrder, createSupplier, getInventory, getPurchaseOrders, getSuppliers, receivePurchaseOrder, submitPurchaseOrder } from '../../services/adminService';
import { currency, dateTime } from '../../features/admin/utils/format';

const emptySupplier = { name: '', contactPerson: '', email: '', phone: '', paymentTerms: 'net_30', currency: 'USD' };
const emptyLine = { inventoryId: '', quantity: 1, unitCost: 0 };

export default function AdminProcurement() {
  const client = useQueryClient();
  const [supplierOpen, setSupplierOpen] = useState(false);
  const [poOpen, setPoOpen] = useState(false);
  const [supplier, setSupplier] = useState(emptySupplier);
  const [po, setPo] = useState({ supplierId: '', expectedAt: '', notes: '', currency: 'USD', items: [{ ...emptyLine }] });
  const suppliers = useQuery({ queryKey: ['admin', 'suppliers'], queryFn: () => getSuppliers({ limit: 100 }) });
  const inventory = useQuery({ queryKey: ['admin', 'inventory', 'procurement'], queryFn: () => getInventory({ limit: 100 }) });
  const orders = useQuery({ queryKey: ['admin', 'purchase-orders'], queryFn: () => getPurchaseOrders() });

  const refresh = () => client.invalidateQueries({ queryKey: ['admin'] });
  const supplierMutation = useMutation({ mutationFn: createSupplier, onSuccess: () => { toast.success('Supplier created'); setSupplierOpen(false); setSupplier(emptySupplier); refresh(); }, onError: e => toast.error(e.message) });
  const poMutation = useMutation({ mutationFn: createPurchaseOrder, onSuccess: () => { toast.success('Purchase order drafted'); setPoOpen(false); setPo({ supplierId: '', expectedAt: '', notes: '', currency: 'USD', items: [{ ...emptyLine }] }); refresh(); }, onError: e => toast.error(e.message) });
  const transition = useMutation({ mutationFn: ({ id, action, items }) => action === 'submit' ? submitPurchaseOrder(id) : receivePurchaseOrder({ id, items }), onSuccess: refresh, onError: e => toast.error(e.message) });
  const projected = useMemo(() => po.items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitCost || 0), 0), [po.items]);

  const patchLine = (index, key, value) => setPo(current => ({ ...current, items: current.items.map((line, i) => i === index ? { ...line, [key]: value } : line) }));
  const receiveRemaining = order => transition.mutate({ id: order._id, action: 'receive', items: order.items.filter(i => i.receivedQuantity < i.quantity).map(i => ({ itemId: i._id, quantity: i.quantity - i.receivedQuantity })) });

  return <>
    <PageHeader title="Procurement" subtitle="Suppliers, purchasing and stock receiving in one workflow" action={<Stack direction="row" spacing={1}><Button onClick={() => setSupplierOpen(true)} variant="outlined">New supplier</Button><Button onClick={() => setPoOpen(true)} variant="contained" startIcon={<AddIcon />}>New PO</Button></Stack>} />
    {(suppliers.isError || inventory.isError || orders.isError) && <ErrorState error={suppliers.error || inventory.error || orders.error} onRetry={refresh} />}
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, lg: 8 }}><Card><CardHeader title="Purchase orders" subheader="Submit drafts, then receive stock directly into inventory" /><Divider />
        {!orders.data?.length ? <EmptyState message="No purchase orders yet" /> : <Box sx={{ overflowX: 'auto' }}><Table><TableHead><TableRow><TableCell>PO</TableCell><TableCell>Supplier</TableCell><TableCell>Expected</TableCell><TableCell>Status</TableCell><TableCell align="right">Value</TableCell><TableCell align="right">Action</TableCell></TableRow></TableHead><TableBody>
          {orders.data.map(order => <TableRow key={order._id} hover><TableCell><Typography fontWeight={700}>{order.number}</Typography><Typography variant="caption">{order.items.length} line(s)</Typography></TableCell><TableCell>{order.supplierId?.name}</TableCell><TableCell>{order.expectedAt ? dateTime(order.expectedAt) : 'Not set'}</TableCell><TableCell><StatusChip status={order.status} /></TableCell><TableCell align="right">{currency(order.subtotal, order.currency)}</TableCell><TableCell align="right">{order.status === 'draft' && <Button size="small" onClick={() => transition.mutate({ id: order._id, action: 'submit' })}>Submit</Button>}{['submitted', 'partially_received'].includes(order.status) && <Button size="small" onClick={() => receiveRemaining(order)}>Receive remaining</Button>}</TableCell></TableRow>)}
        </TableBody></Table></Box>}
      </Card></Grid>
      <Grid size={{ xs: 12, lg: 4 }}><Card><CardHeader title="Supplier directory" subheader={`${suppliers.data?.total || 0} partners`} /><Divider /><CardContent><Stack spacing={1.5}>{!suppliers.data?.items?.length ? <EmptyState message="No suppliers yet" /> : suppliers.data.items.map(item => <Box key={item._id} sx={{ p: 1.5, border: 1, borderColor: 'divider', borderRadius: 2 }}><Stack direction="row" justifyContent="space-between"><Typography fontWeight={700}>{item.name}</Typography><StatusChip status={item.status} /></Stack><Typography variant="body2" color="text.secondary">{item.contactPerson || item.email}</Typography><Typography variant="caption">Terms: {item.paymentTerms?.replace('_', ' ')}</Typography></Box>)}</Stack></CardContent></Card></Grid>
    </Grid>

    <Dialog open={supplierOpen} onClose={() => setSupplierOpen(false)} fullWidth maxWidth="sm"><DialogTitle>Add supplier</DialogTitle><DialogContent><Grid container spacing={2} sx={{ pt: 1 }}>{Object.entries(supplier).map(([key, value]) => <Grid key={key} size={{ xs: 12, sm: 6 }}><TextField fullWidth required={['name', 'email'].includes(key)} label={key.replace(/([A-Z])/g, ' $1')} value={value} onChange={e => setSupplier(s => ({ ...s, [key]: e.target.value }))} select={key === 'paymentTerms'}>{key === 'paymentTerms' && ['net_15','net_30','net_45','net_60','cod','prepaid'].map(v => <MenuItem key={v} value={v}>{v.replace('_', ' ')}</MenuItem>)}</TextField></Grid>)}</Grid></DialogContent><DialogActions><Button onClick={() => setSupplierOpen(false)}>Cancel</Button><Button variant="contained" disabled={!supplier.name || !supplier.email || supplierMutation.isPending} onClick={() => supplierMutation.mutate(supplier)}>Create</Button></DialogActions></Dialog>

    <Dialog open={poOpen} onClose={() => setPoOpen(false)} fullWidth maxWidth="md"><DialogTitle>Draft purchase order</DialogTitle><DialogContent><Stack spacing={2.5} sx={{ pt: 1 }}><Grid container spacing={2}><Grid size={{ xs: 12, sm: 6 }}><TextField select fullWidth label="Supplier" value={po.supplierId} onChange={e => setPo(v => ({ ...v, supplierId: e.target.value }))}>{suppliers.data?.items?.filter(s => s.status === 'active').map(s => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}</TextField></Grid><Grid size={{ xs: 12, sm: 6 }}><TextField type="date" fullWidth label="Expected date" slotProps={{ inputLabel: { shrink: true } }} value={po.expectedAt} onChange={e => setPo(v => ({ ...v, expectedAt: e.target.value }))} /></Grid></Grid>
      {po.items.map((line, index) => <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={1}><TextField select fullWidth label="Inventory item" value={line.inventoryId} onChange={e => { const item = inventory.data?.items?.find(v => v._id === e.target.value); patchLine(index, 'inventoryId', e.target.value); if (item?.costPrice) patchLine(index, 'unitCost', item.costPrice); }}>{inventory.data?.items?.map(item => <MenuItem key={item._id} value={item._id}>{item.productId?.name || item.sku} · {item.currentStock} in stock</MenuItem>)}</TextField><TextField type="number" label="Qty" value={line.quantity} onChange={e => patchLine(index, 'quantity', e.target.value)} sx={{ width: 120 }} /><TextField type="number" label="Unit cost" value={line.unitCost} onChange={e => patchLine(index, 'unitCost', e.target.value)} sx={{ width: 160 }} /><IconButton disabled={po.items.length === 1} onClick={() => setPo(v => ({ ...v, items: v.items.filter((_, i) => i !== index) }))}><DeleteIcon /></IconButton></Stack>)}
      <Button sx={{ alignSelf: 'flex-start' }} startIcon={<AddIcon />} onClick={() => setPo(v => ({ ...v, items: [...v.items, { ...emptyLine }] }))}>Add line</Button><TextField label="Notes" multiline minRows={2} value={po.notes} onChange={e => setPo(v => ({ ...v, notes: e.target.value }))} /><Alert severity="info">Projected order value: <strong>{currency(projected, po.currency)}</strong></Alert></Stack></DialogContent><DialogActions><Button onClick={() => setPoOpen(false)}>Cancel</Button><Button variant="contained" disabled={!po.supplierId || po.items.some(i => !i.inventoryId || Number(i.quantity) < 1) || poMutation.isPending} onClick={() => poMutation.mutate({ ...po, expectedAt: po.expectedAt || undefined })}>Create draft</Button></DialogActions></Dialog>
  </>;
}
