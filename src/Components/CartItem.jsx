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
    const loadingItems = useSelector(state => state.cart.loadingItems);
    const [localQuantity, setLocalQuantity] = useState(cartItem.quantity);
    const [loadingAction, setLoadingAction] = useState(null); // 'increase', 'decrease', or null
    const [isRemoving, setIsRemoving] = useState(false);

    // Check if this specific item is loading
    const isItemLoading = loadingItems[cartItem.product.id];

    // Update local quantity when cartItem changes from parent
    useEffect(() => {
        setLocalQuantity(cartItem.quantity);
    }, [cartItem.quantity]);

    const handleQuantityChange = async (newQuantity, action) => {
        if (!user) {
            toast.error('Please login to manage your cart');
            navigate('/auth');
            return;
        }

        if (newQuantity < 1) {
            // Instead of decreasing to 0, remove the item completely
            handleRemoveItem();
            return;
        }

        if (isItemLoading) return;
        setLoadingAction(action);
        setLocalQuantity(newQuantity);
        
        try {
            await dispatch(addToCartAsync({
                productId: cartItem.product.id,
                quantity: newQuantity
            })).unwrap();
            await dispatch(getCartAsync()).unwrap();
        } catch (error) {
            setLocalQuantity(cartItem.quantity);
            toast.error(error.message || 'Failed to update cart');
        } finally {
            setLoadingAction(null);
        }
    }; 

    const handleRemoveItem = async () => {
        if (!user) {
            toast.error('Please login to manage your cart');
            navigate('/auth');
            return;
        }

        if (isRemoving) return;
        setIsRemoving(true);

        try {
            await dispatch(removeFromCartAsync(cartItem.product.id)).unwrap();
            await dispatch(getCartAsync()).unwrap();
        } catch (error) {
            toast.error(error.message || 'Failed to remove item');
        } finally {
            setIsRemoving(false);
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
                    <div className="text-center md:text-left">
                    <h3 className="text-sm md:text-base font-semibold">{cartItem.product.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-nowrap text-ellipsis w-[60px] md:w-[250px] overflow-hidden">
                        {cartItem.product.description}
                    </p>
                    </div>
                </div>
            </td>
            <td className="py-4 px-2 text-center">
                <p className="font-semibold text-sm md:text-base">
                    ${(cartItem.product.price || 0).toFixed(2)}
                </p>
            </td>
            <td className="py-4 px-2 text-center">
                <div className="flex flex-col space-y-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center space-x-2">
                        <button
                            onClick={() => handleQuantityChange(localQuantity - 1, 'decrease')}
                            className="px-2 py-2 flex place-items-center bg-gray-200 dark:bg-gray-700 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={loadingAction === 'decrease' || loadingAction === 'increase' || isRemoving}
                        >
                            {loadingAction === 'decrease' ? (
                                <Spinner className="w-2 h-2 md:w-4 md:h-4" />
                            ) : (
                                <FaMinus className='w-2 h-2 md:w-4 md:h-4'/>
                            )}
                        </button>
                        <span className="w-4 md:w-8 text-center font-medium text-sm md:text-base">
                            {localQuantity}
                        </span>
                        <button
                            onClick={() => handleQuantityChange(localQuantity + 1, 'increase')}
                            className="px-2 py-2 flex place-items-center bg-gray-200 dark:bg-gray-700 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={loadingAction === 'decrease' || loadingAction === 'increase' || isRemoving}
                        >
                            {loadingAction === 'increase' ? (
                                <Spinner className="w-2 h-2 md:w-4 md:h-4" />
                            ) : (
                                <FaPlus className='w-2 h-2 md:w-4 md:h-4'/>
                            )}
                        </button>
                    </div>
                    {/* Total Price */}
                    <p className="font-semibold text-sm md:text-base">
                        ${(cartItem.product.price * localQuantity || 0).toFixed(2)}
                    </p>
                </div>
            </td>
            <td className="py-4 px-2 text-center">
                <button
                    onClick={handleRemoveItem}
                    className="text-red-500 hover:text-red-600 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loadingAction === 'decrease' || loadingAction === 'increase' || isRemoving}
                >
                    {isRemoving ? (
                        <Spinner className="w-6 h-6" />
                    ) : (
                        <RiDeleteBack2Fill className='w-6 h-6 text-red-500 hover:text-red-600'/>
                    )}
                </button>
            </td>
        </tr>
    );
}

export default CartItem;