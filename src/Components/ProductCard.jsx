import { useNavigate } from 'react-router-dom';
import { addToCartAsync } from '../StateManagement/Slices/CartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { BiHeart, BiShoppingBag, BiSolidHeart } from 'react-icons/bi';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdLocalOffer } from 'react-icons/md';
import placeholderImage from '../assets/placeholder.jpg';
import { toast } from 'react-toastify';
import { useAuth } from '../Context/useAuth';
import { toggleWishlistItemAsync } from '../StateManagement/Slices/WishlistSlice';
import Spinner from './Spinner';
import { Rating } from './Rating';

function ProductCard({ product, onWishlistClick }) {
    const navigator = useNavigate();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const wishlistItems = useSelector(state => state.wishlist.items);
    const loadingItems = useSelector(state => state.wishlist.loadingItems);
    const isWishlistLoading = loadingItems[product.id];

    function showProduct(id) {
        navigator(`/products/${id}`);
    }

    const handleWishlistClick = async (e) => {
        e.stopPropagation();

        if (!user) {
            toast.error('Please login to manage your wishlist');
            return;
        }

        if (isWishlistLoading) return;

        if (onWishlistClick) {
            onWishlistClick();
        } else {
            try {
                await dispatch(toggleWishlistItemAsync(product.id)).unwrap();
            } catch (error) {
                console.error('Error toggling wishlist:', error);
            }
        }
    };

    async function handleAddToCart(product) {
        if (!user) {
            toast.error('Please login to add items to cart');
            navigator('/auth');
            return;
        }

        try {
            await dispatch(addToCartAsync({
                productId: product.id,
                quantity: 1
            })).unwrap();
            toast.success(`${product.name} has been added to your cart!`);
        } catch (error) {
            toast.error(error.message || 'Failed to add to cart');
        }
    }

    return (
        <div className="group bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl overflow-hidden transition-all duration-300 flex flex-col relative">
            {/* Discount Badge */}
            {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10 flex items-center gap-1">
                    <MdLocalOffer className="text-lg" />
                    Save {product.discount}%
                </div>
            )}

            {/* Favorite Button */}
            <button
                onClick={handleWishlistClick}
                className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:scale-110 transition-transform"
            >
                {wishlistItems.some(item => item.id === product.id) ? (
                    isWishlistLoading ?
                        <div className='w-6 h-6 flex items-center justify-center'>
                            <Spinner />
                        </div>
                        :
                        <BiSolidHeart className="text-red-500 text-xl" />
                ) : (
                    isWishlistLoading ?
                        <div className='w-6 h-6 flex items-center justify-center'>
                            <Spinner />
                        </div> :
                        <BiHeart className="text-gray-400 dark:text-gray-300 text-xl" />
                )}
            </button>

            {/* View Details Button */}
            <button
                onClick={() => showProduct(product.id)}
                className="absolute top-15 right-4 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:scale-110 transition-transform"
            >
                <MdOutlineRemoveRedEye className="text-gray-400 dark:text-gray-300 text-xl" />
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
            <div className="flex flex-col flex-grow md:p-3 p-2">
                {/* Product Details */}
                <div className='flex-grow'>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate">
                    {product.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1 text-nowrap text-ellipsis">
                    {product.description}
                </p>
                </div>

                {/* Price Section */}
                <div className="mb-2 flex justify-between items-center">
                    <div className="flex items-baseline gap-2">
                        <span className="text-md font-bold text-accent dark:text-accent">
                            $ {product.price.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex items-center">
                    <Rating rating={product.averageRating} />
                    </div>
                </div>

                <button
                    onClick={() => handleAddToCart(product)}
                    className="w-[150px] text-primary border border-primary hover:text-white dark:hover:text-white px-1 md:px-3 py-2 rounded-xl font-semibold
                                 hover:bg-primary transition-colors duration-300 flex items-center 
                                 justify-center gap-1.5 text-sm whitespace-nowrap"
                >
                    <BiShoppingBag className="text-lg flex-shrink-0" />
                    Add to Cart
                </button>
            </div>
        </div>
    );
}


export default ProductCard;
