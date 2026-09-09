export const currency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export const compactCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);

export const number = (value) =>
  new Intl.NumberFormat('en-US').format(Number(value) || 0);

export const date = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  }) : '--';

export const dateTime = (value) =>
  value ? new Date(value).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }) : '--';

/** Short, stable label for a Mongo ObjectId in a dense table. */
export const shortId = (id) => (id ? `#${String(id).slice(-8)}` : '--');
