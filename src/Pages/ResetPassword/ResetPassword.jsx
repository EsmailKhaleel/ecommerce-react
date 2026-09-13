import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);
  const submit = async event => {
    event.preventDefault();
    try { const response = await axiosInstance.post('/auth/reset-password', { token: params.get('token'), password }); setMessage(response.data.message); setDone(true); }
    catch (error) { setMessage(error.response?.data?.message || 'Reset link is invalid or expired.'); }
  };
  return <main className="customer-page customer-auth-page min-h-[70vh] grid place-items-center p-6"><form onSubmit={submit} className="customer-auth-card w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-lg p-8 space-y-5">
    <h1 className="text-2xl font-bold">Choose a new password</h1>
    {!done && <><input required minLength={8} maxLength={72} type="password" autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} className="w-full rounded-md border px-3 py-2 bg-transparent" placeholder="New password" /><button className="w-full rounded-md bg-black text-white py-3">Update password</button></>}
    {message && <p role="status">{message}</p>}
    {done && <Link to="/auth" className="underline">Sign in</Link>}
  </form></main>;
}
