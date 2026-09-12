import { configureStore, combineReducers } from '@reduxjs/toolkit'
import cartReducer from './Slices/CartSlice';
import productsReducer from './Slices/ProductsSlice';
import wishlistReducer from './Slices/WishlistSlice';
import ordersReducer from './Slices/OrdersSlice';
import filterReducer from './Slices/FilterSlice';
import drawerReducer from './Slices/DrawerSlice';

const combinedReducer = combineReducers({
        products: productsReducer,
        filters: filterReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        orders: ordersReducer,
        drawer: drawerReducer,
});
// Ignore responses started under another login, including responses arriving after logout.
const sessionGuard = () => {
    const requests = new Map();
    return next => action => {
        const id = action.meta?.requestId;
        if (id && action.meta.requestStatus === 'pending') requests.set(id, localStorage.getItem('token'));
        if (id && action.meta.requestStatus !== 'pending') {
            const token = requests.get(id);
            requests.delete(id);
            if (token !== localStorage.getItem('token')) return action;
        }
        return next(action);
    };
};
export const store = configureStore({
    reducer: (state, action) => combinedReducer(action.type === 'auth/sessionReset' ? undefined : state, action),
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(sessionGuard),
});