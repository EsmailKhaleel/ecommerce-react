import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './Slices/CartSlice';
import productsReducer from './Slices/ProductsSlice';
import wishlistReducer from './Slices/WishlistSlice';
import ordersReducer from './Slices/OrdersSlice';
import filterReducer from './Slices/FilterSlice';


export const store = configureStore({
    reducer: {
        products: productsReducer,
        filters: filterReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        orders: ordersReducer,
    }
})