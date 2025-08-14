import { motion } from "framer-motion"
import { Rating } from "../../Components/Rating"

function ProductInfo({ product }) {
    return (
        <>
            {/* Product Name */}
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
        </>
    )
}

export default ProductInfo