import { useNavigate } from 'react-router-dom';
import { addToCart, toggleFav } from '../StateManagement/Slices/CartSlice';
import { useDispatch } from 'react-redux';
import { BiHeart, BiShoppingBag, BiSolidHeart } from 'react-icons/bi';
import { MdLocalOffer } from 'react-icons/md';
import PropTypes from 'prop-types';
import placeholderImage from '../assets/placeholder.jpg';
import { toast } from 'react-toastify';


function ProductCard({ product }) {
    const navigator = useNavigate();
    const dispatch = useDispatch();
    
    function showProduct(id) {
        navigator(`/products/${id}`);
    }

    function handleToggleFavorite(productId) {
        dispatch(toggleFav(productId));
        if (product.isFav) {
            toast.info(`${product.name} has been removed from your favorites!`);
        } else {
            toast.success(`${product.name} has been added to your favorites!`);
        }
    }

    function handleAddToCart(product) {
        dispatch(addToCart(product));
        toast.success(`${product.name} has been added to your cart!`);
    }

    return (
        <div className="group bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl overflow-hidden transition-all duration-300 flex flex-col h-[500px] relative">
            {/* Discount Badge */}
            {product.discount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10 flex items-center gap-1">
                    <MdLocalOffer className="text-lg" />
                    {product.discount}% OFF
                </div>
            )}
            
            {/* Category Tag */}
            <div className="absolute top-4 right-14 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-200 px-3 py-1 rounded-full text-xs capitalize z-10">
                {product.category}
            </div>

            {/* Favorite Button */}
            <button
                onClick={() => handleToggleFavorite(product.id)}
                className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:scale-110 transition-transform"
            >
                {product.isFav ? (
                    <BiSolidHeart className="text-red-500 text-xl" />
                ) : (
                    <BiHeart className="text-gray-400 dark:text-gray-300 text-xl" />
                )}
            </button>

            {/* Image Container */}
            <div className="relative overflow-hidden p-4 bg-gray-50 dark:bg-gray-800/50 h-64 group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors">
                <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = placeholderImage;
                    }}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-grow p-5">
                {/* Product Details */}
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate mb-2">
                        {product.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                        {product.description}
                    </p>
                </div>

                {/* Price Section */}
                <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-violet-900 dark:text-violet-400">
                            {product.price.toLocaleString()} EGP
                        </span>
                        {product.old_price && (
                            <span className="text-sm text-gray-500 line-through">
                                {product.old_price.toLocaleString()} EGP
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                        onClick={() => showProduct(product.id)}
                        className="w-full text-violet-900 dark:text-violet-400 font-semibold px-3 py-2 rounded-xl 
                                 border-2 border-violet-900 dark:border-violet-400 hover:bg-violet-900 
                                 hover:text-white dark:hover:bg-violet-400 dark:hover:text-gray-900 
                                 transition-colors duration-300 text-sm whitespace-nowrap"
                    >
                        View Details
                    </button>
                    <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-violet-900 text-white px-3 py-2 rounded-xl font-semibold
                                 hover:bg-violet-800 transition-colors duration-300 flex items-center 
                                 justify-center gap-1.5 text-sm whitespace-nowrap"
                    >
                        <BiShoppingBag className="text-lg flex-shrink-0" />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

ProductCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        old_price: PropTypes.number,
        discount: PropTypes.number,
        category: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(PropTypes.string),
        isFav: PropTypes.bool
    }).isRequired
};

export default ProductCard;
