import { useDispatch, useSelector } from 'react-redux';
import { addToCartAsync, getCartAsync, removeFromCartAsync } from '../StateManagement/Slices/CartSlice';
import { useAuth } from '../Context/useAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Components/Spinner';
import { useState, useEffect } from 'react';
import { FaPlus, FaMinus } from "react-icons/fa";
import { RiDeleteBack2Fill } from "react-icons/ri";



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
        <tr className="border-b dark:border-gray-700">
            <td className="py-4 px-2">
                <div className="flex md:flex-row flex-col place-items-center md:space-x-4">
                    <img
                        src={cartItem.product.image}
                        alt={cartItem.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                    <h3 className="text-sm md:text-base font-semibold">{cartItem.product.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-nowrap text-ellipsis w-[60px] md:w-[250px] overflow-hidden">
                        {cartItem.product.description}
                    </p>
                    </div>
                </div>
            </td>
            <td className="py-4 px-2 text-center">
                <p className="font-semibold text-nowrap text-ellipsis w-[60px] md:w-full overflow-hidden">
                    ${(cartItem.product.price || 0).toFixed(2)}
                    </p>
            </td>
            <td className="py-4 px-2">
                <div className="flex items-center justify-center space-x-2">
                    <button
                        onClick={() => handleQuantityChange(localQuantity - 1)}
                        className="px-2 py-2 flex place-items-center bg-gray-200 dark:bg-gray-700 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={cartStatus.addToCart === 'loading'}
                    >
                        <FaMinus className='w-2 h-2 md:w-4 md:h-4'/>
                    </button>
                    <span className="w-4 md:w-8 text-center">{localQuantity}</span>
                    <button
                        onClick={() => handleQuantityChange(localQuantity + 1)}
                        className="px-2 py-2 flex place-items-center bg-gray-200 dark:bg-gray-700 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={cartStatus.addToCart === 'loading'}
                    >
                        <FaPlus className='w-2 h-2 md:w-4 md:h-4'/>
                    </button>
                </div>
            </td>
            <td className="py-4 px-2 text-center">
                <p className="font-semibold text-nowrap text-ellipsis w-[60px] md:w-full overflow-hidden">
                    ${(cartItem.product.price * localQuantity || 0).toFixed(2)}
                </p>
            </td>
            <td className="py-4 px-2 text-center">
                <button
                    onClick={handleRemoveItem}
                    className="text-red-500 hover:text-red-600 cursor-pointer transition-colors"
                    disabled={cartStatus.removeFromCart === 'loading'}
                >
                    {cartStatus.removeFromCart === 'loading' ? <Spinner /> : 
                    <RiDeleteBack2Fill className='w-6 h-6 text-red-500 hover:text-red-600'/>}
                </button>
            </td>
        </tr>
    );
}

export default CartItem;