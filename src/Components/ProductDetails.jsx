import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BiHeart, BiShoppingBag, BiError } from 'react-icons/bi';
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync } from "../StateManagement/Slices/CartSlice";
import axiosInstance from "../utils/axiosInstance";
import ProductCardSkeleton from "./ProductCardSkeleton";
import placeholderImage from '../assets/placeholder.jpg';
import Reviews from './Reviews';
import { toast } from "react-toastify";
import { useAuth } from "../Context/useAuth";

function ProductDetails() {
    const [isDetailsShown, setIsDetailsShown] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Query product details
    const { data: product, error, isLoading } = useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/products/${id}`);
            return data;
        },
    });

    const cartItems = useSelector((state) => state.cart.items);
    const cartProduct = cartItems.find((item) => item.product._id === id);
    const isFavorite = user?.favorites?.includes(id);

    if (isLoading) return (
        <div className="container mx-auto px-4 py-10 max-w-[1200px]">
            <ProductCardSkeleton />
        </div>
    );

    if (error) return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10"
        >
            <BiError className="mx-auto text-red-500 text-5xl mb-4" />
            <p className="text-red-500">Error loading product</p>
        </motion.div>
    );

    const handleAddToCart = async () => {
        if (!user) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return;
        }

        try {
            await dispatch(addToCartAsync({ 
                productId: id, 
                quantity: (cartProduct?.quantity || 0) + 1 
            })).unwrap();
        } catch (error) {
            toast.error(error.message || 'Failed to add to cart');
        }
    };

    const handleDecreaseQuantity = async () => {
        if (!user) {
            toast.error('Please login to manage your cart');
            navigate('/login');
            return;
        }

        if (cartProduct?.quantity > 1) {
            try {
                await dispatch(addToCartAsync({ 
                    productId: id, 
                    quantity: cartProduct.quantity - 1 
                })).unwrap();
            } catch (error) {
                toast.error(error.message || 'Failed to update cart');
            }
        }
    };

    const handleToggleWishlist = () => {
        if (!user) {
            toast.error('Please login to manage your wishlist');
            navigate('/login');
            return;
        }

        // Will implement wishlist functionality separately
        toast.info('Wishlist functionality will be implemented soon');
    };

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-10 max-w-[1200px]"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Image Gallery Section */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center space-y-6"
                >
                    {/* Main Product Image */}
                    <motion.div
                        layoutId={`product-image-${product.id}`}
                        className="w-full aspect-square bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <motion.img
                            key={selectedImage || product.image}
                            src={selectedImage || product.image}
                            alt={product.name}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = placeholderImage;
                            }}
                            className="w-full h-full object-contain p-4"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.div>

                    {/* Thumbnail Gallery */}
                    <div className="flex gap-4 overflow-x-auto px-2 py-4 max-w-full scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                        <AnimatePresence>
                            {product.images?.map((image, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`relative rounded-lg overflow-hidden flex-shrink-0 cursor-pointer
                                        ${selectedImage === image ? 'ring-2 ring-violet-500 ring-offset-2' : ''}`}
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <motion.img
                                        src={image}
                                        alt={`${product.name} view ${index + 1}`}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = placeholderImage;
                                        }}
                                        className="w-20 h-20 object-contain bg-white dark:bg-gray-800"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Product Details Section */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col space-y-6"
                >
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white"
                    >
                        {product.name}
                    </motion.h1>

                    {/* Price and Availability */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-4xl font-bold text-violet-900 dark:text-violet-400">
                                ${product.price.toFixed(2)}
                                {product.old_price > product.price && (
                                    <span className="ml-3 text-lg text-gray-400 line-through">
                                        ${product.old_price.toFixed(2)}
                                    </span>
                                )}
                            </p>
                            <span className="px-3 py-1 text-sm text-green-600 bg-green-100 dark:bg-green-900/30 rounded-full">
                                In Stock
                            </span>
                        </div>
                    </motion.div>

                    {/* Product Description */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        <button
                            onClick={() => setIsDetailsShown(!isDetailsShown)}
                            className="w-full flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="font-medium text-gray-600 dark:text-gray-100">Product Details</span>
                            <motion.span
                                animate={{ rotate: isDetailsShown ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
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
                                    <p className="text-gray-600 dark:text-gray-100 leading-relaxed p-4">
                                        {product.description}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Quantity Selector */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400">Quantity</p>
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden w-fit">
                            <button
                                className="px-4 py-2 disabled:cursor-not-allowed dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                                disabled={!cartProduct || cartProduct.quantity <= 1}
                                onClick={handleDecreaseQuantity}
                            >
                                −
                            </button>
                            <div className="px-6 py-2 text-center font-medium">
                                {cartProduct ? cartProduct.quantity : 0}
                            </div>
                            <button
                                className="px-4 py-2 disabled:cursor-not-allowed dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                                onClick={() => handleAddToCart()}
                            >
                                +
                            </button>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 mt-6"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 flex items-center justify-center gap-2 bg-violet-900 hover:bg-violet-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            onClick={handleAddToCart}
                        >
                            <BiShoppingBag className="text-xl" />
                            Add to Cart
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            onClick={handleToggleWishlist}
                        >
                            <BiHeart className="text-xl" />
                            Add to Wishlist
                        </motion.button>
                    </motion.div>

                </motion.div>
                {/* Reviews Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
                >
                    <Reviews productId={product.id} />
                </motion.div>
            </div>
        </motion.section>
    );
}

export default ProductDetails;
