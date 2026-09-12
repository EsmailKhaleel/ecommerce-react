import { Chip } from '@mui/material';

// Maps the backend's enum values to a colour. Keys match the API exactly:
// order.status, order.paymentStatus and inventory.status.
const COLORS = {
  // Order status
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error',
  // Payment status
  paid: 'success',
  unpaid: 'warning',
  refunded: 'default',
  partially_refunded: 'warning',
  // Inventory status
  in_stock: 'success',
  low_stock: 'warning',
  out_of_stock: 'error',
  discontinued: 'default',
};

const humanize = (value) =>
  String(value).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export default function StatusChip({ status, size = 'small' }) {
  if (!status) return null;
  return (
    <Chip
      label={humanize(status)}
      color={COLORS[status] || 'default'}
      size={size}
      variant="filled"
      sx={{ fontWeight: 600 }}
    />
  );
}
