import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/useAuth';
import axiosInstance from '../../services/axiosInstance';
import Spinner from '../../Components/Spinner';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  const started = useRef(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const token = new URLSearchParams(window.location.hash.slice(1)).get('token');
    window.history.replaceState({}, '', window.location.pathname);
    if (!token) { setError('Missing sign-in token. Please sign in again.'); return; }
    localStorage.setItem('token', token);
    axiosInstance.get('/auth/me').then(({ data }) => {
      setToken(token);
      setUser(data.user);
      navigate('/products', { replace: true });
    }).catch(() => { localStorage.removeItem('token'); setError('Sign-in could not be verified. Please sign in again.'); });
  }, [navigate, setToken, setUser]);
  return <div className="min-h-screen flex flex-col gap-4 items-center justify-center" role="status">
    {error ? <><p>{error}</p><button onClick={() => navigate('/auth')}>Return to sign in</button></> : <><Spinner /><p>Verifying sign-in...</p></>}
  </div>;
}
