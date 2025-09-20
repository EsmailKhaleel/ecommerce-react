import { motion, useScroll, useTransform } from 'framer-motion';
import { heroVariants } from '../../utils/motion';
import { useTranslation } from 'react-i18next';
import { Slides } from './heroImages';
import HeroText from './HeroText';
import HeroImage from './HeroImage';
import HeroDecorative from './HeroDecorative';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../../styles/swiper.css';

function Hero() {
    const { scrollYProgress } = useScroll();
    const { t, i18n } = useTranslation();
    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
    const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -150]);

    return (
        <motion.div
            style={{ opacity, scale, y: heroY }}
            variants={heroVariants}
            initial="hidden"
            animate="show"
            className="relative w-full max-w-[100vw] min-h-[220px] sm:min-h-[250px] md:min-h-[280px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden py-8"
        >
            <HeroDecorative />
            <div className="relative z-10 container mx-auto py-4 px-4">
                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={30}
                    centeredSlides={true}
                    dir={i18n.dir()}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                        el: '.hero-pagination',
                    }}
                    className="keep-ltr"
                >
                    {Slides.map((slide, index) => (
                        <SwiperSlide key={slide.id}>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                                <HeroText
                                    translatedSlide={{
                                        title: t(`hero.slides.${slide.key}.title`),
                                        desc: t(`hero.slides.${slide.key}.description`),
                                    }}
                                />
                                <HeroImage currentSlide={index} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="hero-pagination"></div>
            </div>
        </motion.div>
    );
}

export default Hero