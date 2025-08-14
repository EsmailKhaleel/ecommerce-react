import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import banner8 from "../../assets/banner8.png";

export default function SecondBanner() {
    const navigate = useNavigate();
    
    return (
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
    )
}
