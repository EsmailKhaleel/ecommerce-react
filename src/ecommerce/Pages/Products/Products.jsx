import React, { useEffect } from 'react';
import { BiError } from "react-icons/bi";
import Spinner from '../../Components/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../StateManagement/Slices/CartSlice';
import { fetchFirebaseProducts } from '../../StateManagement/Slices/FirebaseSlice';
import ProductCard from '../../Components/ProductCard';

function Products() {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const products = cart.products;
    const status = cart.status;
    const error = cart.error;
    // const firebase = useSelector((state) => state.firebase);
    // const products = firebase.products;
    // const status = firebase.status;
    // const error = firebase.error;
    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
            // dispatch(fetchFirebaseProducts());
        }
    }, [dispatch, products.length]); 

    if (error || status === "failed") 
        return (<div className='flex items-center gap-3 justify-center my-10'><BiError style={errorIconstyle} /><div className='font-bold text-red-500 '>Something went wrong !</div></div>);
    if (status === "loading") 
        return (<div className='flex items-center gap-3 justify-center my-10'><Spinner /></div>);

    return (
        <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-2 xl:lg:grid-cols-3">
            {products?.map(product => (
                <ProductCard product={product} key={product.id}/>
            ))}
        </div>
    );
}

export default Products;

const errorIconstyle = {
    color: "red",
    fontSize: "40px"
};