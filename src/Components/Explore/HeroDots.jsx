import { motion } from 'framer-motion'
import { presets } from '../../utils/motion'
import { Slides } from './heroImages'

function HeroDots({ currentSlide, setCurrentSlide }) {
    return (
        <motion.div
            variants={presets.fadeUpDots}
            className="z-20 absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3"
        >
            {Slides.map((_, index) => (
                <button
                    key={index}
                    title={`Slide ${index + 1}`}
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index
                        ? 'bg-primary w-6'
                        : 'bg-gray-400 hover:bg-primary/50'
                        }`}
                />
            ))}
        </motion.div>
    )
}

export default HeroDots