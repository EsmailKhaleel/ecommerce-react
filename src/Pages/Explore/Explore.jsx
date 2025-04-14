import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../Components/ProductCard";
import { BiSearch, BiFilter, BiError } from "react-icons/bi";
import { fetchProducts } from "../../StateManagement/Slices/CartSlice";
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../../Components/Spinner'
function Explore() {
    const dispatch = useDispatch();
    const { products, status } = useSelector((state) => state.cart);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [filteredProducts, setFilteredProducts] = useState([]);

    const categories = ["All", ...new Set(products.map(p => p.category))];

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length]);

    useEffect(() => {
        let filtered = products;
        if (selectedCategory !== "All") {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredProducts(filtered);
    }, [searchTerm, selectedCategory, products]);

    return (
        <div className="p-5">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-secondary dark:text-white">Explore Products</h1>

                {/* Search Input */}
                <div className="relative w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:ring-primary focus:border-primary"
                    />
                    <BiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
                </div>

                {/* Category Dropdown */}
                <div className="relative">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="p-3 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:ring-primary focus:border-primary"
                    >
                        {categories.map((category) => (
                            <option key={uuidv4()} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <BiFilter className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => <ProductCard product={product} key={product.id} />)
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">No products found.</p>
                )}
            </div>
            {/* Status Handling */}
            {status === "loading" && (
                <div className="flex justify-center my-10">
                    <Spinner />
                </div>
            )}

            {status === "failed" && (
                <div className="flex items-center gap-3 justify-center my-10 text-red-500 font-bold">
                    <BiError className="text-3xl" />
                    <span>Something went wrong! Please try again.</span>
                </div>
            )}
        </div>
    );
}

export default Explore;
