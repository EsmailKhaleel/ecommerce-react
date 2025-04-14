import React, { useEffect, useState } from 'react';
import { BiError } from "react-icons/bi";
import Spinner from '../../Components/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../StateManagement/Slices/CartSlice';
import ProductCard from '../../Components/ProductCard';

function Products() {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const products = cart.products;
    const status = cart.status;
    const error = cart.error;

    const minPrice = products.length ? Math.min(...products.map(p => p.price)) : 0;
    const maxPrice = products.length ? Math.max(...products.map(p => p.price)) : 5000;

    const [priceRange, setPriceRange] = useState(maxPrice);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length]);

    useEffect(() => {
        const filtered = products.filter(product => product.price <= priceRange);
        setFilteredProducts(filtered);
    }, [priceRange, products]);

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
            {/* Filter UI */}
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Filter by Price</h2>
                <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    step="10"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-primary"
                />
                <div className="flex justify-between text-gray-700 dark:text-gray-300 mt-2">
                    <span>Min: {minPrice} EG</span>
                    <span>Max: {maxPrice} EG</span>
                    <span>Selected: <strong>{priceRange} EG</strong></span>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <ProductCard product={product} key={product.id} />
                    ))
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">No products found within this price range.</p>
                )}
            </div>
        </div>
    );
}

export default Products;
