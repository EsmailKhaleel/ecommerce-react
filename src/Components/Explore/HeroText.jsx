import { motion } from "framer-motion"
import { presets } from "../../utils/motion"
import { useTranslation } from "react-i18next";


function HeroText({ translatedSlide }) {
    const { t } = useTranslation();

    return (
        <motion.div
            variants={presets.fadeRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.7 }}
            className="flex-1 space-y-4"
        >
            <motion.span
                variants={presets.zoomPulse}
                className="inline-block px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-secondary rounded-full text-sm font-medium mb-2 animate-pulse"
            >
                {t('hero.specialOffer')}
            </motion.span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white leading-tight">
                {translatedSlide.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base max-w-2xl">
                {translatedSlide.desc}
            </p>
        </motion.div>
    );
}

export default HeroText