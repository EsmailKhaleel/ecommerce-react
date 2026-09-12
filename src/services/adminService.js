import { handleApiError } from "./apiError";
import axiosInstance from "./axiosInstance";

/**
 * The API uses three different response envelopes depending on which module a
 * route lives in:
 *   { success: true, data: {...} }      - users, inventory, coupons, brands...
 *   { status: true, ...payload }        - analytics, orders, reports
 *   { ...payload }                      - products, reviews
 * These helpers unwrap all three so components receive a predictable shape.
 */
const unwrap = (response) => {
  const body = response.data;
  if (body && typeof body === 'object' && 'data' in body) return body.data;
  return body;
};

// Normalise the various pagination conventions into one shape.
const toPageResult = (payload, itemsKey) => {
  const items = payload?.[itemsKey] ?? [];

  // Modules that nest a pagination object: { current, pages, total }
  if (payload?.pagination) {
    return {
      items,
      page: payload.pagination.current ?? 1,
      totalPages: payload.pagination.pages ?? 1,
      total: payload.pagination.total ?? items.length,
    };
  }

  // Modules that put pagination fields at the root
  return {
    items,
    page: payload?.page ?? 1,
    totalPages: payload?.totalPages ?? 1,
    total: payload?.total ?? items.length,
  };
};

// Drop empty values so we never send `?status=` or `?search=undefined`
const cleanParams = (params = {}) => {
  // TanStack Query calls queryFn with an internal context object. Guarding
  // here prevents that object from ever being serialized as API parameters if
  // a service is accidentally passed directly instead of wrapped in a lambda.
  if (!params || typeof params !== 'object' || 'queryKey' in params || 'signal' in params || 'client' in params) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  );
};

/* ------------------------------------------------------------------ dashboard */

export const getDashboardStats = async (params) => {
  try {
    const response = await axiosInstance.get('/analytics/dashboard', {
      params: cleanParams(params),
    });
    return unwrap(response);
  } catch (error) {
    handleApiError(error, 'Failed to load dashboard statistics.');
  }
};

export const getSalesAnalytics = async (params) => {
  try {
    const response = await axiosInstance.get('/analytics/sales', {
      params: cleanParams(params),
    });
    return unwrap(response);
  } catch (error) {
    handleApiError(error, 'Failed to load sales analytics.');
  }
};

export const getCustomerAnalytics = async (params) => {
  try {
    const response = await axiosInstance.get('/analytics/customers', {
      params: cleanParams(params),
    });
    return unwrap(response);
  } catch (error) {
    handleApiError(error, 'Failed to load customer analytics.');
  }
};

export const getProductAnalytics = async (params) => {
  try {
    const response = await axiosInstance.get('/analytics/products', {
      params: cleanParams(params),
    });
    return unwrap(response);
  } catch (error) {
    handleApiError(error, 'Failed to load product analytics.');
  }
};

export const getOperationsHealth = async (params) => {
  try { return unwrap(await axiosInstance.get('/analytics/operations-health', { params: cleanParams(params) })); }
  catch (error) { handleApiError(error, 'Failed to load operations health.'); }
};

export const getMarketingAnalytics = async (params) => {
  try { return unwrap(await axiosInstance.get('/analytics/marketing', { params: cleanParams(params) })); }
  catch (error) { handleApiError(error, 'Failed to load marketing analytics.'); }
};

/* --------------------------------------------------------------------- orders */

export const getAllOrders = async (params) => {
  try {
    const response = await axiosInstance.get('/orders/all', {
      params: cleanParams(params),
    });
    return toPageResult(unwrap(response), 'orders');
  } catch (error) {
    handleApiError(error, 'Failed to load orders.');
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return unwrap(response)?.order ?? unwrap(response);
  } catch (error) {
    handleApiError(error, 'Failed to load order.');
  }
};

export const updateOrderStatus = async ({ orderId, status, trackingNumber }) => {
  try {
    const response = await axiosInstance.patch(`/orders/${orderId}/status`, {
      status,
      ...(trackingNumber && { trackingNumber }),
    });
    return unwrap(response)?.order ?? unwrap(response);
  } catch (error) {
    handleApiError(error, 'Failed to update order status.');
  }
};

