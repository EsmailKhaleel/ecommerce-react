import { motion } from "framer-motion"
import { useTranslation } from "react-i18next";
import useShare from "../../hooks/useShare";
import Spinner from "../../Components/Spinner";
import { BiCar, BiHeart, BiRefresh, BiShare, BiShield, BiShoppingBag, BiSolidHeart } from "react-icons/bi";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useCartAction from "../../hooks/cart/useCartAction";
import useWishlistActions from "../../hooks/wishList/useWishlistAction";


function ProductActions({ product, selectedVariant, selectedVariantId, onVariantChange }) {
    const { id } = product;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const wishlistItems = useSelector(state => state.wishlist.items);

    const cartItems = useSelector(state => state.cart.items);

    // Find current product in cart and sync with Redux
    const cartProduct = cartItems.find(item => (item.product?.id || item.product?._id) === id && String(item.variant?._id || '') === String(selectedVariantId || ''));
    const currentQuantity = cartProduct ? cartProduct.quantity : 0;
    
    // Query related products
    const { handleAddToCart, isCartLoading } = useCartAction(id, selectedVariantId || undefined);
    const { handleToggleWishlist, isWishlistLoading } = useWishlistActions(id);
    const { handleShare } = useShare({
        title: product.name,
        text: product.description,
    });

    return (
        <>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-2 mb-4"
            >
                {product.variants?.length > 0 && <label className="block mb-3">
                    <span className="block text-sm font-medium mb-1">Choose an option</span>
                    <select value={selectedVariantId} onChange={event => onVariantChange(event.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2">
                        {product.variants.map(variant => <option key={variant._id} value={variant._id}>{variant.name} — ${variant.price.toFixed(2)} {variant.trackInventory ? `(${Math.max(0, variant.stock - (variant.reservedStock || 0))} available)` : ''}</option>)}
                    </select>
                </label>}
                <div className="grid grid-cols-2 gap-2">
                    <motion.button
                        className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white px-4 py-3 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleAddToCart(currentQuantity + 1)}
                        disabled={isCartLoading || (product.variants?.length ? !selectedVariant || (selectedVariant.trackInventory && selectedVariant.stock - (selectedVariant.reservedStock || 0) <= 0) : product.availableStock === 0)}
                    >
                        {isCartLoading ? (
                            <Spinner className="w-5 h-5" />
                        ) : (
                            <>
                                <MdOutlineShoppingCartCheckout className="text-lg" />
                                {product.availableStock === 0 ? 'Unavailable' : currentQuantity > 0 ? `${currentQuantity} items in cart` : t('common.addToCart')}
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
                        aria-label="Toggle wishlist"
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
                        aria-label="Share product"
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
                        <p className="font-medium text-gray-800 dark:text-white text-sm">Shipping</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Confirmed at checkout</p>
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
        </>
    )
}

export default ProductActions
