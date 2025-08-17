import { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { heroVariants } from '../../utils/motion';
import { useTranslation } from 'react-i18next';
import { Slides } from './heroImages';
import HeroText from './HeroText';
import HeroImage from './HeroImage';
import HeroDots from './HeroDots';
import HeroDecorative from './HeroDecorative';

function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const { scrollYProgress } = useScroll();
    const { t } = useTranslation();
    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
    const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -150]);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % Slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [isPaused]);

    const translatedSlide = useMemo(() => ({
        title: t(`hero.slides.${Slides[currentSlide].key}.title`),
        desc: t(`hero.slides.${Slides[currentSlide].key}.description`)
    }), [currentSlide, t]);

    return (
        <motion.div
            style={{ opacity, scale, y: heroY }}
            variants={heroVariants}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            initial="hidden"
            animate="show"
            className="relative w-full max-w-[100vw] min-h-[220px] sm:min-h-[250px] md:min-h-[280px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden py-8 "
        >
            <HeroDecorative />
            <div className="relative z-10 container mx-auto flex flex-col md:flex-row items-center justify-center gap-8 py-4 px-4">
                <HeroText translatedSlide={translatedSlide} />
                <HeroImage currentSlide={currentSlide} />
            </div>
            <HeroDots currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />
        </motion.div>
    );
}

export default Hero