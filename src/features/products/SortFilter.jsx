import { useDispatch, useSelector } from 'react-redux';
import { toggleSection, setSortOrder } from '../../StateManagement/Slices/FilterSlice';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { AnimatePresence, motion } from 'framer-motion';
import useWindowWidth from './useWindowWidth';

function SortFilter({ setShowFilters }) {
    const dispatch = useDispatch();
    const { expandedSections, sortOrder } = useSelector((state) => state.filters);
    const width = useWindowWidth();

    const handleSortOrderClick = (order) => {
        dispatch(setSortOrder(order));
        if (width < 1024) {
            setShowFilters(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <button
                onClick={() => dispatch(toggleSection('sort'))}
                className="w-full flex items-center justify-between text-base font-semibold text-gray-900 dark:text-white mb-2 py-1"
            >
                Sort Order
                {expandedSections.sort ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
            </button>
            <AnimatePresence>
                {expandedSections.sort && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1 overflow-hidden"
                    >
                        <button
                            onClick={() => handleSortOrderClick("asc")}
                            className={`w-full text-left px-3 py-2.5 rounded-md transition-colors duration-200 text-sm ${sortOrder === "asc"
                                ? "bg-primary text-white"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                        >
                            Price: Low to High
                        </button>
                        <button
                            onClick={() => handleSortOrderClick("desc")}
                            className={`w-full text-left px-3 py-2.5 rounded-md transition-colors duration-200 text-sm ${sortOrder === "desc"
                                ? "bg-primary text-white"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                        >
                            Price: High to Low
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default SortFilter