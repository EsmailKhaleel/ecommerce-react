import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/useAuth';
import {
  createReferral, deleteNotification, getMyActivities, getMyInsights,
  getMyNotifications, getMyReferrals, getMyReferralStats, markAllNotificationsRead,
  markNotificationRead, updatePassword, updateProfile,
} from '../../services/commerceService';

const Panel = ({ title, children }) => <section className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6"><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">{title}</h2>{children}</section>;
const Field = props => <input {...props} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-3 dark:text-white" />;
const Button = ({ children, ...props }) => <button {...props} className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-white disabled:opacity-50">{children}</button>;

export function ProfileSettings() {
  const { user, setUser, setToken } = useAuth();
  const [details, setDetails] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  useEffect(() => setDetails({ name: user?.name || '', email: user?.email || '' }), [user]);
  const profile = useMutation({ mutationFn: updateProfile, onSuccess: data => { const next = data.user || data; setUser(current => ({ ...current, ...next })); toast.success('Profile updated'); }, onError: e => toast.error(e.message) });
  const password = useMutation({ mutationFn: updatePassword, onSuccess: data => { if (data.user) setUser(data.user); if (data.token) { localStorage.setItem('token', data.token); setToken(data.token); } setPasswords({ currentPassword: '', newPassword: '' }); toast.success('Password updated'); }, onError: e => toast.error(e.message) });
  return <div className="space-y-6"><Panel title="Profile details"><form className="grid gap-4 md:grid-cols-2" onSubmit={e => { e.preventDefault(); profile.mutate(details); }}><Field aria-label="Name" placeholder="Name" value={details.name} onChange={e => setDetails(v => ({ ...v, name: e.target.value }))} required /><Field type="email" aria-label="Email" placeholder="Email" value={details.email} onChange={e => setDetails(v => ({ ...v, email: e.target.value }))} required /><div><Button disabled={profile.isPending}>Save profile</Button></div></form></Panel>
    <Panel title="Change password"><form className="grid gap-4 md:grid-cols-2" onSubmit={e => { e.preventDefault(); password.mutate(passwords); }}><Field type="password" placeholder="Current password" value={passwords.currentPassword} onChange={e => setPasswords(v => ({ ...v, currentPassword: e.target.value }))} required /><Field type="password" minLength="8" placeholder="New password" value={passwords.newPassword} onChange={e => setPasswords(v => ({ ...v, newPassword: e.target.value }))} required /><div><Button disabled={password.isPending}>Update password</Button></div></form></Panel></div>;
}

export function NotificationsPanel() {
  const client = useQueryClient();
  const query = useQuery({ queryKey: ['account', 'notifications'], queryFn: () => getMyNotifications({ limit: 50 }) });
  const refresh = () => client.invalidateQueries({ queryKey: ['account', 'notifications'] });
  const action = useMutation({ mutationFn: ({ type, id, ids }) => type === 'delete' ? deleteNotification(id) : type === 'all' ? markAllNotificationsRead(ids) : markNotificationRead(id), onSuccess: refresh, onError: e => toast.error(e.message) });
  const notifications = Array.isArray(query.data) ? query.data : [];
  return <Panel title="Notifications"><div className="flex justify-end mb-4"><button className="text-primary font-semibold" onClick={() => action.mutate({ type: 'all', ids: notifications.filter(n => !n.isRead).map(n => n._id) })}>Mark all read</button></div><div className="space-y-3">{notifications.map(item => <article key={item._id} className={`rounded-xl border p-4 ${item.isRead ? 'border-gray-200 dark:border-gray-700' : 'border-primary bg-primary/5'}`}><div className="flex gap-4 justify-between"><div><div className="font-bold dark:text-white">{item.title}</div><p className="text-gray-600 dark:text-gray-300">{item.message}</p><small className="text-gray-500">{new Date(item.createdAt).toLocaleString()} · {item.category}</small></div><div className="flex gap-3 items-start">{!item.isRead && <button className="text-primary" onClick={() => action.mutate({ type: 'read', id: item._id })}>Read</button>}<button className="text-red-600" onClick={() => action.mutate({ type: 'delete', id: item._id })}>Delete</button></div></div></article>)}{!query.isLoading && !notifications.length && <p className="text-gray-500">You have no notifications.</p>}</div></Panel>;
}

export function ActivityPanel() {
  const activity = useQuery({ queryKey: ['account', 'activity'], queryFn: () => getMyActivities({ limit: 50 }) });
  const insights = useQuery({ queryKey: ['account', 'insights'], queryFn: () => getMyInsights({ days: 30 }) });
  const rows = Array.isArray(activity.data) ? activity.data : [];
  return <div className="space-y-6"><Panel title="Your 30-day insights"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(insights.data || {}).filter(([, value]) => ['string','number'].includes(typeof value)).map(([key, value]) => <div key={key} className="rounded-xl bg-gray-50 dark:bg-gray-700 p-4"><div className="text-sm text-gray-500 dark:text-gray-300">{key.replace(/([A-Z])/g, ' $1')}</div><div className="text-xl font-bold dark:text-white">{String(value)}</div></div>)}</div></Panel><Panel title="Recent activity"><div className="space-y-3">{rows.map(item => <div key={item._id} className="border-b border-gray-200 dark:border-gray-700 pb-3"><strong className="dark:text-white">{item.action || item.type}</strong><p className="text-gray-600 dark:text-gray-300">{item.description}</p><small className="text-gray-500">{new Date(item.createdAt).toLocaleString()}</small></div>)}{!activity.isLoading && !rows.length && <p className="text-gray-500">No activity recorded yet.</p>}</div></Panel></div>;
}

export function ReferralsPanel() {
  const client = useQueryClient(); const [email, setEmail] = useState('');
  const referrals = useQuery({ queryKey: ['account', 'referrals'], queryFn: () => getMyReferrals({ limit: 50 }) });
  const stats = useQuery({ queryKey: ['account', 'referral-stats'], queryFn: getMyReferralStats });
  const create = useMutation({ mutationFn: createReferral, onSuccess: () => { setEmail(''); toast.success('Referral invitation created'); client.invalidateQueries({ queryKey: ['account', 'referrals'] }); client.invalidateQueries({ queryKey: ['account', 'referral-stats'] }); }, onError: e => toast.error(e.message) });
  const rows = referrals.data?.referrals || [];
  return <div className="space-y-6"><Panel title="Refer a friend"><form className="flex flex-col sm:flex-row gap-3" onSubmit={e => { e.preventDefault(); create.mutate(email); }}><Field type="email" placeholder="Friend's email" value={email} onChange={e => setEmail(e.target.value)} required /><Button disabled={create.isPending}>Create invite</Button></form></Panel><Panel title="Referral rewards"><div className="grid gap-3 sm:grid-cols-3 mb-6">{Object.entries(stats.data || {}).filter(([, v]) => typeof v === 'number').map(([key, value]) => <div key={key} className="rounded-xl bg-gray-50 dark:bg-gray-700 p-4"><small className="text-gray-500 dark:text-gray-300">{key.replace(/([A-Z])/g, ' $1')}</small><div className="text-2xl font-bold dark:text-white">{value}</div></div>)}</div><div className="space-y-3">{rows.map(item => <div key={item._id} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex justify-between"><div><strong className="dark:text-white">{item.referredEmail}</strong><div className="text-sm text-gray-500">Code: {item.referralCode}</div></div><span className="capitalize text-primary font-semibold">{item.status}</span></div>)}{!rows.length && <p className="text-gray-500">No referrals yet.</p>}</div></Panel></div>;
}
