import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function LightProductCard({ product }) {
    const navigate = useNavigate();

    return (
        <motion.div
            className="bg-white relative w-[200px] h-[200px] rounded-sm overflow-hidden cursor-pointer"
            whileHover="hover"
            initial="initial"
        >
            {/* Image */}
            <motion.img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            />

            {/* Product Info */}
            <div className="absolute flex justify-between items-center bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white z-10">
                <h3 className="text-lg font-semibold text-ellipsis max-w-[100px] overflow-hidden text-nowrap">{product.name}</h3>
                <p className="text-lg font-bold">
                    ${product.price}
                </p>
            </div>

            {/* Hover Overlay */}
            <motion.div
                className="absolute inset-0 bg-black/60 flex flex-col items-center justify-start p-6 text-white"
                initial={{ opacity: 0 }}
                variants={{
                    hover: { opacity: 1 },
                    initial: { opacity: 0 }
                }}
                transition={{ duration: 0.2 }}
            >
                <p className="text-sm text-gray-200 mb-4 text-center line-clamp-3">
                    {product.description}
                </p>
                <motion.button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05, backgroundColor: '#a15d09' }}
                >
                    Order Now
                </motion.button>
            </motion.div>
        </motion.div>
    );
}

export default LightProductCard;
