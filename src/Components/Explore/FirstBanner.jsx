import { motion } from "framer-motion"
import banner7 from "../../assets/banner7.png";
import { useNavigate } from "react-router-dom";
import { useBannerTransforms } from "./useBannerTransforms";

function FirstBanner() {
    const navigate = useNavigate();
    const { firstBanner } = useBannerTransforms();
    
    return (
        <motion.section
            className="relative h-[600px] rounded-3xl overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
        >
            <motion.div
                className="absolute inset-0"
                style={firstBanner}
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
    )
}

export default FirstBanner