import { useDispatch, useSelector } from 'react-redux';
import { addToCartAsync, getCartAsync, removeFromCartAsync } from '../StateManagement/Slices/CartSlice';
import { useAuth } from '../Context/useAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Components/Spinner';
import { useState, useEffect } from 'react';

function CartItem({ cartItem }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useAuth();
    const cartStatus = useSelector(state => state.cart.status);
    const [localQuantity, setLocalQuantity] = useState(cartItem.quantity);

    // Update local quantity when cartItem changes from parent
    useEffect(() => {
        setLocalQuantity(cartItem.quantity);
    }, [cartItem.quantity]);

    const handleQuantityChange = async (newQuantity) => {
        if (!user) {
            toast.error('Please login to manage your cart');
            navigate('/auth');
            return;
        }

        if (newQuantity < 1) {
            handleRemoveItem();
            return;
        }

        // Optimistically update the local quantity
        setLocalQuantity(newQuantity);

        try {
            await dispatch(addToCartAsync({
                productId: cartItem.product.id,
                quantity: newQuantity
            })).unwrap();
            await dispatch(getCartAsync()).unwrap();
        } catch (error) {
            // Revert to the previous quantity on error
            setLocalQuantity(cartItem.quantity);
            toast.error(error.message || 'Failed to update cart');
        }
    }; 

    const handleRemoveItem = async () => {
        if (!user) {
            toast.error('Please login to manage your cart');
            navigate('/auth');
            return;
        }
        try {
            await dispatch(removeFromCartAsync(cartItem.product.id)).unwrap();
            await dispatch(getCartAsync()).unwrap();
        } catch (error) {
            toast.error(error.message || 'Failed to remove item');
        }
    };

    return (
        <div key={cartItem.product.id} className="flex items-center border-b py-6">
            <img
                src={cartItem.product.image}
                alt={cartItem.product.name}
                className="w-24 h-24 object-cover rounded-md"
            />
            <div className="ml-6 flex-1">
                <h3 className="text-lg font-semibold">{cartItem.product.name}</h3>
                <p className="font-semibold mt-2">${(cartItem.product.price || 0).toFixed(2)}</p>
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => handleQuantityChange(localQuantity - 1)}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={cartStatus.addToCart === 'loading'}
                >
                    −
                </button>
                <span>{localQuantity}</span>
                <button
                    onClick={() => handleQuantityChange(localQuantity + 1)}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={cartStatus.addToCart === 'loading'}
                >
                    +
                </button>
            </div>
            <button
                onClick={handleRemoveItem}
                className="ml-6 text-red-500 hover:text-red-600 cursor-pointer transition-colors"
                disabled={cartStatus.removeFromCart === 'loading'}
            >
                {cartStatus.removeFromCart === 'loading' ? <Spinner /> : 'Remove'}
            </button>
        </div>
    );
}

export default CartItem;