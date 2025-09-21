import { motion } from "framer-motion"
import Spinner from "../Spinner"
import HorizontalCategorySection from "./HorizontalCategorySection";
import Error from "./Error";
import useProductsByCategory from "../../hooks/products/useProductsByCategory";
import useCategories from "../../hooks/products/useCategories";

function AnimatedCollections() {
        // Categories Query
    const {
        data: categories = [],
        isPending: isLoadingCategories,
        isError: isErrorCategories,
        error: errorCategories,
    } = useCategories();

    // Products Query
    const {
        data: productsByCategory,
        isLoading: isLoadingProducts,
        isError: isErrorProducts,
        error: errorProducts,
    } = useProductsByCategory();

    const isLoading = isLoadingCategories || isLoadingProducts;
    if (isErrorCategories || isErrorProducts) {
        return (
            <Error error={errorCategories || errorProducts} />
        );
    }

    return (
        <>
            {isLoading ? (
                <motion.div
                    className="flex flex-col items-center justify-center py-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Spinner />
                    <motion.p
                        className="mt-6 text-lg font-medium text-neutral dark:text-neutral-light"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Loading collections
                    </motion.p>
                </motion.div>
            ) : categories.length > 0 ? (
                <div>
                    {productsByCategory.map(({ category, products }, index) => (
                        <HorizontalCategorySection
                            key={category}
                            category={category}
                            products={products || []}
                            index={index}
                        />
                    ))}
                </div>
            ) : (
                <motion.div
                    className="text-center py-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="text-xl text-neutral/70 dark:text-neutral-light/70">
                        No collections available at the moment.
                    </p>
                </motion.div>
            )}
        </>
    )
}

export default AnimatedCollections