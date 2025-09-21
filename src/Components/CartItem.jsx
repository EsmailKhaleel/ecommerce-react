import { toast } from 'react-toastify';
import Spinner from '../Components/Spinner';
import { useState } from 'react';
import { FaPlus, FaMinus } from "react-icons/fa";
import { RiDeleteBack2Fill } from "react-icons/ri";
import useCartAction from '../hooks/cart/useCartAction';

function CartItem({ cartItem }) {
    const quantity = cartItem.quantity;
    const [loadingAction, setLoadingAction] = useState(null); // 'increase', 'decrease', or null

    const { handleAddToCart, isCartLoading, handleRemoveCartItem, isRemoving } = useCartAction(cartItem.product.id);

    const handleQuantityChange = async (newQuantity, action) => {
        if (newQuantity < 1) {
            handleRemoveCartItem();
            return;
        }
        setLoadingAction(action);
        try {
            await handleAddToCart(newQuantity);
        } catch (error) {
            toast.error(error.message || 'Failed to update cart');
        } finally {
            setLoadingAction(null);
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
                            onClick={() => handleQuantityChange(quantity - 1, 'decrease')}
                            className="px-2 py-2 flex place-items-center bg-gray-200 dark:bg-gray-700 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={loadingAction === 'decrease' || loadingAction === 'increase' || isRemoving || isCartLoading}
                        >
                            {loadingAction === 'decrease' ? (
                                <Spinner className="w-2 h-2 md:w-4 md:h-4" />
                            ) : (
                                <FaMinus className='w-2 h-2 md:w-4 md:h-4' />
                            )}
                        </button>
                        <span className="w-4 md:w-8 text-center font-medium text-sm md:text-base">
                            {quantity}
                        </span>
                        <button
                            onClick={() => handleQuantityChange(quantity + 1, 'increase')}
                            className="px-2 py-2 flex place-items-center bg-gray-200 dark:bg-gray-700 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={loadingAction === 'decrease' || loadingAction === 'increase' || isRemoving || isCartLoading}
                        >
                            {loadingAction === 'increase' ? (
                                <Spinner className="w-2 h-2 md:w-4 md:h-4" />
                            ) : (
                                <FaPlus className='w-2 h-2 md:w-4 md:h-4' />
                            )}
                        </button>
                    </div>
                    {/* Total Price */}
                    <p className="font-semibold text-sm md:text-base">
                        ${(cartItem.product.price * quantity || 0).toFixed(2)}
                    </p>
                </div>
            </td>
            <td className="py-4 px-2 text-center">
                <button
                    onClick={handleRemoveCartItem}
                    className="text-red-500 hover:text-red-600 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loadingAction === 'decrease' || loadingAction === 'increase' || isRemoving}
                >
                    {isRemoving ? (
                        <Spinner className="w-6 h-6" />
                    ) : (
                        <RiDeleteBack2Fill className='w-6 h-6 text-red-500 hover:text-red-600' />
                    )}
                </button>
            </td>
        </tr>
    );
}

export default CartItem;