export const processRefund = async ({ orderId, approve, amount }) => {
  try {
    const response = await axiosInstance.post(`/orders/${orderId}/refund/process`, { approve, ...(amount && { amount: Number(amount) }) });
    return unwrap(response)?.order ?? unwrap(response);
  } catch (error) { handleApiError(error, 'Failed to process refund.'); }
};

export const getInvoices = async (params) => {
  try { return toPageResult(unwrap(await axiosInstance.get('/invoices', { params: cleanParams(params) })), 'invoices'); }
  catch (error) { handleApiError(error, 'Failed to load invoices.'); }
};

export const getReturns = async (params) => {
  try { return unwrap(await axiosInstance.get('/returns', { params: cleanParams(params) }))?.returns || []; }
  catch (error) { handleApiError(error, 'Failed to load returns.'); }
};

export const updateReturn = async ({ id, ...changes }) => {
  try { return unwrap(await axiosInstance.patch(`/returns/${id}`, changes))?.return; }
  catch (error) { handleApiError(error, 'Failed to update return.'); }
};

export const getShipments = async (params) => {
  try { return unwrap(await axiosInstance.get('/shipments', { params: cleanParams(params) }))?.shipments || []; }
  catch (error) { handleApiError(error, 'Failed to load shipments.'); }
};

export const createShipment = async (shipment) => {
  try { return unwrap(await axiosInstance.post('/shipments', shipment))?.shipment; }
  catch (error) { handleApiError(error, 'Failed to create shipment.'); }
};

export const updateShipment = async ({ id, ...changes }) => {
  try { return unwrap(await axiosInstance.patch(`/shipments/${id}`, changes))?.shipment; }
  catch (error) { handleApiError(error, 'Failed to update shipment.'); }
};

export const getPurchaseOrders = async (params) => {
  try { return unwrap(await axiosInstance.get('/purchase-orders', { params: cleanParams(params) }))?.purchaseOrders || []; }
  catch (error) { handleApiError(error, 'Failed to load purchase orders.'); }
};

export const submitPurchaseOrder = async (id) => {
  try { return unwrap(await axiosInstance.post(`/purchase-orders/${id}/submit`))?.purchaseOrder; }
  catch (error) { handleApiError(error, 'Failed to submit purchase order.'); }
};

export const receivePurchaseOrder = async ({ id, items }) => {
  try { return unwrap(await axiosInstance.post(`/purchase-orders/${id}/receive`, { items }))?.purchaseOrder; }
  catch (error) { handleApiError(error, 'Failed to receive purchase order.'); }
};

export const createPurchaseOrder = async (payload) => {
  try { return unwrap(await axiosInstance.post('/purchase-orders', payload))?.purchaseOrder; }
  catch (error) { handleApiError(error, 'Failed to create purchase order.'); }
};

export const getSuppliers = async (params) => {
  try { return toPageResult(unwrap(await axiosInstance.get('/suppliers', { params: cleanParams(params) })), 'suppliers'); }
  catch (error) { handleApiError(error, 'Failed to load suppliers.'); }
};

export const createSupplier = async (payload) => {
  try { return unwrap(await axiosInstance.post('/suppliers', payload)); }
  catch (error) { handleApiError(error, 'Failed to create supplier.'); }
};

export const updateSupplier = async ({ id, ...payload }) => {
  try { return unwrap(await axiosInstance.put(`/suppliers/${id}`, payload)); }
  catch (error) { handleApiError(error, 'Failed to update supplier.'); }
};

export const getCampaigns = async (params) => {
  try { return toPageResult(unwrap(await axiosInstance.get('/campaigns', { params: cleanParams(params) })), 'campaigns'); }
  catch (error) { handleApiError(error, 'Failed to load campaigns.'); }
};

