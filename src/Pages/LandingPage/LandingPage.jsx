import { motion, useScroll, useTransform } from "framer-motion";
import { fadeIn, staggerContainer, textVariant } from "../../utils/motion";

// Import your images here
import heroImage from "../../assets/banner1.png";
import feature1 from "../../assets/banner4.png";
import feature2 from "../../assets/banner3.png";

const LandingPage = () => {
    const { scrollYProgress } = useScroll();
    
    // Parallax effects for different sections
    const heroY = useTransform(scrollYProgress, [0, 1], [0, -300]);
    const feature1Y = useTransform(scrollYProgress, [0.2, 0.8], [0, -200]);
    const feature2Y = useTransform(scrollYProgress, [0.3, 0.9], [0, -150]);
    
    // Opacity transforms for fade effects
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const feature1Opacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
    const feature2Opacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);

    // Image hover animations
    const imageVariants = {
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* Hero Section */}
            <motion.section 
                style={{ y: heroY, opacity: heroOpacity }}
                className="relative h-screen flex items-center justify-center"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent dark:from-primary/10 z-0"></div>
                <div className="container mx-auto px-4 z-10">
                    <motion.div 
                        variants={staggerContainer(0.1, 0.1)}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col md:flex-row items-center gap-12"
                    >
                        <motion.div 
                            variants={textVariant(0.2)}
                            className="flex-1 text-center md:text-left"
                        >
                            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                                Discover Your Style
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                                Explore our curated collection of fashion and lifestyle products
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-primary text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Shop Now
                            </motion.button>
                        </motion.div>
                        <motion.div 
                            variants={fadeIn("right", "spring", 0.5, 1)}
                            className="flex-1"
                        >
                            <motion.img 
                                src={heroImage} 
                                alt="Hero" 
                                className="w-full max-w-lg mx-auto rounded-lg shadow-2xl"
                                variants={imageVariants}
                                whileHover="hover"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Featured Categories Section */}
            <motion.section 
                style={{ y: feature1Y, opacity: feature1Opacity }}
                className="relative min-h-screen flex items-center py-20"
            >
                <div className="container mx-auto px-4">
                    <motion.h2 
                        variants={textVariant(0.2)}
                        className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white"
                    >
                        Featured Categories
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                whileHover={{ scale: 1.05 }}
                                className="relative overflow-hidden rounded-xl shadow-xl"
                            >
                                <motion.img
                                    src={feature1}
                                    alt={`Category ${index + 1}`}
                                    className="w-full h-80 object-cover"
                                    variants={imageVariants}
                                    whileHover="hover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                                    <h3 className="text-white text-2xl font-bold">Category {index + 1}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Special Offers Section */}
            <motion.section 
                style={{ y: feature2Y, opacity: feature2Opacity }}
                className="relative min-h-screen flex items-center py-20 bg-gray-100 dark:bg-gray-800"
            >
                <div className="container mx-auto px-4">
                    <motion.div 
                        variants={staggerContainer(0.1, 0.1)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.3 }}
                        className="flex flex-col md:flex-row items-center gap-12"
                    >
                        <motion.div 
                            variants={textVariant(0.2)}
                            className="flex-1"
                        >
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                Special Offers
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                                Get up to 50% off on selected items. Limited time offer!
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-primary text-white rounded-full text-lg font-semibold"
                            >
                                View Deals
                            </motion.button>
                        </motion.div>
                        <motion.div 
                            variants={fadeIn("right", "spring", 0.5, 1)}
                            className="flex-1 grid grid-cols-2 gap-4"
                        >
                            {[1, 2, 3, 4].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.3 }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="relative overflow-hidden rounded-xl"
                                >
                                    <motion.img
                                        src={feature2}
                                        alt={`Offer ${index + 1}`}
                                        className="w-full h-48 object-cover"
                                        variants={imageVariants}
                                        whileHover="hover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                        <h3 className="text-white text-lg font-bold">Special Offer {index + 1}</h3>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
};

export default LandingPage; 