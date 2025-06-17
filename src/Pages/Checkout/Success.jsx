import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../StateManagement/Slices/CartSlice';
import axiosInstance from '../../utils/axiosInstance';
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
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
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
                            <p className="font-semibold mb-2">Order Details:</p>
                            <p>Order Status: {order.status}</p>
                            <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
                            <div className="mt-4">
                                <p className="font-semibold mb-2">Items:</p>
                                {order.products.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm">Qty: {item.quantity} × ${item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <p className="mb-8">
                        Thank you for your purchase! You will receive a confirmation email shortly.
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
