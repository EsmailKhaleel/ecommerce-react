import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../StateManagement/Slices/CartSlice';
import axiosInstance from '../../services/axiosInstance';
import { toast } from 'react-toastify';

function Success() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState(null);
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const sessionId = searchParams.get('session_id');
                if (!sessionId) {
                    toast.error('Invalid checkout session');
                    navigate('/');
                    return;
                }

                // Clear the cart immediately
                dispatch(clearCart());

                // The webhook will handle creating the order
                // We just need to wait a bit to let the webhook process
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Check if the order was created
                const response = await axiosInstance.get(`/orders/latest`);
                if (response.data?.order) {
                    setOrder(response.data.order);
                }

                // Start redirect timer
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 5000);
            } catch (error) {
                console.error('Payment verification failed:', error);
                toast.error('Could not verify order. Please contact support.');
            } finally {
                setIsVerifying(false);
            }
        };

        verifySession();
    }, [dispatch, navigate, searchParams]);

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
                                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
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
                        Thank you for your purchase! A confirmation email has been sent to {order?.customerEmail}.
                    </p>
                    <p className="text-sm">
                        You will be redirected to the home page in a few seconds...
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

const format = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
}
