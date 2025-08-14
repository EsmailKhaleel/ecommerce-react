import { motion } from "framer-motion"
import { useTranslation } from 'react-i18next';
import { BiSearch, BiFilter } from 'react-icons/bi';
import useDebouncedValue from "./useDebouncedValue";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm } from '../../StateManagement/Slices/FilterSlice';

function ProductsHeader({ showFilters, setShowFilters }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [localSearchTerm, setLocalSearchTerm] = useState("");
    const debouncedSearchTerm = useDebouncedValue(localSearchTerm, 500);

    const {
        searchTerm,
        selectedCategory,
        selectedPriceRange,
        selectedRating
    } = useSelector((state) => state.filters);

    const hasActiveFilters = selectedCategory !== t('common.all') ||
        searchTerm ||
        selectedPriceRange !== null ||
        selectedRating !== null;

    useEffect(() => {
        dispatch(setSearchTerm(debouncedSearchTerm));
    }, [debouncedSearchTerm, dispatch]);

    const numActiveFilters = [selectedCategory !== t('common.all'), searchTerm, selectedPriceRange !== null, selectedRating !== null].filter(Boolean).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="sticky top-0 z-20 bg-gray-50/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center sm:text-left">{t('navigation.products')}</h1>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-none sm:w-[300px] lg:w-[400px]">
                            <input
                                type="text"
                                placeholder={t('products.searchPlaceholder')}
                                value={localSearchTerm}
                                onChange={(e) => setLocalSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-3 py-2.5 sm:py-3 outline-none border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                            />
                            <BiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 active:bg-primary/95 transition-all duration-200 w-full sm:w-auto"
                        >
                            <BiFilter size={20} />
                            <span>{t('common.filters')}</span>
                            {hasActiveFilters && (
                                <span className="inline-flex items-center justify-center bg-white text-primary rounded-full w-6 h-6 text-sm font-medium">
                                    {numActiveFilters}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default ProductsHeader