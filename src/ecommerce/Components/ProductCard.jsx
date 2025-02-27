import React from 'react';
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

    function handleAddToCart(product) {
        dispatch(addToCart(product));
    }

    return (
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 hover:shadow-lg overflow-hidden transition-transform transform hover:scale-105 flex flex-col h-[450px] sm:h-[480px] md:h-[500px] p-4 relative">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 sm:h-48 md:h-56 object-contain p-4 dark:bg-gray-800 rounded-md"
            />
            <div className="flex flex-col flex-grow p-4">
                <h3 className="text-lg font-semibold text-black dark:text-white truncate">{product.name}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base line-clamp-2">{product.description}</p>
                <div className="mt-auto">
                    <p className="mt-2 text-green-700 dark:text-gray-400 font-bold">{product.price} EG</p>
                    {/* Buttons */}
                    <div className="flex flex-wrap gap-3 mt-4">
                        <button
                            onClick={() => showProduct(product.id)}
                            className="text-primary dark:text-secondary hover:text-secondary dark:hover:text-primary font-semibold"
                        >
                            View Product
                        </button>

                        <button
                            onClick={() => handleAddToCart(product)}
                            className="flex items-center justify-center bg-violet-900 text-white hover:bg-blue-800 px-4 sm:px-5 py-2 rounded-md w-full sm:w-auto"
                        >
                            <BiShoppingBag className="mr-2" />
                            Add to cart
                        </button>
                    </div>
                </div>
                {/* Favorite Icon */}
                <button
                    onClick={() => handleToggleFavorite(product.id)}
                    className="absolute top-3 right-3 text-gray-400 dark:text-gray-300 hover:text-red-500 transition"
                >
                    {product.isFav ? (
                        <BiSolidHeart className="text-red-500 text-2xl" />
                    ) : (
                        <BiHeart className="text-2xl" />
                    )}
                </button>
            </div>
        </div>
    )
}

export default ProductCard;