export const createCampaign = async (payload) => {
  try { return unwrap(await axiosInstance.post('/campaigns', payload)); }
  catch (error) { handleApiError(error, 'Failed to create campaign.'); }
};

export const changeCampaignStatus = async ({ id, action }) => {
  try { return unwrap(await axiosInstance.patch(`/campaigns/${id}/${action}`)); }
  catch (error) { handleApiError(error, `Failed to ${action} campaign.`); }
};

export const getNewsletterSubscribers = async (params) => {
  try { return toPageResult(unwrap(await axiosInstance.get('/newsletter', { params: cleanParams(params) })), 'subscribers'); }
  catch (error) { handleApiError(error, 'Failed to load newsletter subscribers.'); }
};

export const getNewsletterAnalytics = async () => {
  try { return unwrap(await axiosInstance.get('/newsletter/analytics')); }
  catch (error) { handleApiError(error, 'Failed to load newsletter analytics.'); }
};

export const getBrands = async (params) => {
  try { return toPageResult(unwrap(await axiosInstance.get('/brands', { params: cleanParams(params) })), 'brands'); }
  catch (error) { handleApiError(error, 'Failed to load brands.'); }
};

export const createBrand = async (payload) => {
  try { return unwrap(await axiosInstance.post('/brands', payload)); }
  catch (error) { handleApiError(error, 'Failed to create brand.'); }
};

export const toggleBrandFeatured = async (id) => {
  try { return unwrap(await axiosInstance.patch(`/brands/${id}/featured`)); }
  catch (error) { handleApiError(error, 'Failed to update brand.'); }
};

export const getCollections = async (params) => {
  try { return toPageResult(unwrap(await axiosInstance.get('/collections', { params: cleanParams(params) })), 'collections'); }
  catch (error) { handleApiError(error, 'Failed to load collections.'); }
};

export const createCollection = async (payload) => {
  try { return unwrap(await axiosInstance.post('/collections', payload)); }
  catch (error) { handleApiError(error, 'Failed to create collection.'); }
};

export const toggleCollectionPublished = async (id) => {
  try { return unwrap(await axiosInstance.patch(`/collections/${id}/published`)); }
  catch (error) { handleApiError(error, 'Failed to update collection.'); }
};

export const getActivitySummary = async () => {
  try { return unwrap(await axiosInstance.get('/activities/summary')); }
  catch (error) { handleApiError(error, 'Failed to load customer activity.'); }
};

export const getPopularProducts = async () => {
  try { const result = unwrap(await axiosInstance.get('/activities/popular-products')); return Array.isArray(result) ? result : []; }
  catch (error) { handleApiError(error, 'Failed to load product interest.'); }
};

export const getAuditLogs = async (params) => {
  try { return toPageResult(unwrap(await axiosInstance.get('/audit-logs', { params: cleanParams(params) })), 'logs'); }
  catch (error) { handleApiError(error, 'Failed to load audit history.'); }
};

/* ------------------------------------------------------------------- products */

export const getAdminProducts = async (params) => {
  try {
    const response = await axiosInstance.get('/products', {
      params: cleanParams(params),
    });
    return toPageResult(unwrap(response), 'products');
  } catch (error) {
    handleApiError(error, 'Failed to load products.');
  }
};

export const createProduct = async (product) => {
  try {
    const response = await axiosInstance.post('/products', product);
    return unwrap(response);
  } catch (error) {
    handleApiError(error, 'Failed to create product.');
  }
};

export const updateProduct = async ({ id, ...product }) => {
  try {
    const response = await axiosInstance.put(`/products/${id}`, product);
    return unwrap(response);
  } catch (error) {
    handleApiError(error, 'Failed to update product.');
  }
};

export const deleteProduct = async (id) => {
  try {
    await axiosInstance.delete(`/products/${id}`);
    return id;
  } catch (error) {
    handleApiError(error, 'Failed to delete product.');
  }
};

/* ------------------------------------------------------------------ customers */

export const getUsers = async (params) => {
  try {
    const response = await axiosInstance.get('/users', {
      params: cleanParams(params),
    });
    return toPageResult(unwrap(response), 'users');
  } catch (error) {
    handleApiError(error, 'Failed to load customers.');
  }
};

