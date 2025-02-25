import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { BiHeart, BiSolidHeart } from 'react-icons/bi';
import { BiShoppingBag } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decreaseQuantity, toggleFav } from "../StateManagement/Slices/CartSlice";
import Spinner from "./Spinner";

function ProductDetails() {
    const [isDetailsShown, setIsDetailsShown] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const { id } = useParams();
    const dispatch = useDispatch();

    // Fetch Product Details
    const { data: product, error, isLoading } = useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/products/${id}`);
            return data;
        },
    });

    // Get the product in cart if it exists
    const cartProduct = useSelector((state) =>
        state.cart.cartProducts.find((item) => item.id === product?.id)
    );
    const isFavorite = useSelector(state =>
        state.cart.products.find(item => item.id === product?.id)?.isFav
    );
    if (isLoading) return <Spinner />;
    if (error) return <p className="text-center py-10 text-red-500">Error loading product.</p>;

    return (
        <section className="container mx-auto px-4 py-10 max-w-[1200px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Image Gallery */}
                <div className="flex flex-col items-center">
                    {/* Main Image */}
                    <div className="w-full max-w-md border rounded-lg overflow-hidden shadow-md">
                        <img
                            src={selectedImage || product.image}
                            alt={product.name}
                            className="w-full h-80 object-contain"
                        />
                    </div>
                    
                    {/* Thumbnail Images */}
                    <div className="flex gap-3 mt-4 overflow-x-auto">
                        {product.images?.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Thumbnail ${index}`}
                                className={`w-20 h-20 object-contain border rounded-md cursor-pointer transition-all ${
                                    selectedImage === image
                                        ? "border-violet-500"
                                        : "border-gray-300 hover:border-gray-500"
                                }`}
                                onClick={() => setSelectedImage(image)}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{product.name}</h2>

                    {/* Availability */}
                    <p className="mt-3 font-semibold text-gray-700 dark:text-gray-400">
                        Availability: <span className="text-green-600">In Stock</span>
                    </p>

                    {/* Price */}
                    <p className="mt-4 text-4xl font-bold text-violet-900">
                        ${product.price}
                        {product.old_price > product.price && (
                            <span className="ml-3 text-lg text-gray-400 line-through">${product.old_price}</span>
                        )}
                    </p>

                    {/* Show Details Button */}
                    <button
                        onClick={() => setIsDetailsShown(!isDetailsShown)}
                        className="mt-5 w-full sm:w-1/2 flex items-center justify-center bg-stone-400 text-white px-4 py-3 rounded-md hover:bg-stone-700 transition"
                    >
                        {isDetailsShown ? "Hide Details" : "Show Details"}
                    </button>

                    {/* Product Description */}
                    {isDetailsShown && <p className="mt-5 text-gray-600 leading-6">{product.description}</p>}

                    {/* Quantity Selector */}
                    <div className="mt-6">
                        <p className="pb-2 text-sm text-gray-500">Quantity</p>
                        <div className="flex items-center border rounded-md overflow-hidden w-fit">
                            <button
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                disabled={!cartProduct || cartProduct.amount <= 1}
                                onClick={() => dispatch(decreaseQuantity(product.id))}
                            >
                                −
                            </button>
                            <div className="px-4 py-2 text-center">{cartProduct ? cartProduct.amount : 0}</div>
                            <button
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300"
                                onClick={() => dispatch(addToCart(product))}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-7 flex flex-col sm:flex-row gap-4">
                        <button
                            className="flex items-center justify-center w-full sm:w-1/2 bg-violet-900 text-white px-4 py-3 rounded-md hover:bg-violet-700 transition"
                            onClick={() => dispatch(addToCart(product))}
                        >
                            <BiShoppingBag className="mr-2 text-lg" />
                            Add to cart
                        </button>
                        <button
                            className="flex items-center justify-center w-full sm:w-1/2 bg-amber-400 text-white px-4 py-3 rounded-md hover:bg-yellow-300 transition"
                            onClick={() => dispatch(toggleFav(product.id))}
                        >
                            {isFavorite ? (
                                <BiSolidHeart className="mr-2 text-xl text-red-600" />
                            ) : (
                                <BiHeart className="mr-2 text-xl text-red-600" />
                            )}
                            Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductDetails;
