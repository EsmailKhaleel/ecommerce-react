import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../Context/useAuth';
import { createCheckoutSession } from '../../services/authService';
import axiosInstance from '../../services/axiosInstance';

export default function useCheckout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items: cartItems, loadingItems, status } = useSelector(state => state.cart);
  const [isProcessing, setIsProcessing] = useState(false);
  const locked = useRef(false);
  const storageKey = `checkout:${user?._id}`;
  const cancelCheckout = async () => {
    if (locked.current) return;
    locked.current = true;
    setIsProcessing(true);
    try {
      await axiosInstance.post('/stripe/cancel-checkout');
      sessionStorage.removeItem(storageKey);
      toast.info('Previous checkout closed. You can check out again.');
      navigate('/cart', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Could not close checkout. Please retry.');
    } finally { locked.current = false; setIsProcessing(false); }
  };
  useEffect(() => {
    if (searchParams.get('canceled') === 'true') toast.info('Payment was not completed. Resume checkout or close it below to change your cart.');
  }, [searchParams]);
  const handleCheckout = async (couponCode = '') => {
    if (!user || locked.current || !cartItems.length || Object.keys(loadingItems).length || status.clearCart === 'loading') return;
    locked.current = true;
    setIsProcessing(true);
    try {
      let key = sessionStorage.getItem(storageKey);
      if (!key) { key = crypto.randomUUID(); sessionStorage.setItem(storageKey, key); }
      const response = await createCheckoutSession(cartItems, user, key, couponCode.trim());
      window.location.assign(response.data.url);
    } catch (error) {
      toast.error(error.message || 'Could not start checkout');
      locked.current = false;
      setIsProcessing(false);
    }
  };
  return { handleCheckout, cancelCheckout, isProcessing: isProcessing || Object.keys(loadingItems).length > 0 || status.clearCart === 'loading' };
}
