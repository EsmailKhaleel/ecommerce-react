import LightProductCard from "../../Components/LightProductCard";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";

export default function HorizontalCategorySection({ category, products, index }) {
    const cardWidth = 210;
    const [isHovered, setIsHovered] = useState(false);

    // Determine direction: even indices move right-to-left, odd indices move left-to-right
    const isMovingLeft = index % 2 === 0;

    // Create enough duplicates for seamless infinite scroll
    const duplicatedProducts = useMemo(() => {
        if (products.length === 0) return [];
        // Create 3 copies to ensure seamless scrolling
        return [...products, ...products, ...products];
    }, [products]);

    // Calculate total width of one set of products
    const singleSetWidth = products.length * (cardWidth);
    const totalWidth = duplicatedProducts.length * (cardWidth);

    // Animation configuration - consistent duration for all sections
    const animationDuration = isHovered ? 80 : 40; // Slower when hovered

    // Calculate animation range based on direction
    const animationConfig = useMemo(() => {
        if (isMovingLeft) {
            // Moving from right to left
            return {
                from: 0,
                to: -singleSetWidth
            };
        } else {
            // Moving from left to right
            return {
                from: -singleSetWidth,
                to: 0
            };
        }
    }, [isMovingLeft, singleSetWidth]);

    if (products.length === 0) {
        return null;
    }

    return (
        <motion.section
            aria-labelledby={`category-${category}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                delay: index * 0.1,
                duration: 0.6,
                ease: "easeOut"
            }}
            className="mb-2.5"
        >
            <motion.h2
                id={`category-${category}`}
                className="pl-4 text-3xl font-bold text-gray-800 dark:text-white mb-2.5 capitalize tracking-tight"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2 }}
            >
                {category}
            </motion.h2>

            <div
                className="relative overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <motion.div
                    className="flex gap-1 will-change-transform"
                    animate={{
                        x: animationConfig.to
                    }}
                    initial={{
                        x: animationConfig.from
                    }}
                    transition={{
                        duration: animationDuration,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop"
                    }}
                    style={{
                        width: totalWidth
                    }}
                >
                    {duplicatedProducts.map((product, idx) => (
                        <motion.div
                            key={`${product.id}-${idx}-${category}`}
                            className="flex-shrink-0"
                            style={{ width: cardWidth }}
                            whileHover={{
                                scale: 1.05,
                                zIndex: 10,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <LightProductCard product={product} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <div className="text-xs text-gray-400 mt-2">
                Direction: {isMovingLeft ? '←' : '→'} | Products: {products.length}
            </div>
        </motion.section>
    );
}
