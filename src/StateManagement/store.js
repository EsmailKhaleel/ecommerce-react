import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './Slices/CartSlice';
import productsReducer from './Slices/ProductsSlice';
import wishlistReducer from './Slices/WishlistSlice';

export const store = configureStore({
    reducer: {
        products: productsReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
    }
})