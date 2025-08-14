import { BiTrash } from "react-icons/bi"
import { Link } from "react-router-dom"

function WishlistHeading({ wishlistLength, setShowConfirmClear, status }) {
    return (
        <div className="mb-6 sm:mb-8 space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    My Wishlist {wishlistLength > 0 && `(${wishlistLength})`}
                </h1>
                <div className="flex items-center gap-2 sm:gap-4">
                    {wishlistLength > 0 && (
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
    )
}

export default WishlistHeading