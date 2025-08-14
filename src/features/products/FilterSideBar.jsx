import { AnimatePresence, motion } from "framer-motion"
import { useDispatch } from 'react-redux';
import { clearFilters } from '../../StateManagement/Slices/FilterSlice';
import { BiX } from "react-icons/bi";
import CategoryFilter from './CategoryFilter';
import RatingFilter from './RatingFilter';
import PriceRangeFilter from './PriceRangeFilter';
import SortFilter from './SortFilter';

function FilterSideBar({ showFilters, setShowFilters }) {

    const dispatch = useDispatch();
    return (
        <AnimatePresence>
            {showFilters && (
                <>
                    {/* Sidebar Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed lg:relative inset-y-0 left-0 w-[280px] lg:w-64 bg-gray-50 dark:bg-gray-900 lg:bg-transparent z-40 lg:z-0 overflow-y-auto"
                    >
                        <div className="sticky top-0 p-4 lg:p-0 space-y-3">
                            <div className="flex items-center justify-between lg:hidden mb-4">
                                <h2 className="text-lg font-semibold">Filters</h2>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                                >
                                    <BiX size={24} />
                                </button>
                            </div>

                            <button
                                onClick={() => dispatch(clearFilters())}
                                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 text-sm"
                            >
                                <BiX size={18} />
                                Clear All Filters
                            </button>

                            <CategoryFilter
                                setShowFilters={setShowFilters}
                            />

                            <RatingFilter
                                setShowFilters={setShowFilters}
                            />

                            <PriceRangeFilter
                                setShowFilters={setShowFilters}
                            />

                            <SortFilter
                                setShowFilters={setShowFilters}
                            />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default FilterSideBar