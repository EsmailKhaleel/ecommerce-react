import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../../Components/ProductCard";
import { toggleFav } from "../../StateManagement/Slices/CartSlice";
import { BiHeart } from "react-icons/bi";

function Wishlist() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.cart.products);

  const favoriteProducts = useMemo(() => {
    return products.filter((product) => product.isFav);
  }, [products]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-center text-secondary dark:text-white mb-4">My Wishlist</h1>

      {favoriteProducts.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <BiHeart className="text-5xl mx-auto mb-2" />
          <p>No favorite products yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
