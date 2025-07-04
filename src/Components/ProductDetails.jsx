import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BiHeart, BiSolidHeart, BiShoppingBag, BiError, BiShare, BiCar, BiShield, BiRefresh, BiArrowBack, BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync } from "../StateManagement/Slices/CartSlice";
import { toggleWishlistItemAsync } from "../StateManagement/Slices/WishlistSlice";
import axiosInstance from "../utils/axiosInstance";
import ProductCardSkeleton from "./ProductCardSkeleton";
import Spinner from "./Spinner";
import placeholderImage from '../assets/unavailable.png';
import Reviews from './Reviews';
import { toast } from "react-toastify";
import { useAuth } from "../Context/useAuth";
import { Rating } from "./Rating";
import ProductCard from "./ProductCard";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";

function ProductDetails() {
    const [isDetailsShown, setIsDetailsShown] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const relatedProductsRef = useRef(null);
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useAuth();

    const wishlistItems = useSelector(state => state.wishlist.items);
    const loadingItems = useSelector(state => state.wishlist.loadingItems);
    const cartLoadingItems = useSelector(state => state.cart.loadingItems);
    const cartItems = useSelector(state => state.cart.items);
    const isWishlistLoading = loadingItems[id];
    const isCartLoading = cartLoadingItems[id];

    // Find current product in cart and sync with Redux
    const cartProduct = cartItems.find(item => item.product === id);
    const currentQuantity = cartProduct ? cartProduct.quantity : 0;

    // Query product details
    const { data: product, error, isLoading } = useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/products/${id}`);
            return data;
        },
    });

    // Query related products
    const { data: relatedProducts, isLoading: relatedLoading } = useQuery({
        queryKey: ["relatedProducts", product?.category],
        queryFn: async () => {
            if (!product?.category) return [];
            const { data } = await axiosInstance.get(`/products?category=${product.category}&limit=8`);
            // Filter out the current product from related products
            return data.products.filter(p => p.id !== product.id);
        },
        enabled: !!product?.category,
    });

    const handleAddToCart = async (newQuantity) => {
        if (!user) {
            toast.error('Please login to add items to cart');
            navigate('/auth');
            return;
        }

        if (isCartLoading) return;

        try {
            await dispatch(addToCartAsync({
                productId: id,
                quantity: newQuantity
            })).unwrap();
        } catch (error) {
            console.log(`Failed to add item to cart ${error}`)
        }
    };

    const handleToggleWishlist = async () => {
        if (!user) {
            toast.error('Please login to manage your wishlist');
            navigate('/auth');
            return;
        }

        if (isWishlistLoading) return;

        try {
            await dispatch(toggleWishlistItemAsync(id)).unwrap();
            toast.success(wishlistItems.some(item => item.id === id)
                ? 'Product removed from wishlist!'
                : 'Product added to wishlist!');
        } catch (error) {
            toast.error(error.message || 'Failed to update wishlist');
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    const scrollRelatedProducts = (direction) => {
        if (relatedProductsRef.current) {
            const scrollAmount = 280; // Width of one product card + gap
            const currentScroll = relatedProductsRef.current.scrollLeft;
            const newScroll = direction === 'left'
                ? currentScroll - scrollAmount
                : currentScroll + scrollAmount;

            relatedProductsRef.current.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
        }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-4">
                <ProductCardSkeleton />
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <BiError className="mx-auto text-red-500 text-4xl mb-2" />
                <p className="text-red-500">Error loading product</p>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile Back Button */}
            <div className="lg:hidden sticky top-0 z-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 py-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                    >
                        <BiArrowBack className="text-lg" />
                        <span className="text-sm">Back</span>
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-4">
                {/* Breadcrumb Navigation - Desktop Only */}
                <motion.nav
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="hidden lg:block mb-4"
                >
                    <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <li>
                            <button
                                onClick={() => navigate('/')}
                                className="hover:text-primary transition-colors"
                            >
                                Home
                            </button>
                        </li>
                        <li>/</li>
                        <li>
                            <button
                                onClick={() => navigate('/products')}
                                className="hover:text-primary transition-colors"
                            >
                                Products
                            </button>
                        </li>
                        <li>/</li>
                        <li>
                            <button
                                onClick={() => navigate(`/products?category=${product.category}`)}
                                className="hover:text-primary transition-colors capitalize"
                            >
                                {product.category}
                            </button>
                        </li>
                        <li>/</li>
                        <li className="text-gray-800 dark:text-white font-medium truncate max-w-[200px]">
                            {product.name}
                        </li>
                    </ol>
                </motion.nav>

                {/* Main Product Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Image Gallery Section */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex gap-5 flex-row-reverse justify-end"
                    >
                        {/* Main Product Image */}
                        <motion.div
                            layoutId={`product-image-${product.id}`}
                            className="w-[450px] h-[450px] dark:bg-gray-800 rounded-lg overflow-hidden mb-4 flex items-center justify-center"
                        >
                            <motion.img
                                key={selectedImage || product.image}
                                src={selectedImage || product.image}
                                alt={product.name}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = placeholderImage;
                                }}
                                className="w-[450px] h-[450px] object-contain p-2"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.div>

                        {/* Thumbnail Gallery */}
                        {product.images && product.images.length > 1 && (
                            <div className="p-1 flex flex-col gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                                <AnimatePresence>
                                    {product.images?.map((image, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`relative rounded overflow-hidden flex-shrink-0 cursor-pointer
                                                ${selectedImage === image ? 'ring-2 ring-primary' : 'ring-1 ring-gray-200 dark:ring-gray-600'}`}
                                            onClick={() => setSelectedImage(image)}
                                        >
                                            <motion.img
                                                src={image}
                                                alt={`${product.name} view ${index + 1}`}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = placeholderImage;
                                                }}
                                                className="w-14 h-14 sm:w-16 sm:h-16 object-contain bg-white dark:bg-gray-800"
                                                transition={{ duration: 0.2 }}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info Section - Sticky on Desktop */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="order-2 lg:order-2 lg:sticky lg:top-8 lg:self-start"
                    >
                        <div className="rounded-lg p-4 lg:p-6">
                            {/* Product Title */}
                            <motion.h1
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-3"
                            >
                                {product.name}
                            </motion.h1>

                            {/* Price and Discount */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mb-4"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <p className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary-light">
                                        ${product.price.toFixed(2)}
                                    </p>
                                    {product.old_price > product.price && (
                                        <span className="text-base text-gray-400 line-through">
                                            ${product.old_price.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                {product.old_price > product.price && (
                                    <span className="inline-block px-2 py-1 text-xs font-bold text-white bg-red-500 rounded">
                                        {Math.round(((product.old_price - product.price) / product.old_price) * 100)}% OFF
                                    </span>
                                )}
                            </motion.div>

                            {/* Rating */}
                            <div className="flex items-center gap-3 mb-4">
                                <Rating rating={product.averageRating} />
                                <span className="text-gray-600 dark:text-gray-400 text-sm">
                                    {product.numReviews} reviews
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="space-y-2 mb-4"
                            >
                                <div className="grid grid-cols-2 gap-2">
                                    <motion.button
                                        className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white px-4 py-3 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => handleAddToCart(currentQuantity + 1)}
                                        disabled={isCartLoading}
                                    >
                                        {isCartLoading ? (
                                            <Spinner className="w-5 h-5" />
                                        ) : (
                                            <>
                                                <MdOutlineShoppingCartCheckout className="text-lg" />
                                                Add to Cart
                                            </>
                                        )}
                                    </motion.button>

                                    <motion.button
                                        onClick={() => navigate('/cart')}
                                        className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-3 rounded font-medium transition-colors"
                                    >
                                        <BiShoppingBag className="text-lg" />
                                        Check Cart
                                    </motion.button>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <motion.button
                                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleToggleWishlist}
                                        disabled={isWishlistLoading}
                                    >
                                        {isWishlistLoading ? (
                                            <Spinner className="w-4 h-4" />
                                        ) : (
                                            <>
                                                {wishlistItems.some(item => item.id === id) ? (
                                                    <BiSolidHeart className="text-base" />
                                                ) : (
                                                    <BiHeart className="text-base" />
                                                )}
                                                <span className="hidden sm:inline text-sm">
                                                    {wishlistItems.some(item => item.id === id) ? 'Remove' : 'Wishlist'}
                                                </span>
                                            </>
                                        )}
                                    </motion.button>

                                    <motion.button
                                        onClick={handleShare}
                                        className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded transition-colors"
                                    >
                                        <BiShare className="text-base" />
                                        <span className="hidden sm:inline text-sm">Share</span>
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Shipping & Benefits */}
                            <div className="sm:flex sm:justify-between sm:gap-3 space-y-3 py-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                    <BiCar className="text-lg text-primary" />
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-white text-sm">Free Shipping</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">On orders over $50</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BiShield className="text-lg text-primary" />
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-white text-sm">Secure Payment</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">100% secure checkout</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BiRefresh className="text-lg text-primary" />
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-white text-sm">Easy Returns</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">30 day return policy</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Product Description Section */}
                <motion.section
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6">
                        <button
                            onClick={() => setIsDetailsShown(!isDetailsShown)}
                            className="w-full flex items-center justify-between text-left"
                        >
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Product Details</h2>
                            <motion.span
                                animate={{ rotate: isDetailsShown ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-gray-400"
                            >
                                ▼
                            </motion.span>
                        </button>

                        <AnimatePresence>
                            {isDetailsShown && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <p className="text-gray-600 dark:text-gray-100 leading-relaxed mt-3">
                                        {product.description}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.section>

                {/* Related Products Section */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <motion.section
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-6"
                    >
                        <div className="rounded-lg">
                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                                    Related Products
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    You might also like these products from the same category
                                </p>
                            </div>

                            {relatedLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {[...Array(4)].map((_, index) => (
                                        <ProductCardSkeleton key={index} />
                                    ))}
                                </div>
                            ) : (
                                <div className="relative">
                                    {/* Navigation Buttons */}
                                    <button
                                        onClick={() => scrollRelatedProducts('left')}
                                        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <BiChevronLeft className="text-xl text-gray-600 dark:text-gray-400" />
                                    </button>

                                    <button
                                        onClick={() => scrollRelatedProducts('right')}
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <BiChevronRight className="text-xl text-gray-600 dark:text-gray-400" />
                                    </button>

                                    {/* Products Container */}
                                    <div
                                        ref={relatedProductsRef}
                                        className="flex gap-4 overflow-x-hidden scroll-smooth"
                                    >
                                        {relatedProducts.map((relatedProduct) => (
                                            <div key={relatedProduct.id} className="w-56 flex-shrink-0">
                                                <ProductCard product={relatedProduct} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.section>
                )}


                {/* Reviews Section */}
                <motion.section
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-6"
                >
                    <Reviews productId={product.id} />
                </motion.section>

            </div>
        </div>
    );
}

export default ProductDetails;
