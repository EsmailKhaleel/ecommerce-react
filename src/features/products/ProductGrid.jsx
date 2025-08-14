import { motion } from "framer-motion";
import ProductCard from '../../Components/ProductCard';
import { v4 as uuidv4 } from 'uuid';

function ProductGrid({ products }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2">
            {products.map((product, index) => (
                <motion.div
                    key={product.id || uuidv4()}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{
                        once: true,
                        margin: "-50px",
                        amount: 0.3
                    }}
                    transition={{
                        duration: 0.5,
                        delay: (index % 3) * 0.1,
                        ease: "easeOut"
                    }}
                >
                    <ProductCard product={product} />
                </motion.div>
            ))}
        </div>
    );
}

export default ProductGrid;
