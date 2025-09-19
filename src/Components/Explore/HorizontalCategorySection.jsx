import LightProductCard from "../LightProductCard";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Marquee from "react-fast-marquee";

export default function HorizontalCategorySection({ category, products, index }) {
    const [isMovingLeft, setIsMovingLeft] = useState(index % 2 === 0);
    const { t, i18n } = useTranslation();
    
    useEffect(() => {
        if (i18n.dir() === "rtl") {
            setIsMovingLeft((prev) => !prev);
        } else if (i18n.dir() === "ltr") {
            setIsMovingLeft(index % 2 === 0);
        }
    }, [i18n, i18n.language, index]);

    // Create duplicate products to ensure smooth scrolling
    const extendedProducts = [...products, ...products, ...products];

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

            <div className="relative overflow-hidden keep-ltr">
                <Marquee
                    direction={isMovingLeft ? "left" : "right"}
                    speed={40}
                    gradient={false}
                    pauseOnHover
                    play
                >
                    {extendedProducts.map((product, idx) => (
                        <div
                            key={`${product.id}-${idx}-${category}`}
                            className="flex-shrink-0 px-1 flex justify-center items-center gap-2"
                        >
                            <LightProductCard product={product} />
                        </div>
                    ))}
                </Marquee>
            </div>
        </motion.section>
    );
}
