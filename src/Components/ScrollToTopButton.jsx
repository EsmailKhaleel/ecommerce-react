import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useEffect, useState } from "react";
import { BiArrowToTop } from "react-icons/bi"

const SCROLL_THRESHOLD = 400;

function ScrollToTopButton() {
    const [showScrollTop, setShowScrollTop] = useState(false);
    
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setShowScrollTop(window.scrollY > SCROLL_THRESHOLD);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <AnimatePresence>
            {showScrollTop && (
                <motion.button
                    aria-label="Scroll to top"
                    title="Scroll to top"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-primary shadow-lg hover:bg-primary/90 transition-colors duration-300 text-white flex items-center justify-center group"
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <BiArrowToTop className="text-2xl group-hover:animate-bounce" />
                </motion.button>
            )}
        </AnimatePresence>
    )
}

export default ScrollToTopButton