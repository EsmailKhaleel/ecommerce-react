import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { BiError } from "react-icons/bi";
import { useTranslation } from 'react-i18next';

import ProductsHeader from '../../features/products/ProductsHeader';
import FilterSideBar from '../../features/products/FilterSideBar';
import ProductGrid from '../../features/products/ProductGrid';
import ProductsLoading from '../../features/products/ProductsLoading';
import NoProductsFound from '../../features/products/NoProductsFound';
import Pagination from '../../Components/Pagination/Pagination';
import { useProducts } from '../../hooks/products/useProducts';

function Products() {
    const { t } = useTranslation();
    const [showFilters, setShowFilters] = useState(true);
    const {
        products,
        status,
        error,
        noResults,
        currentPage,
        totalPagesCount,
        handlePageChange
    } = useProducts();

    if (error || status === "failed")
        return (
            <div className='flex items-center gap-3 justify-center my-10'>
                <BiError className="text-red-500 text-3xl" />
                <div className='font-bold text-red-500'>{t('common.error')}</div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <ProductsHeader
                showFilters={showFilters}
                setShowFilters={setShowFilters}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="relative flex flex-col lg:flex-row gap-6 lg:gap-8">

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 bg-black/50 dark:bg-black/70 lg:hidden z-30"
                                onClick={() => setShowFilters(false)}
                            />
                        )}
                    </AnimatePresence>

                    <FilterSideBar
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                    />
                    <div className="flex-1 min-w-0">
                        {status === "loading" ? (
                            <ProductsLoading />
                        ) : noResults ? (
                            <NoProductsFound />
                        ) : (
                            <>
                                <ProductGrid products={products} />
                                <div className="mt-6 sm:mt-8">
                                    <Pagination
                                        pageCount={totalPagesCount}
                                        onPageChange={handlePageChange}
                                        currentPage={currentPage - 1}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Products;
