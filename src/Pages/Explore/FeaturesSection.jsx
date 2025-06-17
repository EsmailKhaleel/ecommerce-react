import { staggerContainer } from '../../utils/motion'
import { MdLocalShipping, MdSecurity, MdVerified, MdSavings, MdStars } from 'react-icons/md';
import { motion } from "framer-motion";

    const features = [
        {
            icon: MdLocalShipping,
            title: "Free delivery",
            description: "Enjoy free shipping on all orders above $50. Fast and reliable delivery right to your doorstep."
        },
        {
            icon: MdSecurity,
            title: "100% secure payment",
            description: "Shop with confidence using our encrypted payment system. We support all major credit cards and digital wallets."
        },
        {
            icon: MdVerified,
            title: "Quality guarantee",
            description: "Every product is carefully vetted for quality. Not satisfied? Return within 30 days for a full refund."
        },
        {
            icon: MdSavings,
            title: "Guaranteed savings",
            description: "Get the best prices with our price match guarantee and regular promotional offers."
        },
        {
            icon: MdStars,
            title: "Daily offers",
            description: "New deals every day with discounts up to 70% off on selected items."
        }
    ];


export default function FeaturesSection() {

  return (
    <motion.section
                variants={staggerContainer()}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                className="py-8 bg-white dark:bg-neutral-900"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="flex items-start gap-4 p-2"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            >
                                <div className="flex-shrink-0">
                                    <feature.icon className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">{feature.title}</h3>
                                    <p className="text-neutral-600 dark:text-neutral-300">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>
  )
}
