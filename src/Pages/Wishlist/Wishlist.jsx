import { useMemo } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../../Components/ProductCard";
import { BiHeart } from "react-icons/bi";
import Spinner from "../../Components/Spinner";
import { Link } from "react-router-dom";

function Wishlist({ inAccount = false }) {
  const products = useSelector((state) => state.cart.products);
  const isLoading = useSelector((state) => state.cart.loading);

  const favoriteProducts = useMemo(() => {
    return products.filter((product) => product.isFav);
  }, [products]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Wishlist
            <span className="ml-2 text-lg text-gray-500 dark:text-gray-400">
              ({favoriteProducts.length}{" "}
              {favoriteProducts.length === 1 ? "item" : "items"})
            </span>
          </h1>
          <Link
            to="/products"
            className="text-primary hover:text-primary/80 transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {favoriteProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12"
            >
              <BiHeart className="text-7xl text-gray-300 dark:text-gray-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                Find products you love and add them to your wishlist for later
              </p>
              <Link
                to="/products"
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200"
              >
                Explore Products
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${inAccount
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3":
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" }`}
            >
              {favoriteProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.1 },
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Wishlist;
