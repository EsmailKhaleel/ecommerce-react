import { motion, AnimatePresence } from 'framer-motion';
import placeholderImage from '../../assets/unavailable.png';
import { useState } from 'react';

function ProductGallery({ product }) {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex gap-5 flex-row-reverse justify-end"
        >
            {/* Main Product Image */}
            <motion.div
                layoutId={`product-image-${product.id}`}
                className="w-[450px] h-[450px] dark:bg-gray-800 rounded-lg overflow-hidden mb-4 flex items-center justify-center"
            >
                <motion.img
                    key={selectedImage || product.image}
                    src={selectedImage || product.image}
                    alt={product.name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = placeholderImage;
                    }}
                    className="w-[450px] h-[450px] object-contain p-2"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
                <div className="p-1 flex flex-col gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    <AnimatePresence>
                        {product.images?.map((image, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative rounded overflow-hidden flex-shrink-0 cursor-pointer
                                                ${selectedImage === image ? 'ring-2 ring-primary' : 'ring-1 ring-gray-200 dark:ring-gray-600'}`}
                                onClick={() => setSelectedImage(image)}
                            >
                                <motion.img
                                    src={image}
                                    alt={`${product.name} view ${index + 1}`}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = placeholderImage;
                                    }}
                                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain bg-white dark:bg-gray-800"
                                    transition={{ duration: 0.2 }}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    )
}

export default ProductGallery