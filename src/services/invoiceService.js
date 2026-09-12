import axiosInstance from './axiosInstance';
import { handleApiError } from './apiError';

export const downloadInvoice = async (invoiceId, invoiceNumber = 'invoice') => {
  try {
    const response = await axiosInstance.get(`/invoices/${invoiceId}/pdf`, { responseType: 'blob' });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (error) { handleApiError(error, 'Failed to download invoice.'); }
};

export const requestRefund = async (orderId, reason) => {
  try { return (await axiosInstance.post(`/orders/${orderId}/refund`, { reason })).data; }
  catch (error) { handleApiError(error, 'Failed to request refund.'); }
};

export const createReturn = async (order, reason) => {
  try {
    return (await axiosInstance.post('/returns', {
      orderId: order._id,
      reason,
      items: order.products.map(item => ({ orderItemId: item._id, quantity: item.quantity, resolution: 'refund' })),
    })).data;
  } catch (error) { handleApiError(error, 'Failed to create return.'); }
};
