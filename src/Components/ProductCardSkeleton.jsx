import { motion } from "framer-motion";

const shimmerAnimation = {
    animate: {
        background: [
            "hsl(200, 20%, 80%)",
            "hsl(200, 20%, 95%)",
            "hsl(200, 20%, 80%)"
        ],
    },
    transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
    }
};

function ProductCardSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group relative"
        >
            {/* Image placeholder */}
            <motion.div
                {...shimmerAnimation}
                className="w-full h-64 bg-gray-200 dark:bg-gray-700 relative overflow-hidden"
            />

            {/* Content */}
            <div className="p-4 space-y-4">
                {/* Title */}
                <motion.div
                    {...shimmerAnimation}
                    className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"
                />

                {/* Description */}
                <motion.div
                    {...shimmerAnimation}
                    transition={{
                        ...shimmerAnimation.transition,
                        delay: 0.2
                    }}
                    className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"
                />

                {/* Price and Rating */}
                <div className="flex justify-between items-center">
                    <motion.div
                        {...shimmerAnimation}
                        transition={{
                            ...shimmerAnimation.transition,
                            delay: 0.3
                        }}
                        className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"
                    />
                    <motion.div
                        {...shimmerAnimation}
                        transition={{
                            ...shimmerAnimation.transition,
                            delay: 0.4
                        }}
                        className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"
                    />
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-2">
                    <motion.div
                        {...shimmerAnimation}
                        className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-full"
                    />
                    <motion.div
                        {...shimmerAnimation}
                        transition={{
                            ...shimmerAnimation.transition,
                            delay: 0.5
                        }}
                        className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"
                    />                </div>
            </div>
        </motion.div>
    );
}

export default ProductCardSkeleton;
