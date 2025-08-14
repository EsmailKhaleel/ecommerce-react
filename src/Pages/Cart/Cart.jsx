import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/useAuth';
import { useCart } from '../../features/cart/useCart';
import EmptyCart from '../../features/cart/EmptyCart';
import SpinnerBig from '../../Components/SpinnerBig';
import CartTable from '../../features/cart/CartTable';
import CartSummary from '../../features/cart/CartSummary';


function Cart() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { items: cartItems, isLoading, totalPrice, cartItemsNumber } = useCart();

    if (!user) return (
        <EmptyCart
            message={"Please login to view your cart"}
            actionLabel={"Login Now"}
            onAction={() => navigate('/auth')} />
    );

    if (isLoading) return (<div className="flex justify-center items-center min-h-screen"><SpinnerBig /></div>);

    if (!cartItems || cartItems.length === 0) return (
        <EmptyCart
            message={"Your Cart is Empty"}
            actionLabel={"Continue Shopping"}
            onAction={() => navigate('/products')}
        />
    );

    return (
        <div className="container mx-auto px-2 py-8 flex flex-col lg:flex-row gap-10 dark:text-stone-100">
            <CartTable cartItems={cartItems} />
            <CartSummary totalPrice={totalPrice} cartItemsNumber={cartItemsNumber} />
        </div>
    );
}

export default Cart;
