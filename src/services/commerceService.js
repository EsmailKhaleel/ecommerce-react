import axiosInstance from './axiosInstance';
import { handleApiError } from './apiError';

const unwrap = response => response.data?.data ?? response.data;
const call = async (request, fallback) => {
  try { return unwrap(await request()); }
  catch (error) { handleApiError(error, fallback); }
};

export const updateProfile = details => call(() => axiosInstance.put('/auth/updatedetails', details), 'Could not update your profile.');
export const updatePassword = passwords => call(() => axiosInstance.put('/auth/updatepassword', passwords), 'Could not update your password.');
export const cancelOrder = orderId => call(() => axiosInstance.post(`/orders/${orderId}/cancel`), 'Could not cancel this order.');

export const getMyNotifications = params => call(() => axiosInstance.get('/notifications/my', { params }), 'Could not load notifications.');
export const markNotificationRead = id => call(() => axiosInstance.patch(`/notifications/${id}/read`), 'Could not update notification.');
export const markAllNotificationsRead = ids => call(() => axiosInstance.patch('/notifications/mark-read', ids?.length ? { notificationIds: ids } : {}), 'Could not update notifications.');
export const deleteNotification = id => call(() => axiosInstance.delete(`/notifications/${id}`), 'Could not delete notification.');
export const getMyActivities = params => call(() => axiosInstance.get('/activities/my', { params }), 'Could not load activity.');
export const getMyInsights = params => call(() => axiosInstance.get('/activities/my/insights', { params }), 'Could not load insights.');
export const getMyReferrals = params => call(() => axiosInstance.get('/referrals/my', { params }), 'Could not load referrals.');
export const getMyReferralStats = () => call(() => axiosInstance.get('/referrals/my/stats'), 'Could not load referral stats.');
export const createReferral = referredEmail => call(() => axiosInstance.post('/referrals', { referredEmail, source: 'direct' }), 'Could not create referral.');

export const subscribeNewsletter = email => call(() => axiosInstance.post('/newsletter/subscribe', { email, source: 'website' }), 'Could not subscribe.');
export const unsubscribeNewsletter = email => call(() => axiosInstance.post('/newsletter/unsubscribe', { email }), 'Could not unsubscribe.');

export const getCustomerGroups = params => call(() => axiosInstance.get('/customer-groups', { params }), 'Could not load customer groups.');
export const createCustomerGroup = payload => call(() => axiosInstance.post('/customer-groups', payload), 'Could not create customer group.');
export const updateCustomerGroup = ({ id, ...payload }) => call(() => axiosInstance.put(`/customer-groups/${id}`, payload), 'Could not update customer group.');
export const deleteCustomerGroup = id => call(() => axiosInstance.delete(`/customer-groups/${id}`), 'Could not delete customer group.');
export const autoAssignCustomerGroups = () => call(() => axiosInstance.post('/customer-groups/auto-assign'), 'Could not assign customer groups.');

export const getVariants = params => call(() => axiosInstance.get('/product-variants', { params }), 'Could not load product variants.');
export const createVariant = payload => call(() => axiosInstance.post('/product-variants', payload), 'Could not create variant.');
export const updateVariantStock = ({ id, stock }) => call(() => axiosInstance.patch(`/product-variants/${id}/stock`, { stock }), 'Could not update variant stock.');
export const deleteVariant = id => call(() => axiosInstance.delete(`/product-variants/${id}`), 'Could not delete variant.');

export const getNotificationAnalytics = () => call(() => axiosInstance.get('/notifications/analytics'), 'Could not load notification analytics.');
export const notifyGroup = payload => call(() => axiosInstance.post('/notifications/group', payload), 'Could not create notifications.');
export const sendScheduledNotifications = () => call(() => axiosInstance.post('/notifications/send'), 'Could not send scheduled notifications.');
export const getAllReferrals = params => call(() => axiosInstance.get('/referrals', { params }), 'Could not load referrals.');
export const getWebhookLogs = params => call(() => axiosInstance.get('/webhooks/logs', { params }), 'Could not load webhook logs.');
