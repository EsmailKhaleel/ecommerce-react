import { useCheckout, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const checkout = useCheckout();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setIsProcessing(true);

        try {
            const result = await checkout.confirm();

            if (result.error) {
                setError(result.error.message);
            } else {
                // Payment successful
                navigate('/success');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            console.error('Payment error:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                Complete Your Payment
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <PaymentElement />
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-black text-white py-3 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                >
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
            </form>
        </div>
    );
};

export default Checkout;