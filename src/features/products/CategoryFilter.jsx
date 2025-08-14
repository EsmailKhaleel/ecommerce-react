import { AnimatePresence, motion } from "framer-motion";
import { setSelectedCategory, toggleSection } from "../../StateManagement/Slices/FilterSlice";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import Spinner from "../../Components/Spinner";
import useWindowWidth from "./useWindowWidth";
import useCategories from "../../hooks/useCategories";


function CategoryFilter({ setShowFilters }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { selectedCategory, expandedSections } = useSelector((state) => state.filters);
    const { data: categories = [], isPending } = useCategories();
    const width = useWindowWidth();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4" >
            <button
                onClick={() => dispatch(toggleSection('categories'))}
                className="w-full flex items-center justify-between text-base font-semibold text-gray-900 dark:text-white mb-2 py-1"
            >
                {t('products.category')}
                {expandedSections.categories ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
            </button>
            <AnimatePresence>
                {expandedSections.categories && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1 overflow-hidden"
                    >
                        {isPending ? (
                            <div className="flex justify-center items-center py-4">
                                <Spinner />
                            </div>
                        ) : categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        dispatch(setSelectedCategory(category));
                                        if (width < 1024) {
                                            setShowFilters(false);
                                        }
                                    }}
                                    className={`w-full text-left px-3 py-2.5 rounded-md transition-colors duration-200 text-sm ${selectedCategory === category
                                        ? "bg-primary text-white"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    {t(`products.categories.${category.toLowerCase()}`)}
                                </button>
                            ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    )
}

export default CategoryFilter