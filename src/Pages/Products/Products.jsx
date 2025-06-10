import { useEffect, useState } from 'react';
import { BiError } from "react-icons/bi";
import { FaSort } from "react-icons/fa";
import Spinner from '../../Components/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../StateManagement/Slices/CartSlice';
import ProductCard from '../../Components/ProductCard';

function Products() {
    const dispatch = useDispatch();
    const { products, status, error } = useSelector((state) => state.cart);

    // Price range state
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [currentPriceRange, setCurrentPriceRange] = useState(null);
    
    // Sorting state
    const [sortOrder, setSortOrder] = useState('none'); // 'none', 'asc', 'desc'
    
    // Filtered products state
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Fetch products on mount
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    // Set initial price range when products are loaded
    useEffect(() => {
        if (products.length) {
            const prices = products.map(p => p.price);
            const min = Math.floor(Math.min(...prices));
            const max = Math.ceil(Math.max(...prices));
            
            setMinPrice(min);
            setMaxPrice(max);
            setCurrentPriceRange(max);
        }
    }, [products]);

    // Filter and sort products when dependencies change
    useEffect(() => {
        if (!products.length) return;

        let result = [...products];

        // Apply price filter
        if (currentPriceRange !== null) {
            result = result.filter(product => product.price <= currentPriceRange);
        }

        // Apply sorting
        if (sortOrder !== 'none') {
            result.sort((a, b) => {
                if (sortOrder === 'asc') {
                    return a.price - b.price;
                } else {
                    return b.price - a.price;
                }
            });
        }

        setFilteredProducts(result);
    }, [currentPriceRange, products, sortOrder]);

    // Handle sort button click
    const handleSortClick = () => {
        setSortOrder(current => {
            switch (current) {
                case 'none': return 'asc';
                case 'asc': return 'desc';
                default: return 'none';
            }
        });
    };

    if (error || status === "failed")
        return (
            <div className='flex items-center gap-3 justify-center my-10'>
                <BiError className="text-red-500 text-3xl" />
                <div className='font-bold text-red-500'>Something went wrong!</div>
            </div>
        );

    if (status === "loading")
        return (
            <div className='flex items-center gap-3 justify-center my-10'>
                <Spinner />
            </div>
        );

    return (
        <div className="p-5">
            {/* Filter and Sort UI */}
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Filter by Price</h2>
                    <button 
                        onClick={handleSortClick}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors
                            ${sortOrder === 'none' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-primary text-white'}`}
                    >
                        <FaSort />
                        {sortOrder === 'asc' ? 'Price: Low to High' : 
                         sortOrder === 'desc' ? 'Price: High to Low' : 
                         'Sort by Price'}
                    </button>
                </div>
                
                {minPrice === null || maxPrice === null ? (
                    <div className='flex items-center gap-3 justify-center my-4'>
                        <Spinner />
                    </div>
                ) : (
                    <>
                        <input
                            type="range"
                            min={minPrice}
                            max={maxPrice}
                            value={currentPriceRange}
                            onChange={(e) => setCurrentPriceRange(Number(e.target.value))}
                            className="w-full accent-primary"
                        />
                        <div className="flex justify-between text-gray-700 dark:text-gray-300 mt-2">
                            <span>Min: {minPrice.toFixed(2)} EGP</span>
                            <span>Selected: <strong>{currentPriceRange.toFixed(2)} EGP</strong></span>
                            <span>Max: {maxPrice.toFixed(2)} EGP</span>
                        </div>
                    </>
                )}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <ProductCard product={product} key={product.id} />
                    ))
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-10">
                        No products found within the selected price range.
                    </p>
                )}
            </div>
        </div>
    );
}

export default Products;
