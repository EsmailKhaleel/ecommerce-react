import { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async event => {
    event.preventDefault(); setBusy(true);
    try { const response = await axiosInstance.post('/auth/forgot-password', { email }); setMessage(response.data.message); }
    catch { setMessage('Password reset is temporarily unavailable.'); }
    finally { setBusy(false); }
  };
  return <main className="customer-page customer-auth-page min-h-[70vh] grid place-items-center p-6"><form onSubmit={submit} className="customer-auth-card w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-lg p-8 space-y-5">
    <h1 className="text-2xl font-bold">Reset your password</h1>
    <p className="text-gray-500">Enter your account email and we will send a secure reset link.</p>
    <input required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} className="w-full rounded-md border px-3 py-2 bg-transparent" placeholder="Email address" />
    <button disabled={busy} className="w-full rounded-md bg-black text-white py-3 disabled:opacity-50">{busy ? 'Sending…' : 'Send reset link'}</button>
    {message && <p role="status">{message}</p>}
    <Link to="/auth" className="underline">Back to sign in</Link>
  </form></main>;
}
