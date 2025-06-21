import { motion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import Hero from "../../Components/Hero/Hero";
import Spinner from "../../Components/Spinner";
import { useMemo, useState, useEffect } from "react";
import { Background } from "../../Components/Background";
import HorizontalCategorySection from "./HorizontalCategorySection";
import { BrowseByCategory } from "./HorizontalCategorySection";
import banner7 from "../../assets/banner7.png";
import banner8 from "../../assets/banner8.png";
import banner9 from "../../assets/banner9.png";
import banner10 from "../../assets/banner10.png";
import { useNavigate } from "react-router-dom";
import { fadeIn, staggerContainer, textVariant } from "../../utils/motion";
import FeaturesSection from "./FeaturesSection";
import Error from "./Error";
import { BiArrowToTop } from "react-icons/bi";
import { AnimatePresence } from "framer-motion";

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
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
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
        scale: useTransform(scrollYProgress, [0.5, 1], [0.9, 1.1]),
        rotate: useTransform(scrollYProgress, [0.5, 1], [-5, 5]),
        opacity: useTransform(scrollYProgress, [0.5, 0.8, 1], [0.7, 1, 0.9])
    };

    const banner10Transform = {
        scale: useTransform(scrollYProgress, [0.5, 1], [0.9, 1.1]),
        rotate: useTransform(scrollYProgress, [0.5, 1], [5, -5]),
        opacity: useTransform(scrollYProgress, [0.5, 0.8, 1], [0.7, 1, 0.9])
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
            <Error error={errorCategories || errorProducts} />
        );
    }

    const isLoading = isLoadingCategories || isLoadingProducts;

    return (
        <>
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-primary shadow-lg hover:bg-primary/90 transition-colors duration-300 text-white flex items-center justify-center group"
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <BiArrowToTop className="text-2xl group-hover:animate-bounce" />
                    </motion.button>
                )}
            </AnimatePresence>
            <motion.div
                style={{ y: heroY }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative z-10 will-change-transform"
            >
                <Hero />
            </motion.div>
            <div className="px-4 md:px-8 lg:px-16 xl:px-24">
                <BrowseByCategory categories={categories} />
            </div>
            <div className="min-h-screen dark:bg-neutral-dark relative overflow-hidden">
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
                            <h1 className="text-5xl md:text-6xl font-bold text-neutral dark:text-neutral-light mb-4 tracking-tight">
                                Explore Our Collections
                            </h1>
                            <p className="text-xl text-neutral/70 dark:text-neutral-light/70 max-w-2xl mx-auto">
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
                                    className="mt-6 text-lg font-medium text-neutral dark:text-neutral-light"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    Loading collections
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
                                <p className="text-xl text-neutral/70 dark:text-neutral-light/70">
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
                                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-dark/70 via-neutral-dark/40 to-transparent" />
                                </motion.div>
                                <div className="relative h-full flex items-center">
                                    <div className="max-w-lg ml-16 text-neutral-light space-y-6">
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
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            Explore our latest collection of trendsetting fashion pieces
                                        </motion.span>
                                        <motion.div>
                                            <motion.button
                                                className="px-8 py-3 bg-neutral-light text-neutral rounded-full relative overflow-hidden group shadow-lg hover:bg-neutral-light/90"
                                                whileHover={{ scale: 1.05 }}
                                                initial={{ opacity: 0, x: -80 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 }}
                                                onClick={() => navigate('/products')}
                                            >
                                                Shop Now
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-neutral-dark via-neutral to-neutral-dark"
                                                    initial={{ x: "-100%" }}
                                                    whileHover={{ x: "100%" }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                                <motion.div
                                                    className="absolute inset-0 bg-neutral-light/30 rounded-full blur-xl"
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
                                className="relative h-[300px] md:h-[500px] rounded-3xl overflow-hidden bg-background-light dark:bg-neutral-dark"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 1 }}
                            >
                                <div className="grid grid-cols-2 h-full">
                                    <motion.div
                                        className="flex items-center justify-center p-4 md:p-16"
                                        initial={{ opacity: 0, x: 100 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <div>
                                            <h2 className="text-2xl md:text-4xl font-bold mb-6 text-neutral dark:text-neutral-light">
                                                Premium Quality
                                            </h2>
                                            <motion.div
                                                initial={{ opacity: 0, x: 80 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="text-md md:text-2xl mb-4 md:mb-8 text-neutral/70 dark:text-neutral-light/70">
                                                Experience luxury and comfort with our premium selection
                                            </motion.div>
                                            <motion.button
                                                className="text-sm md:text-lg md:px-8 md:py-3 px-3 py-2 bg-primary text-neutral-light rounded-md relative overflow-hidden group shadow-lg hover:bg-primary-dark"
                                                whileHover={{ scale: 1.05 }}
                                                initial={{ opacity: 0, x: 80 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 }}
                                                onClick={() => navigate('/products')}
                                            >
                                                View Collection
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary to-primary-light"
                                                    initial={{ scale: 0 }}
                                                    whileHover={{ scale: 1 }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                                <motion.div
                                                    className="absolute inset-0 bg-neutral-light/20 rounded-full blur-xl"
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
                                        className="relative overflow-hidden md:p-10 p-2 mb-2"
                                        initial={{ opacity: 0, x: -150 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <img src={banner8} alt="Premium Collection"
                                            className="md:w-full w-[400px] md:h-full h-[300px] object-cover rounded-lg" />
                                    </motion.div>
                                </div>
                            </motion.section>

                            {/* Third Banner Section */}
                            <motion.section
                                className="grid grid-cols-2 gap-2 md:gap-8 h-[250px] md:h-[400px]"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 1 }}
                            >
                                <motion.div
                                    className="relative rounded-3xl overflow-hidden"
                                    style={banner9Transform}
                                >
                                    <img src={banner9} alt="Special Offers" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-neutral-dark/30 flex items-center justify-center">
                                        <div className="text-center text-neutral-light">
                                            <motion.h3
                                                className="text-3xl font-bold mb-4"
                                                initial={{ y: -20, opacity: 0 }}
                                                whileInView={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                Special Offers
                                            </motion.h3>
                                            <motion.button
                                                className="px-6 py-2 bg-neutral-light text-neutral rounded-full relative overflow-hidden group shadow-lg hover:bg-neutral-light/90"
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
            {/* Features Section */}
            <FeaturesSection />
            {/* Newsletter Section */}
            <motion.section
                className="relative py-20 bg-primary/10 dark:bg-primary/5"
            >
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={staggerContainer(0.1, 0.1)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.3 }}
                        className="max-w-2xl mx-auto text-center"
                    >
                        <motion.h2
                            variants={textVariant(0.2)}
                            className="text-4xl font-bold text-gray-900 dark:text-white mb-6"
                        >
                            Stay Updated
                        </motion.h2>
                        <motion.p
                            variants={fadeIn("up", "spring", 0.3, 1)}
                            className="text-lg text-gray-600 dark:text-gray-300 mb-8"
                        >
                            Subscribe to our newsletter for the latest updates and exclusive offers
                        </motion.p>
                        <motion.div
                            variants={fadeIn("up", "spring", 0.4, 1)}
                            className="flex gap-4 flex-wrap justify-center items-center"
                        >
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-3 rounded-full border-2 border-gray-200 dark:border-gray-700 focus:border-primary dark:focus:border-primary outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3 bg-primary text-white rounded-full font-semibold"
                            >
                                Subscribe
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>
        </>
    );
}

export default Explore;