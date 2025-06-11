import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../StateManagement/Slices/CartSlice';

function Success() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // Ensure cart is cleared
        dispatch(clearCart());
        
        // Redirect to home after 5 seconds
        const timer = setTimeout(() => {
            navigate('/', { replace: true });
        }, 5000);

        return () => clearTimeout(timer);
    }, [dispatch, navigate]);

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
                        Payment Successful!
                    </h1>
                </div>
                <div className="text-gray-600 dark:text-gray-300 space-y-4">                    <p className="mb-8">
                        Thank you for your purchase! Your order has been confirmed and you&apos;ll receive an email with the details shortly.
                    </p>
                    <p className="text-sm">
                        You will be redirected to the home page in a few seconds...
                    </p>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="mt-8 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
}

export default Success;
