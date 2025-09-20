import useRelatedProducts from "./useRelatedProducts";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { motion } from "framer-motion";
import ProductCardSkeleton from "../../Components/ProductCardSkeleton";
import ProductCard from "../../Components/ProductCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

function RelatedProductsCarousel({ product }) {
    const { data: relatedProducts, isLoading: relatedLoading } = useRelatedProducts(product);
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
                        {/* Related Products Header with Navigation */}
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                                    Related Products
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    You might also like these products from the same category
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="prev-related-btn w-10 h-10 cursor-pointer bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cur"
                                >
                                    <BiChevronLeft className="text-xl text-gray-600 dark:text-gray-400" />
                                </button>
                                <button
                                    className="next-related-btn w-10 h-10 cursor-pointer bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cur"
                                >
                                    <BiChevronRight className="text-xl text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {relatedLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, index) => (
                                    <ProductCardSkeleton key={index} />
                                ))}
                            </div>
                        ) : (
                            <Swiper
                                modules={[Navigation]}
                                spaceBetween={16}
                                slidesPerView="auto"
                                navigation={{
                                    prevEl: '.prev-related-btn',
                                    nextEl: '.next-related-btn',
                                }}
                            >
                                {relatedProducts.map((relatedProduct) => (
                                    <SwiperSlide key={relatedProduct.id} style={{ width: '14rem' }}>
                                        <ProductCard product={relatedProduct} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                </motion.section>
            )}
        </>
    )
}

export default RelatedProductsCarousel