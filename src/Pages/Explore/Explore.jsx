import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../Components/ProductCard";
import { BiSearch, BiFilter, BiError } from "react-icons/bi";
import { fetchProducts } from "../../StateManagement/Slices/CartSlice";
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../../Components/Spinner';
import debounce from 'lodash/debounce';
import Hero from "../../Components/Hero/Hero";

function Explore() {
    const dispatch = useDispatch();
    const { products, status } = useSelector((state) => state.cart);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("asc");
    const [showFilters, setShowFilters] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const categories = ["All", ...new Set(products.map(p => p.category))];

    const debouncedSearch = debounce((value) => {
        setSearchTerm(value);
    }, 300);

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length]);

    useEffect(() => {
        let filtered = [...products];
        
        // Category filter
        if (selectedCategory !== "All") {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Alphabetical sorting
        filtered.sort((a, b) => {
            if (sortOrder === "asc") {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });

        setFilteredProducts(filtered);
    }, [searchTerm, selectedCategory, sortOrder, products]);

    const clearFilters = () => {
        setSelectedCategory("All");
        setSearchTerm("");
        setSortOrder("asc");
    };

    const hasActiveFilters = selectedCategory !== "All" || searchTerm || sortOrder !== "asc";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Hero />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header & Search */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explore Products</h1>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <BiFilter size={20} />
                            Filters
                            {hasActiveFilters && (
                                <span className="bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                                    {[selectedCategory !== "All", searchTerm, sortOrder !== "asc"].filter(Boolean).length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            onChange={(e) => debouncedSearch(e.target.value)}
                            className="w-full p-4 pl-12 border-1 border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 dark:text-white  focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm"
                        />
                        <BiSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={24} />
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl mb-8 transform transition-all duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filters</h2>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                >
                                    {categories.map((category) => (
                                        <option key={uuidv4()} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort Order */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort Order</label>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                >
                                    <option value="asc">A to Z</option>
                                    <option value="desc">Z to A</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard 
                                product={product} 
                                key={product.id}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No products found.</p>
                        </div>
                    )}
                </div>

                {/* Status Handling */}
                {status === "loading" && (
                    <div className="flex justify-center my-12">
                        <Spinner />
                    </div>
                )}

                {status === "failed" && (
                    <div className="flex items-center gap-3 justify-center my-12 text-red-500 font-bold">
                        <BiError className="text-3xl" />
                        <span>Something went wrong! Please try again.</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Explore;
