import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { addToCart, clearCart, getCart, removeFromCart } from '../../services/cartService';

// Async thunks
export const addToCartAsync = createAsyncThunk(
    'cart/addToCart',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await addToCart(productId, quantity);
            return {
                cart: response.data.cart,
                productId,
                quantity
            };
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to add to cart',
                productId
            });
        }
    }
);

export const removeFromCartAsync = createAsyncThunk(
    'cart/removeFromCart',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await removeFromCart(productId);
            return {
                cart: response.data.cart,
                productId
            };
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to remove from cart',
                productId
            });
        }
    }
);

export const getCartAsync = createAsyncThunk(
    'cart/getCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCart();
            console.log('Fetched cart:', response.data.cart);
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
        }
    }
);

export const clearCartAsync = createAsyncThunk(
    'cart/clearCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await clearCart();
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        status: {
            addToCart: 'idle',
            removeFromCart: 'idle',
            getCart: 'idle',
            clearCart: 'idle'
        },
        loadingItems: {}, // Track loading state per product
        error: null
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Add to cart
            .addCase(addToCartAsync.pending, (state, action) => {
                state.status.addToCart = 'loading';
                // Set loading state for specific product
                state.loadingItems[action.meta.arg.productId] = true;
                state.error = null;
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                state.status.addToCart = 'succeeded';
                // Clear loading state for specific product
                delete state.loadingItems[action.payload.productId];
                toast.success('Cart updated successfully');
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.status.addToCart = 'failed';
                // Clear loading state for specific product
                delete state.loadingItems[action.payload.productId];
                state.error = action.payload.message;
                toast.error(action.payload.message || 'Failed to update cart');
            })
            // Remove from cart
            .addCase(removeFromCartAsync.pending, (state, action) => {
                state.status.removeFromCart = 'loading';
                // Set loading state for specific product
                state.loadingItems[action.meta.arg] = true;
                state.error = null;
            })
            .addCase(removeFromCartAsync.fulfilled, (state, action) => {
                state.status.removeFromCart = 'succeeded';
                // Clear loading state for specific product
                delete state.loadingItems[action.payload.productId];
                toast.success('Item removed from cart');
            })
            .addCase(removeFromCartAsync.rejected, (state, action) => {
                state.status.removeFromCart = 'failed';
                // Clear loading state for specific product
                delete state.loadingItems[action.payload.productId];
                state.error = action.payload.message;
                toast.error(action.payload.message || 'Failed to remove item');
            })
            // Get cart
            .addCase(getCartAsync.pending, (state) => {
                state.status.getCart = 'loading';
            })
            .addCase(getCartAsync.fulfilled, (state, action) => {
                state.status.getCart = 'succeeded';
                state.items = action.payload;
            })
            .addCase(getCartAsync.rejected, (state, action) => {
                state.status.getCart = 'failed';
                state.error = action.payload;
                toast.error(action.payload || 'Failed to fetch cart');
            })
            // Clear cart
            .addCase(clearCartAsync.pending, (state) => {
                state.status.clearCart = 'loading';
                state.error = null;
            })
            .addCase(clearCartAsync.fulfilled, (state) => {
                state.status.clearCart = 'succeeded';
                state.items = [];
            })
            .addCase(clearCartAsync.rejected, (state, action) => {
                state.status.clearCart = 'failed';
                state.error = action.payload;
                toast.error(action.payload || 'Failed to clear cart');
            });
    }
});

export const { setCart } = cartSlice.actions;
export default cartSlice.reducer;
