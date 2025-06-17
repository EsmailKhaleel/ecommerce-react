import { motion } from "framer-motion";
import ProductCard from "../../Components/ProductCard";
import { BiHeart, BiTrash } from "react-icons/bi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getWishlistAsync, toggleWishlistItemAsync, clearWishlistAsync } from "../../StateManagement/Slices/WishlistSlice";

function Wishlist() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { items: wishlist, status } = useSelector((state) => state.wishlist);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(getWishlistAsync());
    }
  }, [dispatch, user]);


  const handleToggleWishlist = async (productId) => {
    if (!user) {
      toast.error('Please login to manage your wishlist');
      return;
    }

    if (status.toggleItem === 'loading') return;

    try {
      await dispatch(toggleWishlistItemAsync(productId)).unwrap();
    } catch (error) {
      // Error is handled by the effect above
      console.error('Error toggling wishlist:', error);
    }
  };

  const handleClearWishlist = async () => {
    if (status.clearWishlist === 'loading') return;

    try {
      await dispatch(clearWishlistAsync()).unwrap();
      setShowConfirmClear(false);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <BiHeart className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Please login to view your wishlist
        </h2>
        <Link
          to="/auth"
          className="text-primary hover:text-primary/80 transition-colors duration-200"
        >
          Login now
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8 space-y-2">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              My Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
            </h1>
            <div className="flex items-center gap-4">
              {wishlist.length > 0 && (
                <button
                  onClick={() => setShowConfirmClear(true)}
                  className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
                  disabled={status.clearWishlist === 'loading'}
                >
                  <BiTrash className="text-xl" />
                  Clear All
                </button>
              )}
              <Link
                to="/products"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {status.getWishlist === 'loading' ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-12">
            <BiHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Your wishlist is empty
            </h2>
            <Link
              to="/products"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onWishlistClick={() => handleToggleWishlist(product.id)}
                isInWishlist={true}
              />
            ))}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmClear && (
          <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Clear Wishlist?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to remove all items from your wishlist? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearWishlist}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  disabled={status.clearWishlist === 'loading'}
                >
                  {status.clearWishlist === 'loading' ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Clear All'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Wishlist;
