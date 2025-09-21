import { useDispatch, useSelector } from 'react-redux';
import { setSelectedPriceRange, toggleSection } from '../../StateManagement/Slices/FilterSlice';
import { BiChevronDown, BiChevronUp, } from 'react-icons/bi';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import useWindowWidth from '../../hooks/useWindowWidth';

function PriceRangeFilter({ setShowFilters }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const width = useWindowWidth();
    const { selectedPriceRange, expandedSections } = useSelector((state) => state.filters);

    const handlePriceRangeClick = (range) => {
        if (selectedPriceRange?.min === range.min && selectedPriceRange?.max === range.max) {
            dispatch(setSelectedPriceRange(null));
        } else {
            dispatch(setSelectedPriceRange(range));
        }
        if (width < 1024) {
            setShowFilters(false);
        }
    }

    const handleClearPriceFilter = () => {
        dispatch(setSelectedPriceRange(null));
        if (width < 1024) {
            setShowFilters(false);
        }
    }
    const priceRanges = [
        { label: t('products.priceRanges.under25', 'Under $ 25'), min: 0, max: 25 },
        { label: t('products.priceRanges.between25And50', '$ 25 to $ 50'), min: 25, max: 50 },
        { label: t('products.priceRanges.between50And100', '$ 50 to $ 100'), min: 50, max: 100 },
        { label: t('products.priceRanges.between100And200', '$ 100 to $ 200'), min: 100, max: 200 },
        { label: t('products.priceRanges.between200And500', '$ 200 to $ 500'), min: 200, max: 500 },
        { label: t('products.priceRanges.between500And1000', '$ 500 to $ 1000'), min: 500, max: 1000 },
        { label: t('products.priceRanges.between1000And5000', '$ 1000 to $ 5000'), min: 1000, max: 5000 },
        { label: t('products.priceRanges.between5000And10000', '$ 5000 to $ 10000'), min: 5000, max: 10000 },
        { label: t('products.priceRanges.between10000And50000', '$ 10000 to $ 50000'), min: 10000, max: 50000 },
        { label: t('products.priceRanges.above50000', '$ 50000 & Above'), min: 50000, max: null }
    ];
    return (<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <button
            onClick={() => dispatch(toggleSection('price'))}
            className="w-full flex items-center justify-between text-base font-semibold text-gray-900 dark:text-white mb-2 py-1"
        >
            Price Range
            {expandedSections.price ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
        </button>
        <AnimatePresence>
            {expandedSections.price && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1 overflow-hidden"
                >
                    {priceRanges.map((range) => (
                        <label
                            key={range.label}
                            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                        >
                            <input
                                type="checkbox"
                                checked={selectedPriceRange?.min === range.min && selectedPriceRange?.max === range.max}
                                onChange={() => handlePriceRangeClick(range)}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300 flex-grow">
                                {range.label}
                            </span>
                        </label>
                    ))}

                    {selectedPriceRange && (
                        <button
                            onClick={handleClearPriceFilter}
                            className="w-full px-3 py-2 text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                        >
                            Clear Price Filter
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
    )
}

export default PriceRangeFilter