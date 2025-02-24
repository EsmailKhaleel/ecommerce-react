import React from 'react'
import { useNavigate } from 'react-router-dom';
import { addToCart, toggleFav } from '../StateManagement/Slices/CartSlice';
import { useDispatch } from 'react-redux';
import { BiHeart, BiShoppingBag, BiSolidHeart } from 'react-icons/bi';

function ProductCard({ product }) {
    const navigator = useNavigate();
    const dispatch = useDispatch();

    function showProduct(id) {
        navigator(`/products/${id}`);
    }
    function handleToggleFavorite(productId) {
        dispatch(toggleFav(productId));
    }
    function handleAddToCart(product){
        dispatch(addToCart(product));
    }

    return (
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 shadow-lg overflow-hidden transition-transform transform hover:scale-105 flex flex-col h-[420px]">
            <img src={product.image} alt={product.name} className="w-full h-40 object-contain p-4 dark:bg-gray-800 rounded-md"  />
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-black dark:text-white">{product.name}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">{product.description}</p>
                <div className="mt-auto">
                    <p className="mt-2 text-green-700 dark:text-gray-400 line-clamp-2">{product.price} EG</p>
                    <div className='flex gap-5'>
                        <button onClick={() => showProduct(product.id)} className="text-primary dark:text-secondary hover:text-secondary dark:hover:text-primary font-semibold inline-block cursor-pointer">View Product</button>
                        <button onClick={() => handleAddToCart(product)} className="flex items-center justify-center bg-violet-900 text-white hover:bg-blue-800 px-5 py-2 rounded-sm">
                            <BiShoppingBag className="mx-2" />
                            Add to cart
                        </button>
                    </div>
                    {/* Favorite Icon */}
                    <button
                        onClick={() => handleToggleFavorite(product.id)}
                        className="absolute top-2 right-2 text-gray-400 dark:text-gray-300 hover:text-red-500 transition"
                    >
                        {product.isFav ? (
                            <BiSolidHeart className="text-red-500 text-2xl" />
                        ) : (
                            <BiHeart className="text-2xl" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard