import { staggerContainer } from '../../utils/motion'
import { MdLocalShipping, MdSecurity, MdVerified, MdSavings, MdStars } from 'react-icons/md';
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

    const featuresList = [
        {
            icon: MdLocalShipping,
            key: "freeDelivery"
        },
        {
            icon: MdSecurity,
            key: "securePayment"
        },
        {
            icon: MdVerified,
            key: "qualityGuarantee"
        },
        {
            icon: MdSavings,
            key: "guaranteedSavings"
        },
        {
            icon: MdStars,
            key: "dailyOffers"
        }
    ];


export default function FeaturesSection() {
  const { t } = useTranslation();

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
                        {featuresList.map((feature, index) => (
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
                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                                        {t(`features.${feature.key}.title`)}
                                    </h3>
                                    <p className="text-neutral-600 dark:text-neutral-300">
                                        {t(`features.${feature.key}.description`)}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>
  )
}
