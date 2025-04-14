import React from 'react';
import { removeFromCart, decreaseQuantity, addToCart } from '../StateManagement/Slices/CartSlice';
import { useDispatch } from 'react-redux';
function CartItem({ product }) {
    const dispatch = useDispatch();

    return (
        <div key={product.id} className="flex items-center border-b py-6">
            <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
            <div className="ml-6 flex-1">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="font-semibold mt-2">${product.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-2">
                <button onClick={() => dispatch(decreaseQuantity(product.id))} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md cursor-pointer">−</button>
                <span>{product.amount}</span>
                <button onClick={() => dispatch(addToCart(product))} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md cursor-pointer">+</button>
            </div>
            <button onClick={() => dispatch(removeFromCart(product.id))} className="ml-6 text-red-500 cursor-pointer">Remove</button>
        </div>
    )
}

export default CartItem;