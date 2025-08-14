import useRelatedProducts from "./useRelatedProducts";
import { useRef } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { motion } from "framer-motion";
import ProductCardSkeleton from "../../Components/ProductCardSkeleton";
import ProductCard from "../../Components/ProductCard";

function RelatedProductsCarousel({ product }) {
    const relatedProductsRef = useRef(null);

        const { data: relatedProducts, isLoading: relatedLoading } = useRelatedProducts(product);
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
    return (
        <>
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
        </>
    )
}

export default RelatedProductsCarousel