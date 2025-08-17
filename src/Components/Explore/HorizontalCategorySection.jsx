import LightProductCard from "../LightProductCard";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CARD_WIDTH = 220;
const SCROLL_DURATION = { normal: 40, slow: 80 };

export default function HorizontalCategorySection({ category, products, index }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isMovingLeft, setIsMovingLeft] = useState(index % 2 === 0);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    // if the app is in RTL mode, reverse the direction in useEffect
  useEffect(() => {
    if (i18n.dir() === "rtl") {
      setIsMovingLeft((prev) => !prev);
    } else if (i18n.dir() === "ltr") {
        setIsMovingLeft(index % 2 === 0);
    }
  }, [i18n, i18n.language, index]);

    // Create enough duplicates for seamless infinite scroll
    const duplicatedProducts = useMemo(() => {
        if (products.length === 0) return [];
        // Create 3 copies to ensure seamless scrolling
        return [...products, ...products, ...products];
    }, [products]);

    // Calculate total width of one set of products
    const singleSetWidth = products.length * (CARD_WIDTH);
    const totalWidth = duplicatedProducts.length * (CARD_WIDTH);

    // Animation configuration - consistent duration for all sections

  // Animation config based on direction
  const animationConfig = useMemo(() => {
    return isMovingLeft
      ? { from: 0, to: -singleSetWidth }
      : { from: -singleSetWidth, to: 0 };
  }, [isMovingLeft, singleSetWidth]);

    if (products.length === 0) return null;

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
            className="mb-10 px-2"
        >
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-8 bg-primary rounded"></div>

                <motion.h2
                    id={`category-${category}`}
                    className="text-3xl font-bold text-neutral dark:text-neutral-light capitalize tracking-tight"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                >
                    {t(`products.categories.${category.toLowerCase()}`)}
                </motion.h2>
            </div>

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
                        duration: isHovered ? SCROLL_DURATION.slow : SCROLL_DURATION.normal,
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
                            style={{ width: CARD_WIDTH }}
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

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/products?category=${category}`)}
                className="mt-4 px-6 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
            >
                {t('common.viewAll')} {t(`products.categories.${category.toLowerCase()}`)}
            </motion.button>
        </motion.section>
    );
}
