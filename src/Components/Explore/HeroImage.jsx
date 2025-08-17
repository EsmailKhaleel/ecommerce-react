import { AnimatePresence, motion } from "framer-motion"
import { presets } from "../../utils/motion"
import { Slides } from "./heroImages"

function HeroImage({ currentSlide }) {
    return (
        <motion.div
            variants={presets.fadeRight}
            className="flex-1"
        >
            <div className="flex-1 relative w-full aspect-[16/9] min-h-[200px]">
                {/* Gradient background behind image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent dark:from-primary/10 rounded-lg z-0 pointer-events-none" ></div>

                {/* Animated image container */}
                <div className="absolute inset-0 z-10">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentSlide}
                            src={Slides[currentSlide].img}
                            alt={Slides[currentSlide].key}
                            decoding="async"
                            loading="lazy"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="w-full h-full object-cover rounded-lg shadow-2xl"
                        />
                    </AnimatePresence>
                </div>
            </div>

        </motion.div>
    );
}

export default HeroImage