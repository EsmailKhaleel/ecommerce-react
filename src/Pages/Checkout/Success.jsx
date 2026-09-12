import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCartAsync } from '../../StateManagement/Slices/CartSlice';
import axiosInstance from '../../services/axiosInstance';
import { format } from '../../utils/helpers';

function Success() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState(null);
    const [isVerifying, setIsVerifying] = useState(true);

    const [error, setError] = useState('');
    const [retry, setRetry] = useState(0);
    useEffect(() => {
        let stopped = false;
        let timer;
        const controller = new AbortController();
        let attempts = 0;
        setIsVerifying(true);
        setError('');
        const verify = async () => {
            try {
                const id = searchParams.get('session_id');
                if (!id) throw new Error('Missing checkout session. Open your account to view your orders.');
                const { data } = await axiosInstance.get('/stripe/sessions/' + encodeURIComponent(id), { signal: controller.signal });
                if (stopped) return;
                if (data.order?.paymentStatus === 'paid') {
                    setOrder(data.order);
                    sessionStorage.removeItem('checkout:' + data.order.userId);
                    dispatch(getCartAsync());
                    setIsVerifying(false);
                    return;
                }
                if (data.order?.status === 'cancelled') throw new Error('This checkout expired or was cancelled. Your cart is still available.');
                if (++attempts < 10) { timer = setTimeout(verify, 2000); return; }
                throw new Error('Payment confirmation is still pending. Check again shortly; do not pay again.');
            } catch (err) {
                if (stopped) return;
                setError(err.response?.data?.message || err.message || 'Could not verify this payment. Please retry.');
                setIsVerifying(false);
            }
        };
        verify();
        return () => { stopped = true; clearTimeout(timer); controller.abort(); };
    }, [dispatch, searchParams, retry]);

    if (error) return <div className="container mx-auto px-4 py-16 text-center" role="alert">
        <p className="mb-6">{error}</p>
        <button className="bg-primary text-white px-6 py-2 rounded-lg mr-4" onClick={() => setRetry(value => value + 1)}>Check again</button>
        <button onClick={() => navigate('/account')}>View my orders</button>
    </div>;

    if (isVerifying) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-600 dark:text-gray-300 mt-4">Processing your order...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="mb-6">
                    <svg 
                        className="w-16 h-16 text-green-500 mx-auto mb-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                    </svg>
                    <h1 className="text-4xl font-bold text-green-600 mb-4">
                        Order Confirmed!
                    </h1>
                </div>
                <div className="text-gray-600 dark:text-gray-300 space-y-4">
                    {order && (
                        <div className="text-left border-t border-b py-4 my-4">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="font-semibold">Order ID:</p>
                                    <p className="text-sm">{order._id}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Date:</p>
                                    <p className="text-sm">{format(new Date(order.createdAt), 'PPp')}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Status:</p>
                                    <p className="capitalize">
                                        <span className={`inline-block px-2 py-1 text-xs rounded ${
                                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold">Payment Status:</p>
                                    <p className="capitalize">
                                        <span className={`inline-block px-2 py-1 text-xs rounded ${
                                            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="font-semibold text-lg mb-3">Order Items:</h3>
                                <div className="space-y-4">
                                    {order.products.map((item) => (
                                        <div key={item._id} className="flex items-center gap-4 border-b pb-4">
                                            <img 
                                                src={item.image} 
                                                alt={item.name} 
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">{item.name}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Qty: {item.quantity} × ${item.price}
                                                    </p>
                                                    <p className="font-semibold">
                                                        ${(item.quantity * item.price).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 text-right">
                                <p className="text-lg font-semibold">
                                    Total Amount: ${order.totalAmount.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    )}
                    <p className="mb-8">
                        Thank you for your purchase! You can view this order in your account.
                    </p>
                    <p className="text-sm">
                        Keep your order ID for reference.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="mt-6 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition-colors"
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
}

export default Success;