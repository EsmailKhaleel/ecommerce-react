import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { BiError, BiSearch, BiFilter, BiX, BiChevronDown, BiChevronUp } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useLocation } from 'react-router-dom';
import { fetchProducts } from '../../StateManagement/Slices/ProductsSlice';
import ProductCard from '../../Components/ProductCard';
import ProductCardSkeleton from '../../Components/ProductCardSkeleton';
import Pagination from '../../Components/Pagination/Pagination';
import axiosInstance from '../../utils/axiosInstance';
import { v4 as uuidv4 } from 'uuid';
import  {Rating}  from '../../Components/Rating';

const fetchCategories = async () => {
    const response = await axiosInstance.get('/products/categories');
    return ["All", ...response.data.categories];
};

function Products() {
    const dispatch = useDispatch();
    const { products, status, error, page, totalPages } = useSelector((state) => state.products);
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    const { data: categories = ["All"] } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 5 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
    });

    // Ensuring we have valid pagination values
    const currentPage = Math.max(1, page || 1);
    const totalPagesCount = Math.max(0, totalPages || 0);

    // State management
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(() => {
        // Initialize category from URL query parameter
        const categoryFromUrl = searchParams.get('category');
        return categoryFromUrl && categories.includes(categoryFromUrl) ? categoryFromUrl : "All";
    });
    const [sortOrder, setSortOrder] = useState("desc");
    const [showFilters, setShowFilters] = useState(false);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [noResults, setNoResults] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        price: true,
        sort: true,
        rating: true
    });
    
    const [selectedRating, setSelectedRating] = useState(null);

    // Update URL when category changes
    useEffect(() => {
        if (selectedCategory === "All") {
            searchParams.delete('category');
        } else {
            searchParams.set('category', selectedCategory);
        }
        setSearchParams(searchParams);
    }, [selectedCategory, searchParams, setSearchParams]);

    // Update category when URL changes    
    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl && categories.includes(categoryFromUrl)) {
            setSelectedCategory(categoryFromUrl);
        }
    }, [location.search, categories, searchParams]);

    const fetchProductsWithFilters = useCallback((page = 1) => {
        dispatch(fetchProducts({
            page,
            limit: 8,
            category: selectedCategory !== "All" ? selectedCategory : undefined,
            q: searchTerm || undefined,
            _sort: "price",
            _order: sortOrder,
            minPrice: selectedPriceRange?.min,
            maxPrice: selectedPriceRange?.max,
            rating: selectedRating
        }));
    }, [dispatch, selectedCategory, searchTerm, sortOrder, selectedPriceRange, selectedRating]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        fetchProductsWithFilters(1);
    };

    const handlePageChange = ({ selected }) => {
        fetchProductsWithFilters(selected + 1);
        // Scroll to top of the page when pagination changes
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    };

    // Fetch products when filters change
    useEffect(() => {
        fetchProductsWithFilters(1);
    }, [fetchProductsWithFilters]);

    // Set initial price range when products are loaded
    useEffect(() => {
        if (products.length) {
            const prices = products.map(p => p.price);
            const min = Math.floor(Math.min(...prices));
            const max = Math.ceil(Math.max(...prices));
            
            setMinPrice(min);
            setMaxPrice(max);
        }
        // Update no results state
        setNoResults(products.length === 0 && status !== "loading");
    }, [products, status]);

    const clearFilters = useCallback(() => {
        setSelectedCategory("All");
        setSearchTerm("");
        setSortOrder("asc");
        setSelectedPriceRange(null);
        setSelectedRating(null);
        fetchProductsWithFilters(1);
    }, [fetchProductsWithFilters]);

    const hasActiveFilters = selectedCategory !== "All" || 
        searchTerm || 
        sortOrder !== "asc" || 
        selectedPriceRange !== null ||
        selectedRating !== null;

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const priceRanges = [
        { label: "Under $ 25", min: 0, max: 25 },
        { label: "$ 25 to $ 50", min: 25, max: 50 },
        { label: "$ 50 to $ 100", min: 50, max: 100 },
        { label: "$ 100 to $ 200", min: 100, max: 200 },
        { label: "$ 200 to $ 500", min: 200, max: 500 },
        { label: "$ 500 to $ 1000", min: 500, max: 1000 },
        { label: "$ 1000 to $ 5000", min: 1000, max: 5000 },
        { label: "$ 5000 to $ 10000", min: 5000, max: 10000 },
        { label: "$ 10000 to $ 50000", min: 10000, max: 50000 },
        { label: "$ 50000 & Above", min: 50000, max: null }
    ];

    if (error || status === "failed")
        return (
            <div className='flex items-center gap-3 justify-center my-10'>
                <BiError className="text-red-500 text-3xl" />
                <div className='font-bold text-red-500'>Something went wrong!</div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sticky Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="sticky top-0 z-20 bg-gray-50/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center sm:text-left">Products</h1>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none sm:w-[300px] lg:w-[400px]">
                                <input
                                    type="text"
                                    placeholder="Search for products..."
                                    onChange={handleSearch}
                                    className="w-full pl-10 pr-3 py-2.5 sm:py-3 outline-none border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                />
                                <BiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 active:bg-primary/95 transition-all duration-200 w-full sm:w-auto"
                            >
                                <BiFilter size={20} />
                                <span>Filters</span>
                                {hasActiveFilters && (
                                    <span className="inline-flex items-center justify-center bg-white text-primary rounded-full w-6 h-6 text-sm font-medium">
                                        {[selectedCategory !== "All", searchTerm, sortOrder !== "asc", selectedPriceRange !== null].filter(Boolean).length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="relative flex flex-col lg:flex-row gap-6 lg:gap-8">
                    <AnimatePresence>
                        {/* Mobile Backdrop */}
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

                    {/* Filters Sidebar */}
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

                                        {hasActiveFilters && (
                                            <button
                                                onClick={clearFilters}
                                                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 text-sm"
                                            >
                                                <BiX size={18} />
                                                Clear All Filters
                                            </button>
                                        )}

                                        {/* Categories Section */}
                                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                                            <button
                                                onClick={() => toggleSection('categories')}
                                                className="w-full flex items-center justify-between text-base font-semibold text-gray-900 dark:text-white mb-2 py-1"
                                            >
                                                Categories
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
                                                        {categories.map((category) => (
                                                            <button
                                                                key={category}
                                                                onClick={() => {
                                                                    setSelectedCategory(category);
                                                                    if (window.innerWidth < 1024) {
                                                                        setShowFilters(false);
                                                                    }
                                                                }}
                                                                className={`w-full text-left px-3 py-2.5 rounded-md transition-colors duration-200 text-sm ${
                                                                    selectedCategory === category
                                                                        ? "bg-primary text-white"
                                                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                }`}
                                                            >
                                                                {category}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Rating Filter Section */}
                                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                                            <button
                                                onClick={() => toggleSection('rating')}
                                                className="w-full flex items-center justify-between text-base font-semibold text-gray-900 dark:text-white mb-2 py-1"
                                            >
                                                Rating
                                                {expandedSections.rating ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
                                            </button>
                                            <AnimatePresence>
                                                {expandedSections.rating && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="space-y-2 overflow-hidden"
                                                    >
                                                        {[5, 4, 3, 2, 1].map((rating) => (
                                                            <button
                                                                key={rating}
                                                                onClick={() => {
                                                                    setSelectedRating(selectedRating === rating ? null : rating);
                                                                    fetchProductsWithFilters(1);
                                                                    if (window.innerWidth < 1024) {
                                                                        setShowFilters(false);
                                                                    }
                                                                }}
                                                                className={`w-full flex items-center gap-2 p-2 rounded-md transition-colors duration-200 ${selectedRating === rating ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                                            >
                                                                <Rating rating={rating} />
                                                                <span className="text-sm">{rating} & Up</span>
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Price Range Section */}
                                        {minPrice !== null && maxPrice !== null && (
                                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                                                <button
                                                    onClick={() => toggleSection('price')}
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
                                                                        onChange={() => {
                                                                            if (selectedPriceRange?.min === range.min && selectedPriceRange?.max === range.max) {
                                                                                setSelectedPriceRange(null);
                                                                            } else {
                                                                                setSelectedPriceRange(range);
                                                                            }
                                                                            fetchProductsWithFilters(1);
                                                                            if (window.innerWidth < 1024) {
                                                                                setShowFilters(false);
                                                                            }
                                                                        }}
                                                                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                                                    />
                                                                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-grow">
                                                                        {range.label}
                                                                    </span>
                                                                </label>
                                                            ))}

                                                            {selectedPriceRange && (
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedPriceRange(null);
                                                                        fetchProductsWithFilters(1);
                                                                        if (window.innerWidth < 1024) {
                                                                            setShowFilters(false);
                                                                        }
                                                                    }}
                                                                    className="w-full px-3 py-2 text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                                                                >
                                                                    Clear Price Filter
                                                                </button>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}

                                        {/* Sort Order Section */}
                                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                                            <button
                                                onClick={() => toggleSection('sort')}
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
                                                            onClick={() => {
                                                                setSortOrder("asc");
                                                                if (window.innerWidth < 1024) {
                                                                    setShowFilters(false);
                                                                }
                                                            }}
                                                            className={`w-full text-left px-3 py-2.5 rounded-md transition-colors duration-200 text-sm ${
                                                                sortOrder === "asc"
                                                                    ? "bg-primary text-white"
                                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            }`}
                                                        >
                                                            Price: Low to High
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSortOrder("desc");
                                                                if (window.innerWidth < 1024) {
                                                                    setShowFilters(false);
                                                                }
                                                            }}
                                                            className={`w-full text-left px-3 py-2.5 rounded-md transition-colors duration-200 text-sm ${
                                                                sortOrder === "desc"
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
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Products Grid */}
                    <div className="flex-1 min-w-0">
                        {status === "loading" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {[...Array(8)].map((_, index) => (
                                    <ProductCardSkeleton key={index} />
                                ))}
                            </div>
                        ) : noResults ? (
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
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        <BiX size={20} />
                                        Clear All Filters
                                    </button>
                                )}
                            </motion.div>
                        ) : (
                            <>
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
