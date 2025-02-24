import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { BiShoppingBag } from "react-icons/bi";

function ProductDetails() {
    const [isDetailsShown, setIsDetailsShown] = useState(false);
    const { id } = useParams();
    const { data: productDetailItem, error, isLoading } = useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/products/${id}`);
            return data;
        },
    });

    if (isLoading) return <p className="text-center py-10">Loading...</p>;
    if (error) return <p className="text-center py-10 text-red-500">Error loading product.</p>;

    const images = productDetailItem?.images?.map((img) => ({
        original: img,
        thumbnail: img,
    })) || [];

    return (
        <section className="container max-w-[1200px] mx-auto border-b py-10 lg:flex lg:items-start lg:gap-10">
            {/* Image Gallery */}
            <div className="w-full lg:w-1/2 flex justify-center items-center">
                <div className="w-full max-w-md flex m-5 ">
                    {productDetailItem?.images?.map(imageObject=>
                        <><img src={imageObject} className="w-[50%]" key={Math.random()}/></>
                    )}
                </div>
            </div>

            {/* Product Details */}
            <div className="w-full lg:w-1/2 px-5">
                <h2 className="text-3xl font-bold">{productDetailItem.name}</h2>

                {/* Rating */}
                <div className="mt-2 flex items-center">
                    {[...Array(5)].map((_, index) => (
                        <span key={index} className={`text-xl ${index < 4 ? "text-yellow-500" : "text-gray-300"}`}>
                            ★
                        </span>
                    ))}
                    <p className="ml-3 text-sm text-gray-400">(20 Reviews)</p>
                </div>

                {/* Availability */}
                <p className="mt-3 font-bold">
                    Availability: <span className="text-green-600">In Stock</span>
                </p>
                {/* Brand & Category */}
                <p className="font-bold">Brand: <span className="font-normal">{productDetailItem.brand || "Some Brand"}</span></p>
                <p className="font-bold">Category: <span className="font-normal">{productDetailItem.category || "Technology"}</span></p>
                {/* Price */}
                <p className="mt-4 text-4xl font-bold text-violet-900">
                    ${productDetailItem.price}
                    {productDetailItem.old_price > productDetailItem.price && (
                        <span className="ml-3 text-lg text-gray-400 line-through">${productDetailItem.old_price}</span>
                    )}
                </p>
                {/* Description */}
                <button onClick={() => setIsDetailsShown(prevState => prevState = !prevState)} className="flex items-center justify-center w-1/2 h-12 bg-stone-400 text-white rounded-md hover:bg-stone-700 transition my-5">Show Details</button>
                {isDetailsShown && <p className="mt-5 text-gray-600 leading-6">{productDetailItem.description}</p>}
                {/* Quantity Selector */}
                <div className="mt-6">
                    <p className="pb-2 text-sm text-gray-500">Quantity</p>
                    <div className="flex items-center border rounded-md overflow-hidden w-fit">
                        <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300">−</button>
                        <div className="px-4 py-2 text-center">1</div>
                        <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300">+</button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-7 flex gap-4">
                    <button className="flex items-center justify-center w-1/2 h-12 bg-violet-900 text-white rounded-md hover:bg-violet-700 transition">
                        <BiShoppingBag className="mr-2" />
                        Add to cart
                    </button>
                    <button className="flex items-center justify-center w-1/2 h-12 bg-amber-400 text-white rounded-md hover:bg-yellow-300 transition">
                        {productDetailItem.isFav ? (
                            <MdFavorite className="mr-2 text-red-600" />
                        ) : (
                            <MdFavoriteBorder className="mr-2 text-red-600" />
                        )}
                        Wishlist
                    </button>
                </div>
            </div>
        </section>
    );
}

export default ProductDetails;
