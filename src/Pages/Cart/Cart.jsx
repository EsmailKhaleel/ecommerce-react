import { useSelector } from 'react-redux';
import EmptyCart from '../../assets/emptyCart.png';
import CartItem from '../../Components/CartItem';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../StateManagement/Slices/CartSlice';

function Cart() {
    const cart = useSelector((state) => state.cart.cartProducts);
    const [isProcessing, setIsProcessing] = useState(false);    const navigate = useNavigate();
    const dispatch = useDispatch();useEffect(() => {
        // Check URL for Stripe redirect status
        if (window.location.href.includes('/success')) {
            toast.success('Payment successful! Your order has been placed.');
            dispatch(clearCart());
            navigate('/', { replace: true });
        }

        if (window.location.href.includes('/cart?canceled=true')) {
            toast.info('Order canceled -- continue shopping and checkout when you\'re ready.');
            navigate('/cart', { replace: true });
        }
    }, [dispatch, navigate]);

    const handleCheckout = async () => {
        if (isProcessing) return;
        
        setIsProcessing(true);
        try { 
                const response = await fetch(`${import.meta.env.VITE_API_URL}/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    { 
                        products: cart
                    }
                ),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const { url } = await response.json();
            
            // Redirect to Stripe Checkout
            window.location.href = url;
        } catch (error) {
            toast.error('Failed to initialize checkout. Please try again.');
            console.error('Checkout Error:', error);
            setIsProcessing(false);
        }
    };

    const subtotal = cart.reduce((acc, product) => acc + product.price * product.amount, 0);
    const tax = subtotal * 0.094;
    const total = subtotal + tax;    if (cart.length === 0) {
        return (
            <div className='flex flex-col justify-center items-center mt-10'>
                <img src={EmptyCart} className='w-[30%] min-w-40' alt="Empty Cart" />
                <h3 className='text-3xl font-bold text-gray-700 dark:text-secondary m-10'>Your cart is Empty!</h3>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 lg:px-16 py-8 flex flex-col lg:flex-row gap-10 dark:text-stone-100">
            {/* Shopping Cart Section */}
            <div className="w-full lg:w-2/3">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Shopping Cart</h2>
                
                {cart.map(product => (
                    <CartItem key={product.id} product={product}/>
                ))}

                {/* Subtotal, Tax & Total */}
                <div className="mt-6 text-lg">
                    <p>Subtotal: <span className="font-semibold">${subtotal.toFixed(2)}</span></p>
                    <p>Sales Tax: <span className="font-semibold">${tax.toFixed(2)}</span></p>
                    <p className="text-xl font-bold mt-2">Total: <span>${total.toFixed(2)}</span></p>
                </div>
            </div>

            {/* Checkout Section */}
            <div className="w-full lg:w-1/3 p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md">
                <h3 className="text-2xl font-bold mb-4">Checkout Summary</h3>
                <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                        <span>Items ({cart.reduce((acc, item) => acc + item.amount, 0)}):</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
                <button 
                    onClick={handleCheckout} 
                    disabled={isProcessing}
                    className="w-full bg-black text-white py-3 rounded-md mb-4 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    {isProcessing ? (
                        <>
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                            <span>Processing...</span>
                        </>
                    ) : (
                        'Proceed to Checkout'
                    )}
                </button>
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                    <p className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Secure checkout powered by Stripe
                    </p>
                    <p className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        SSL encrypted payment
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Cart;
