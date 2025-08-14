import { motion } from "framer-motion";
import { BiError, BiX } from "react-icons/bi";
import { useDispatch } from 'react-redux';
import { clearFilters } from '../../StateManagement/Slices/FilterSlice';

function NoProductsFound() {
    const dispatch = useDispatch();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 px-4"
        >
            <BiError className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Products Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                We could not find any products matching your search criteria. Try adjusting your filters or search term.
            </p>
            <button
                onClick={() => dispatch(clearFilters())}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
                <BiX size={20} />
                Clear All Filters
            </button>
        </motion.div>
    );
}

export default NoProductsFound;
