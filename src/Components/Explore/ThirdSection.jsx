import banner9 from "../../assets/banner9.png";
import banner10 from "../../assets/banner10.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useBannerTransforms } from "./useBannerTransforms";

function ThirdSection() {
    const navigate = useNavigate();
    const { thirdBannerleft, thirdBannerRight } = useBannerTransforms();
    return (
        <motion.section
            className="grid grid-cols-2 gap-2 md:gap-8 h-[250px] md:h-[400px]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
        >
            <motion.div
                className="relative rounded-3xl overflow-hidden"
                style={thirdBannerleft}
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
                style={thirdBannerRight}
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
    )
}

export default ThirdSection