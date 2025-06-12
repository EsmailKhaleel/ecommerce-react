import { motion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import Hero from "../../Components/Hero/Hero";
import Spinner from "../../Components/Spinner";
import { BiError } from "react-icons/bi";
import { useMemo } from "react";
import { Background } from "../../Components/Background";
import HorizontalCategorySection from "./HorizontalCategorySection";
import banner7 from "../../assets/banner7.png";
import banner8 from "../../assets/banner8.png";
import banner9 from "../../assets/banner9.png";
import banner10 from "../../assets/banner10.png";
import { useNavigate } from "react-router-dom";

// Fetch categories
const fetchCategories = async () => {
    const response = await axiosInstance.get('/products/categories');
    return response.data.categories;
};

// Fetch products by category
const fetchProductsByCategory = async (category) => {
    const response = await axiosInstance.get(`/products${category ? `?category=${category}` : ''}`);
    return response.data.products;
};

function Explore() {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -150]);

    // Enhanced scroll-based transforms for sections
    const banner7Transform = {
        y: useTransform(scrollYProgress, [0.3, 0.6], [200, 0]),
        scale: useTransform(scrollYProgress, [0.3, 0.6], [1.1, 1]),
        filter: useTransform(
            scrollYProgress,
            [0.3, 0.45, 0.6],
            ["brightness(50%)", "brightness(80%)", "brightness(100%)"]
        )
    };

    const banner9Transform = {
        scale: useTransform(scrollYProgress, [0.6, 1], [0.95, 1.05]),
        rotate: useTransform(scrollYProgress, [0.6, 1], [-2, 2]),
        opacity: useTransform(scrollYProgress, [0.6, 0.8, 1], [0.7, 1, 0.9])
    };

    const banner10Transform = {
        scale: useTransform(scrollYProgress, [0.7, 1], [0.9, 1.1]),
        rotate: useTransform(scrollYProgress, [0.7, 1], [2, -2]),
        opacity: useTransform(scrollYProgress, [0.7, 0.85, 1], [0.7, 1, 0.9])
    };

    // Categories Query
    const {
        data: categories = [],
        isLoading: isLoadingCategories,
        isError: isErrorCategories,
        error: errorCategories,
    } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 10 * 60 * 1000, // 10 minutes
        cacheTime: 30 * 60 * 1000, // 30 minutes
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    // Products Query
    const {
        data: productsByCategory,
        isLoading: isLoadingProducts,
        isError: isErrorProducts,
        error: errorProducts,
    } = useQuery({
        queryKey: ['products-by-category', categories],
        queryFn: async () => {
            if (categories.length === 0) return {};

            const results = await Promise.allSettled(
                categories.map(async (category) => {
                    try {
                        const products = await fetchProductsByCategory(category);
                        return { category, products: products || [] };
                    } catch (error) {
                        console.warn(`Failed to fetch products for category: ${category}`, error);
                        return { category, products: [] };
                    }
                })
            );

            return Object.fromEntries(
                results
                    .filter(result => result.status === 'fulfilled')
                    .map(result => [result.value.category, result.value.products])
            );
        },
        enabled: categories.length > 0,
        staleTime: 10 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
        retry: 2,
    });

    // Filter out categories with no products
    const validCategories = useMemo(() => {
        return categories.filter(category =>
            productsByCategory?.[category]?.length > 0
        );
    }, [categories, productsByCategory]);

    if (isErrorCategories || isErrorProducts) {
        return (
            <motion.div
                className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="text-center max-w-md">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                    >
                        <BiError className="w-20 h-20 text-red-500 mx-auto mb-6" />
                    </motion.div>
                    <motion.h2
                        className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Oops! Something went wrong
                    </motion.h2>
                    <motion.p
                        className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {errorCategories?.message || errorProducts?.message || "Failed to load collections. Please check your connection and try again."}
                    </motion.p>
                    <motion.button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Try Again
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    const isLoading = isLoadingCategories || isLoadingProducts;
    return (
        <>
            <motion.div
                style={{ y: heroY }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative z-10 will-change-transform"
            >
                <Hero />
            </motion.div>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
                <Background />
                <main className="relative z-10 py-20">
                    <div className="max-w-7xl mx-auto px-0">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                                Explore Our Collections
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Discover amazing products across different categories
                            </p>
                        </motion.div>

                        {isLoading ? (
                            <motion.div
                                className="flex flex-col items-center justify-center py-20"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <Spinner />
                                <motion.p
                                    className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-200"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    Loading your collections...
                                </motion.p>
                            </motion.div>
                        ) : validCategories.length > 0 ? (
                            <div>
                                {validCategories.map((category, index) => (
                                    <HorizontalCategorySection
                                        key={category}
                                        category={category}
                                        products={productsByCategory?.[category] || []}
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
                                <p className="text-xl text-gray-600 dark:text-gray-400">
                                    No collections available at the moment.
                                </p>
                            </motion.div>
                        )}

                        {/* Banner Sections */}
                        <div className="mt-32 space-y-32">
                            {/* First Banner Section */}
                            <motion.section
                                className="relative h-[600px] rounded-3xl overflow-hidden"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 1 }}
                            >
                                <motion.div
                                    className="absolute inset-0"
                                    style={banner7Transform}
                                >
                                    <img src={banner7} alt="Lifestyle" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                                </motion.div>
                                <div className="relative h-full flex items-center">
                                    <div className="max-w-lg ml-16 text-white space-y-6">
                                        <motion.h2
                                            className="text-6xl font-bold"
                                            initial={{ opacity: 0, y: -30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            Discover
                                            <motion.span
                                                className="block mt-2"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                Your Style
                                            </motion.span>
                                        </motion.h2>
                                        <motion.span
                                            className="text-xl mb-5 block"
                                            // style={descriptionTransform}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            Explore our latest collection of trendsetting fashion pieces
                                        </motion.span>
                                        <motion.div>
                                            <motion.button
                                                className="px-8 py-3 bg-white text-black rounded-full relative overflow-hidden group shadow-lg hover:bg-gray-100"
                                                whileHover={{ scale: 1.05 }}
                                                initial={{ opacity: 0, x: -80 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 }}
                                                onClick={() => navigate('/products')}
                                            >
                                                    Shop Now
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-black via-gray-800 to-black"
                                                    initial={{ x: "-100%" }}
                                                    whileHover={{ x: "100%" }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                                <motion.div
                                                    className="absolute inset-0 bg-white/30 rounded-full blur-xl"
                                                    initial={{ opacity: 0 }}
                                                    whileHover={{
                                                        opacity: [0, 1, 0],
                                                        transition: {
                                                            duration: 1.5,
                                                            repeat: Infinity,
                                                            ease: "easeInOut"
                                                        }
                                                    }}
                                                />
                                            </motion.button>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Second Banner Section */}
                            <motion.section
                                className="relative h-[500px] rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 1 }}
                            >
                                <div className="grid grid-cols-2 h-full">
                                    <motion.div
                                        className="flex items-center justify-center p-16"
                                        initial={{ opacity: 0, x: 100 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <div>
                                            <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                                                Premium Quality
                                            </h2>
                                            <motion.div
                                                initial={{ opacity: 0, x: 80 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="text-lg mb-8 text-gray-600 dark:text-gray-300">
                                                Experience luxury and comfort with our premium selection
                                            </motion.div>
                                            <motion.button
                                                className="px-8 py-3 bg-primary text-white rounded-full relative overflow-hidden group shadow-lg hover:bg-primary/90"
                                                whileHover={{ scale: 1.05 }}
                                                initial={{ opacity: 0, x: 80 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 }}
                                                onClick={() => navigate('/products')}
                                            >
                                                View Collection
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary to-primary-400"
                                                    initial={{ scale: 0 }}
                                                    whileHover={{ scale: 1 }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                                <motion.div
                                                    className="absolute inset-0 bg-white/20 rounded-full blur-xl"
                                                    initial={{ opacity: 0 }}
                                                    whileHover={{
                                                        opacity: [0, 1, 0],
                                                        transition: {
                                                            duration: 1.5,
                                                            repeat: Infinity,
                                                            ease: "easeInOut"
                                                        }
                                                    }}
                                                />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        className="relative overflow-hidden"
                                        initial={{ opacity: 0, x: -150 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <img src={banner8} alt="Premium Collection" className="w-full h-full object-cover" />
                                    </motion.div>
                                </div>
                            </motion.section>

                            {/* Third Banner Section */}
                            <motion.section
                                className="grid grid-cols-2 gap-8 h-[400px]"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 1 }}
                            >                                <motion.div
                                className="relative rounded-3xl overflow-hidden"
                                style={banner9Transform}
                            >
                                    <img src={banner9} alt="Special Offers" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <motion.h3
                                                className="text-3xl font-bold mb-4"
                                                initial={{ y: -20, opacity: 0 }}
                                                whileInView={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                Special Offers
                                            </motion.h3>
                                            <motion.button
                                                className="px-6 py-2 bg-white text-black rounded-full relative overflow-hidden group shadow-lg"
                                                onClick={() => navigate('/products')}
                                                whileHover={{ scale: 1.05 }}
                                                initial={{ y: 20, opacity: 0 }}
                                                whileInView={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                    Shop Now
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>                                
                                <motion.div
                                    className="relative rounded-3xl overflow-hidden"
                                    style={banner10Transform}
                                >
                                    <img src={banner10} alt="New Arrivals" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <motion.h3
                                                className="text-3xl font-bold mb-4"
                                                initial={{ y: -20, opacity: 0 }}
                                                whileInView={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                New Arrivals
                                            </motion.h3>
                                            <motion.button
                                                className="px-6 py-2 bg-white text-black rounded-full relative overflow-hidden group shadow-lg hover:bg-gray-100"
                                                whileHover={{ scale: 1.05 }}
                                                onClick={() => navigate('/products')}
                                                initial={{ y: 20, opacity: 0 }}
                                                whileInView={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                Explore
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.section>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export default Explore;