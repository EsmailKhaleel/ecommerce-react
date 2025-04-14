import React from 'react';
import { useSelector } from 'react-redux';
import EmptyCart from '../../assets/emptyCart.png';
import CartItem from '../../Components/CartItem';

function Cart() {
    const cart = useSelector((state) => state.cart.cartProducts);

    function handleCheckout() {
        alert("Proceeding to checkout!");
    }

    const subtotal = cart.reduce((acc, product) => acc + product.price * product.amount, 0);
    const tax = subtotal * 0.094;
    const total = subtotal + tax;

    if (cart.length === 0) {
        return (
            <div className='flex flex-col justify-center items-center mt-10'>
                <img src={EmptyCart} className='w-[30%] min-w-40' />
                <h3 className='text-3xl font-bold text-gray-700 dark:text-secondary m-10'>Your cart is Empty!</h3>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 lg:px-16 py-8 flex flex-col lg:flex-row gap-10 dark:text-stone-100">
            {/* Shopping Cart Section */}
            <div className="w-full lg:w-2/3">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Shopping Cart</h2>
                
                {cart.map(product => (
                    <CartItem key={product.id} product={product}/>
                ))}

                {/* Subtotal, Tax & Total */}
                <div className="mt-6 text-lg">
                    <p>Subtotal: <span className="font-semibold">${subtotal.toFixed(2)}</span></p>
                    <p>Sales Tax: <span className="font-semibold">${tax.toFixed(2)}</span></p>
                    <p className="text-xl font-bold mt-2">Total: <span>${total.toFixed(2)}</span></p>
                </div>
                
            </div>

            {/* Checkout Section */}
            <div className="w-full lg:w-1/3 p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Checkout</h3>
                <button onClick={handleCheckout} className="w-full bg-black text-white py-3 rounded-md mb-4">
                    Checkout
                </button>
                <button className="w-full bg-yellow-400 text-black py-3 rounded-md flex items-center justify-center">
                    <span className="font-bold">PayPal</span> Checkout
                </button>
                <p className="text-gray-500 dark:text-stone-400 text-sm mt-4">
                    All data is transmitted encrypted via a secure TLS connection.
                </p>
            </div>

        </div>
    );
}

export default Cart;
