import { motion } from "framer-motion";
import ProductCard from "../../Components/ProductCard";
import EmptyWishlist from "../../features/wishlist/EmptyWishlist";
import WishlistModalConfirm from "../../features/wishlist/WishlistModalConfirm";
import ProductsLoading from "../../features/products/ProductsLoading";
import WishlistHeading from "../../features/wishlist/WishlistHeading";
import useWishlist from "../../hooks/wishList/useWishlist";

function Wishlist() {
  const {
    user,
    wishlist,
    status,
    showConfirmClear,
    setShowConfirmClear,
    handleClearWishlist,
  } = useWishlist();

  if (!user) return (<EmptyWishlist message="Please login to manage your wishlist" actionLabel="Login" actionLink="/login" />);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-7xl mx-auto">
        <WishlistHeading
          wishlistLength={wishlist.length}
          setShowConfirmClear={setShowConfirmClear}
          status={status}
        />

        {status.getWishlist === 'loading' ? (
          <ProductsLoading />
        ) : wishlist.length === 0 ? (
          <EmptyWishlist
            message="Your wishlist is empty"
            actionLabel="Browse Products"
            actionLink="/products"
          />
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isInWishlist={true}
              />
            ))}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmClear && (
          <WishlistModalConfirm
            onCancel={() => setShowConfirmClear(false)}
            onConfirm={handleClearWishlist}
            isLoading={status.clearWishlist === 'loading'}
          />
        )}
      </div>
    </motion.div>
  );
}

export default Wishlist;
