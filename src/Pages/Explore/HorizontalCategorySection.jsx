import LightProductCard from "../../Components/LightProductCard";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MdWatch } from 'react-icons/md';
import { GiMirrorMirror } from "react-icons/gi";
import { GiClothes } from "react-icons/gi";
import { GiDelicatePerfume } from "react-icons/gi";
import { LuSofa } from "react-icons/lu";
import { LiaLemonSolid } from "react-icons/lia";

export default function HorizontalCategorySection({ category, products, index }) {
    const cardWidth = 220;
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

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
                    {category}
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

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/products?category=${category}`)}
                className="mt-4 px-6 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
            >
                View All {category}
            </motion.button>
        </motion.section>
    );
}

export function BrowseByCategory() {
    const navigate = useNavigate();

    const categories = [
        { id: 1, name: 'Beauty', icon: GiMirrorMirror },
        { id: 2, name: 'Clothes', icon: GiClothes },
        { id: 3, name: 'Digital', icon: MdWatch },
        { id: 4, name: 'Fragrances', icon: GiDelicatePerfume },
        { id: 5, name: 'Furniture', icon: LuSofa },
        { id: 6, name: 'Groceries', icon: LiaLemonSolid },
    ];

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                {/* Title Section */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-2 h-8 bg-primary rounded"></div>
                    <h2 className="text-2xl font-bold">Categories</h2>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => navigate(`/products?category=${category.name.toLowerCase()}`)}
                            className="bg-white border border-gray-400 hover:bg-primary hover:text-white text-primary dark:bg-neutral-800 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
                        >
                            <category.icon className="text-4xl mb-3 " />
                            <h3 className="text-center font-medium dark:text-white">{category.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