export const updateUser = async ({ id, ...changes }) => {
  try {
    const response = await axiosInstance.put(`/users/${id}`, changes);
    return unwrap(response);
  } catch (error) {
    handleApiError(error, 'Failed to update customer.');
  }
};

export const deleteUser = async (id) => {
  try {
    await axiosInstance.delete(`/users/${id}`);
    return id;
  } catch (error) {
    handleApiError(error, 'Failed to delete customer.');
  }
};

/* ------------------------------------------------------------------ inventory */

export const getInventory = async (params) => {
  try {
    const response = await axiosInstance.get('/inventory', {
      params: cleanParams(params),
    });
    return toPageResult(unwrap(response), 'inventory');
  } catch (error) {
    handleApiError(error, 'Failed to load inventory.');
  }
};

export const getLowStock = async () => {
  try {
    const response = await axiosInstance.get('/inventory/low-stock');
    const payload = unwrap(response);
    return Array.isArray(payload) ? payload : payload?.inventory ?? [];
  } catch (error) {
    handleApiError(error, 'Failed to load low stock items.');
  }
};

export const getStockMovements = async (params) => {
  try {
    const response = await axiosInstance.get('/inventory/movements', {
      params: cleanParams(params),
    });
    return toPageResult(unwrap(response), 'movements');
  } catch (error) {
    handleApiError(error, 'Failed to load stock movements.');
  }
};

export const adjustStock = async ({ inventoryId, quantity, operation, reason, notes }) => {
  try {
    const response = await axiosInstance.post('/inventory/adjust', {
      inventoryId,
      quantity: Number(quantity),
      operation,
      reason,
      ...(notes && { notes }),
    });
    return unwrap(response);
  } catch (error) {
    handleApiError(error, 'Failed to adjust stock.');
  }
};

/* -------------------------------------------------------------------- coupons */

export const getCoupons = async (params) => {
  try {
    const response = await axiosInstance.get('/coupons', {
      params: cleanParams(params),
    });
    return toPageResult(unwrap(response), 'coupons');
  } catch (error) {
    handleApiError(error, 'Failed to load coupons.');
  }
};

export const createCoupon = async (coupon) => {
  try {
    const response = await axiosInstance.post('/coupons', coupon);
    return unwrap(response);
  } catch (error) {
    handleApiError(error, 'Failed to create coupon.');
  }
};

export const updateCoupon = async ({ id, ...coupon }) => {
  try {
    const response = await axiosInstance.put(`/coupons/${id}`, coupon);
    return unwrap(response);
  } catch (error) {
    handleApiError(error, 'Failed to update coupon.');
  }
};

export const toggleCoupon = async (id) => {
  try {
    const response = await axiosInstance.patch(`/coupons/${id}/toggle`);
    return unwrap(response);
  } catch (error) {
    handleApiError(error, 'Failed to toggle coupon.');
  }
};

export const deleteCoupon = async (id) => {
  try {
    await axiosInstance.delete(`/coupons/${id}`);
    return id;
  } catch (error) {
    handleApiError(error, 'Failed to delete coupon.');
  }
};

/* -------------------------------------------------------------------- reviews */

export const getAdminReviews = async (params) => {
  try {
    const response = await axiosInstance.get('/reviews', {
      params: cleanParams(params),
    });
    return toPageResult(unwrap(response), 'reviews');
  } catch (error) {
    handleApiError(error, 'Failed to load reviews.');
  }
};

export const deleteReview = async (id) => {
  try {
    await axiosInstance.delete(`/reviews/${id}`);
    return id;
  } catch (error) {
    handleApiError(error, 'Failed to delete review.');
  }
};

/* -------------------------------------------------------------------- reports */

/** Reports stream CSV/PDF, so they need a blob response rather than JSON. */
export const downloadReport = async (path, filename) => {
  try {
    const response = await axiosInstance.get(path, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    handleApiError(error, 'Failed to download report.');
  }
};
