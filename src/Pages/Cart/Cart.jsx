import EmptyCart from '../../assets/emptyCart.png';
import CartItem from '../../Components/CartItem';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../Context/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { setCart, getCartAsync } from '../../StateManagement/Slices/CartSlice';
import { PiExclamationMarkFill } from "react-icons/pi";
import Payment from '../../assets/payment.png';


function Cart() {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector(state => state.cart.items);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                if (user) {
                    await dispatch(getCartAsync()).unwrap();
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
                toast.error('Error loading cart');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
    }, [user, dispatch]);

    useEffect(() => {
        // Check URL for Stripe redirect status
        if (window.location.href.includes('/checkout/success')) {
            toast.success('Payment successful! Your order has been placed.');
            dispatch(setCart([])); // Clear cart after successful payment
            navigate('/', { replace: true });
        }

        if (window.location.href.includes('/cart?canceled=true')) {
            toast.info('Order canceled -- continue shopping and checkout when you\'re ready.');
            navigate('/cart', { replace: true });
        }
    }, [navigate, dispatch]);

    const handleCheckout = async () => {
        if (isProcessing) return;

        setIsProcessing(true);
        try {
            const response = await axiosInstance.post('/stripe/create-checkout-session', {
                userId: user._id,
                email: user.email,
                products: cartItems.map(item => ({
                    id: item.product.id,
                    amount: item.quantity
                }))
            });

            // Redirect to Stripe Checkout
            window.location.href = response.data.url;
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error.response?.data?.error || 'Error creating checkout session');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <img src={EmptyCart} alt="Empty Cart" className="w-64 h-64 mb-8" />
                <h2 className="text-2xl font-semibold mb-4 dark:text-white">Please login to view your cart</h2>
                <button
                    onClick={() => navigate('/auth')}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition-colors"
                >
                    Login now
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <img src={EmptyCart} alt="Empty Cart" className="w-64 h-64 mb-8" />
                <h2 className="text-2xl font-semibold mb-4 dark:text-white">Your Cart is Empty</h2>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition-colors"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    return (
        <div className="container mx-auto px-2 py-8 flex flex-col lg:flex-row gap-10 dark:text-stone-100">
            {/* Shopping Cart Section */}
            <div className="w-full lg:w-2/3">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Shopping Cart</h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="py-3 px-2 text-left">Product</th>
                                <th className="py-3 px-2 text-center">Price</th>
                                <th className="py-3 px-2 text-center">Quantity</th>
                                <th className="py-3 px-2 text-center">Total</th>
                                <th className="py-3 px-2 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {cartItems.map(item => (
                                <CartItem key={item._id} cartItem={item} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Checkout Section */}
            <div className="w-full lg:w-1/3 p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md h-fit">
                <h3 className="text-2xl font-bold mb-4">Checkout Summary</h3>
                <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                        <span>Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)}):</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
                <div className="flex gap-2 items-center mb-2 mx-auto text-sm dark:text-white">
                    <PiExclamationMarkFill />
                    Tax Included.
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
                    <img src={Payment} alt="Payment" className="w-full" />
                </div>
            </div>
        </div>
    );
}

export default Cart;
